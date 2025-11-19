function updatePreview() {
    const data = collectFormData();
    handleImageUpload().then(pic => {
        data.picture = pic;
        const html = renderHTML(data);
        const iframe = document.getElementById("previewFrame");
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.open();
        doc.write(html);
        doc.close();
    });
}
