//selectors
const darkModeButton = document.getElementById("dark-mode-button");

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

//events
darkModeButton.addEventListener('click', handleThemeToggle);