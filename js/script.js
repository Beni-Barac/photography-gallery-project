//selectors
const darkModeButton = document.getElementById("dark-mode-button");
const addPhotoButton = document.getElementById("add-photo-button");
const addPhotoModal = document.getElementById("add-photo-modal");

//state
const theme = localStorage.getItem('theme');

//on mount
theme && document.body.classList.toggle(theme);

//handlers
handleThemeToggle = () => {
    document.body.classList.toggle("dark-mode");
    if(document.body.classList.contains("dark-mode")) {
        localStorage.setItem('theme', 'dark-mode');
    } else {
        localStorage.removeItem('theme');
    }
};

handleAddPhotoModalePositioning = () => {
    addPhotoModal.classList.remove('add-photo-modal-hidden');
    
    const addPhotoButtonRect = addPhotoButton.getBoundingClientRect();
    const addPhotoModalRect = addPhotoModal.getBoundingClientRect();

    addPhotoModal.style.bottom = `${window.innerHeight - addPhotoButtonRect.top + 20}px`;
    addPhotoModal.style.left = `${addPhotoButtonRect.left + (addPhotoButtonRect.width / 2) - (addPhotoModalRect.width / 2)}px`;
};


//events
darkModeButton.addEventListener('click', handleThemeToggle);
addPhotoButton.addEventListener('click', handleAddPhotoModalePositioning);

