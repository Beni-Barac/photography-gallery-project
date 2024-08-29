let imageArr = JSON.parse(localStorage.getItem('galleryMetadata')) || [];

function saveToLocalStorage() {
    localStorage.setItem('galleryMetadata', JSON.stringify(imageArr.map(item => ({
        themes: item.themes,
        description: item.description
    }))));
}

function saveImageToIndexedDB(imageData, index) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('GalleryDB', 1);

        request.onerror = (event) => reject("IndexedDB error: " + event.target.error);

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(['images'], 'readwrite');
            const store = transaction.objectStore('images');
            
            const saveRequest = store.put({ id: index, data: imageData });
            
            saveRequest.onerror = (event) => reject("Save error: " + event.target.error);
            saveRequest.onsuccess = (event) => resolve();
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore('images', { keyPath: 'id' });
        };
    });
}

function getImageFromIndexedDB(index) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('GalleryDB', 1);

        request.onerror = (event) => reject("IndexedDB error: " + event.target.error);

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(['images'], 'readonly');
            const store = transaction.objectStore('images');
            
            const getRequest = store.get(index);
            
            getRequest.onerror = (event) => reject("Get error: " + event.target.error);
            getRequest.onsuccess = (event) => resolve(getRequest.result.data);
        };
    });
}
