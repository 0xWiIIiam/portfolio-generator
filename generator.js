document.addEventListener("DOMContentLoaded", () => {
    const downloadBtn = document.getElementById("downloadBtn");

    downloadBtn.addEventListener("click", () => {
        const data = collectFormData();
        handleImageUpload().then(base64Image => {
            data.picture = base64Image;
            const html = renderHTML(data);
            const blob = new Blob([html], { type: "text/html" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `${data.name.replace(/\s+/g,'_')}_portfolio.html`;
            link.click();
        });
    });

    const addSocialBtn = document.getElementById("addSocialBtn");
    addSocialBtn.addEventListener("click", () => {
        const wrapper = document.getElementById("socialLinksWrapper");
        const div = document.createElement("div");
        div.classList.add("social-link");
        div.innerHTML = `
            <select class="social-type">
                <option value="github">GitHub</option>
                <option value="twitter">Twitter</option>
                <option value="linkedin">LinkedIn</option>
                <option value="instagram">Instagram</option>
                <option value="email">Email</option>
            </select>
            <input type="text" placeholder="https://..." class="social-url" />
            <button type="button" class="remove-social">Remove</button>
        `;
        wrapper.appendChild(div);

        div.querySelector(".remove-social").addEventListener("click", () => {
            div.remove();
        });

        updatePreview();
    });
});

function collectFormData() {
    const fields = document.querySelectorAll("input[type='text'], textarea");
    const color = document.getElementById("colorPicker").value;

    const socialLinks = [];
    document.querySelectorAll(".social-link").forEach(sl => {
        const type = sl.querySelector(".social-type").value;
        const url = sl.querySelector(".social-url").value.trim();
        if(url) socialLinks.push({ type, url });
    });

    return {
        name: fields[0].value || "John Doe",
        bio: fields[1].value || "A short bio goes here...",
        picture: "",
        color,
        socialLinks
    };
}

function handleImageUpload() {
    return new Promise(resolve => {
        const fileInput = document.getElementById("pfpUpload");
        const file = fileInput.files[0];
        if (!file) {
            resolve("placeholder.png");
            return;
        }
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
    });
}

function renderHTML(data) {
    const colors = { background: data.color, text: "#fff", link: "#fff" };
    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${data.name} - Portfolio</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<style>
body { font-family: Arial,sans-serif; margin:0; padding:0; background:${colors.background}; color:${colors.text}; text-align:center;}
.container { max-width:800px; margin:0 auto; padding:60px 20px;}
img { width:160px; height:160px; border-radius:50%; object-fit:cover; border:4px solid rgba(255,255,255,0.5); margin-bottom:20px; box-shadow:0 4px 12px rgba(0,0,0,0.2);}
h1 { font-size:36px; margin:10px 0;}
p { font-size:18px; line-height:1.5; max-width:600px; margin:0 auto 30px;}
.links a { display:inline-flex; align-items:center; gap:8px; margin:10px; padding:8px 16px; font-size:18px; text-decoration:none; color:${colors.link}; border:1px solid ${colors.link}; border-radius:8px;}
.links a:hover { background:${colors.link}; color:${colors.text};}
@media (max-width:600px) { .container { padding:30px 10px;} img { width:120px; height:120px;} h1 { font-size:28px;} p { font-size:16px;} }
</style>
</head>
<body>
<div class="container">
<img src="${data.picture}">
<h1>${data.name}</h1>
<p>${data.bio}</p>
<div class="links">
${data.socialLinks.map(sl => {
    let icon = "fa-link";
    if(sl.type === "github") icon = "fa-brands fa-github";
    if(sl.type === "twitter") icon = "fa-brands fa-twitter";
    if(sl.type === "linkedin") icon = "fa-brands fa-linkedin";
    if(sl.type === "instagram") icon = "fa-brands fa-instagram";
    if(sl.type === "email") icon = "fa-solid fa-envelope";
    const href = sl.type === "email" ? `mailto:${sl.url}` : sl.url;
    return `<a href="${href}" target="_blank"><i class="${icon}"></i> ${sl.type.charAt(0).toUpperCase()+sl.type.slice(1)}</a>`;
}).join("")}
</div>
</div>
</body>
</html>
`;
}
