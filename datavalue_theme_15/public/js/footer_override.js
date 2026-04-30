frappe.ready(() => {
    let footer = document.querySelector(".app-footer");

    if (footer) {
        footer.innerHTML = `
            Powered by 
            <a href="https://webuildsystems.netlify.app" target="_blank">
                Sheikh Tousiff
            </a>
        `;
        footer.style.visibility = "visible";
    }
});