document.addEventListener("DOMContentLoaded", () => {
    fetch("/handbook/shared/menu.html")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load menu");
            }
            return response.text();
        })
        .then(html => {
            document.getElementById("menu-placeholder").innerHTML = html;
        })
        .catch(error => {
            console.error(error);
        });
});
