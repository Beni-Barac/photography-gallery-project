//selectors
const form = document.getElementById('add-photo-form');

//state

//on mount
// Initial gallery setup
document.addEventListener('DOMContentLoaded', () => {
    updateGallery();
});

//handlers
function handleFormSubmit(event) {
    event.preventDefault();

    const file = getSelectedFile();
    if (file) {
        readImageFile(file).then(imageUrl => {
            const formData = {
                themes: getSelectedThemes(),
                description: document.getElementById('photo-description').value
            };
            const index = imageArr.length;
            imageArr.push(formData);
            
            saveImageToIndexedDB(imageUrl, index)
                .then(() => {
                    saveToLocalStorage();
                    updateGallery();
                    clearForm();
                    closeAddPhotoModal();
                })
                .catch(error => {
                    console.error("Error saving image:", error);
                    imageArr.pop(); // Remove the last item if save failed
                });
        }).catch(error => {
            console.error("Error reading file", error);
        });
    }
}

function saveToLocalStorage() {
    localStorage.setItem('galleryImages', JSON.stringify(imageArr));
}

function clearForm() {
    document.getElementById('add-photo-form').reset();
    document.getElementById('image-input').value = '';
    const checkboxes = document.querySelectorAll('.theme-check-input');
    checkboxes.forEach(checkbox => checkbox.checked = false);
}

function closeAddPhotoModal() {
    const modal = document.getElementById('add-photo-modal');
    modal.classList.add('add-photo-modal-hidden');
}

function openAddPhotoModal() {
    const modal = document.getElementById('add-photo-modal');
    modal.classList.remove('add-photo-modal-hidden');
}

function updateGallery() {
    const containers = document.querySelectorAll('.image-container');
    const startIndex = (currentPage - 1) * 9;
    const endIndex = startIndex + 9;
    const currentImages = imageArr.slice(startIndex, endIndex);

    containers.forEach((container, index) => {
        const img = container.querySelector('.image-picture');
        const info = container.querySelector('.image-info-container');
        
        if(currentImages[index]) {
            getImageFromIndexedDB(startIndex + index)
                .then(imageData => {
                    img.src = imageData;
                    img.alt = `Gallery image ${startIndex + index + 1}`;
                    info.textContent = currentImages[index].description;
                    container.style.display = 'flex';
                })
                .catch(error => {
                    console.error("Error fetching image:", error);
                    container.style.display = 'none';
                });
        } else {
            container.style.display = 'none';
        }
    });
}

let currentPage = 1;
const imagesPerPage = 9;

function updatePagination() {
    const totalPages = Math.ceil(imageArr.length / imagesPerPagePerPage);
    document.getElementById('current-page').textContent = `${currentPage}/${totalPages}`;

    document.getElementById('prev-button').disabled = currentPage === 1;
    document.getElementById('next-button').disabled = currentPage === totalPages || imageArr.length === 0;
}

function nextPage() {
    if(currentPage < Math.ceil(imageArr.length / imagesPerPage)) {
        currentPage++;
        updateGallery();
    }
}

function prevPage() {
    if(currentPage > 1) {
        currentPage--;
        updateGallery();
    }
}

function getSelectedFile() {
    const fileInput = document.getElementById("image-input");
    return fileInput.files[0] || null;
}

function getSelectedThemes() {
    const checkboxes = document.querySelectorAll('.theme-check-input:checked');
    return Array.from(checkboxes).map(checkbox => checkbox.value);
}

function readImageFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}



//events
form.addEventListener('submit', handleFormSubmit);
document.getElementById('next-button').addEventListener('click', nextPage);
document.getElementById('prev-button').addEventListener('click', prevPage);
document.getElementById('add-photo-button').addEventListener('click', openAddPhotoModal);
document.getElementById('cancel-add-photo-button').addEventListener('click', () => {
    clearForm();
    closeAddPhotoModal();
});