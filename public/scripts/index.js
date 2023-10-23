// preloader

var loader = document.getElementById("preloader");

window.addEventListener("load", () => {
    loader.style.top = 0;

    setTimeout(() => {
        loader.style.top = "100vh";
    }, 100);
});