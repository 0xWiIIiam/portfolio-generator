document.addEventListener("DOMContentLoaded", () => {
    initEvents();
    addInitialFields();
});

function initEvents() {
    document.getElementById("addSocialBtn").addEventListener("click", addSocialLink);
    document.getElementById("addProjectBtn").addEventListener("click", addProject);
    document.getElementById("pfpUpload").addEventListener("change", updatePreview);
    document.getElementById("colorPicker").addEventListener("input", updatePreview);
    document.getElementById("downloadBtn").addEventListener("click", downloadHTML);

    document.querySelectorAll("#nameInput, #bioInput")
        .forEach(el => el.addEventListener("input", updatePreview));
}

function addInitialFields() {
    addSocialLink();
    addProject();
    updatePreview();
}

function addSocialLink() {
    const wrap = document.getElementById("socialLinksWrapper");
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
        <input type="text" class="social-url" placeholder="https://...">
        <button type="button" class="remove-social">X</button>
    `;

    div.querySelector(".remove-social").addEventListener("click", () => {
        div.remove();
        updatePreview();
    });

    wrap.appendChild(div);
    updatePreview();
}

function addProject() {
    const wrap = document.getElementById("projectsWrapper");
    const div = document.createElement("div");
    div.classList.add("project");

    div.innerHTML = `
        <input type="text" class="project-title" placeholder="Project Title">
        <input type="text" class="project-link" placeholder="https://project-url.com">
        <textarea class="project-desc" placeholder="Short project description"></textarea>
        <button type="button" class="remove-project">X</button>
    `;

    div.querySelector(".remove-project").addEventListener("click", () => {
        div.remove();
        updatePreview();
    });

    div.querySelectorAll("input, textarea").forEach(el => {
        el.addEventListener("input", updatePreview);
    });

    wrap.appendChild(div);
    updatePreview();
}

function collectFormData() {
    const socials = [];
    document.querySelectorAll(".social-link").forEach(d => {
        const type = d.querySelector(".social-type").value;
        const url = d.querySelector(".social-url").value.trim();
        if (url) socials.push({ type, url });
    });

    const projects = [];
    document.querySelectorAll(".project").forEach(p => {
        const title = p.querySelector(".project-title").value.trim();
        const link = p.querySelector(".project-link").value.trim();
        const desc = p.querySelector(".project-desc").value.trim();
        if (title) projects.push({ title, link, desc });
    });

    return {
        name: document.getElementById("nameInput").value || "John Doe",
        bio: document.getElementById("bioInput").value || "A short bio goes here...",
        color: document.getElementById("colorPicker").value,
        socialLinks: socials,
        projects
    };
}

function handleImageUpload() {
    return new Promise(resolve => {
        const file = document.getElementById("pfpUpload").files[0];
        if (!file) return resolve("../public/placeholder.png");

        const r = new FileReader();
        r.onload = () => resolve(r.result);
        r.readAsDataURL(file);
    });
}

function downloadHTML() {
    const data = collectFormData();
    handleImageUpload().then(pic => {
        data.picture = pic;
        const html = renderHTML(data);
        const blob = new Blob([html], { type: "text/html" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${data.name.replace(/\s+/g, "_")}_portfolio.html`;
        a.click();
    });
}

function renderHTML(data) {
    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${data.name} - Portfolio</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<style>
body { font-family: Arial; margin:0; padding:0; background:${data.color}; color:#fff; text-align:center; }
.container { max-width:800px; margin:auto; padding:40px 20px; }
img { width:160px; height:160px; border-radius:50%; object-fit:cover; border:4px solid #fff; }
h1 { font-size:36px; margin:15px 0; }
.projects { margin-top:40px; text-align:left; }
.project { background:rgba(255,255,255,0.1); padding:15px; border-radius:8px; margin-bottom:15px; }
.project h3 { margin:0 0 8px; }
.links a { margin:10px; padding:8px 16px; border:1px solid #fff; border-radius:8px; display:inline-flex; align-items:center; gap:8px; color:#fff; text-decoration:none; }
</style>
</head>

<body>
<div class="container">
    <img src="${data.picture}">
    <h1>${data.name}</h1>
    <p>${data.bio}</p>

<div class="links">
    ${data.socialLinks.map(sl => {
        const icons = {
            github: "fa-brands fa-github",
            twitter: "fa-brands fa-twitter",
            linkedin: "fa-brands fa-linkedin",
            instagram: "fa-brands fa-instagram",
            email: "fa-solid fa-envelope"
        };
        const href = sl.type === "email" ? `mailto:${sl.url}` : sl.url;

        return `<a href="${href}" target="_blank">
            <i class="${icons[sl.type]}"></i>
            ${sl.type.charAt(0).toUpperCase() + sl.type.slice(1)}
        </a>`;
    }).join("")}
</div>

    <div class="projects">
        ${data.projects.map(p => `
            <div class="project">
                <h3>${p.title}</h3>
                <p>${p.desc}</p>
                ${p.link ? `<a href="${p.link}" target="_blank">View Project</a>` : ""}
            </div>
        `).join("")}
    </div>
</div>
</body>
</html>
`;
}
