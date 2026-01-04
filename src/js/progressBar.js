const progressBar = document.getElementById("scroll-progress");
let ticking = false;

function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    progressBar.style.width = progress + "%";
    ticking = false;
}

window.addEventListener("scroll", () => {
    if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
    }
});
