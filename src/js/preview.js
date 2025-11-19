document.addEventListener("DOMContentLoaded", () => {
    const fields = document.querySelectorAll("input[type='text'], textarea, input[type='color']");
    const fileInput = document.getElementById("pfpUpload");
    const previewFrame = document.getElementById("previewFrame");
    const addSocialBtn = document.getElementById("addSocialBtn");

    function updatePreview() {
        const data = collectFormData();
        handleImageUpload().then(base64Image => {
            data.picture = base64Image;
            const html = renderHTML(data);
            const iframeDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
            iframeDoc.open();
            iframeDoc.write(html);
            iframeDoc.close();
        });
    }

    fields.forEach(field => field.addEventListener("input", updatePreview));
    fileInput.addEventListener("change", updatePreview);
    addSocialBtn.addEventListener("click", updatePreview);
    document.querySelector(".generate-btn").addEventListener("click", updatePreview);

    updatePreview();
});
