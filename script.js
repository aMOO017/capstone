const sections = ["resume", "autobiography", "invention", "culture", "society", "others"];

// Load saved links on page load
window.onload = function() {
    sections.forEach(section => {
        const saved = JSON.parse(localStorage.getItem(section)) || [];
        saved.forEach(link => displayFile(section, link));
    });
};

// Add a new link
function addLink(section) {
    const input = document.getElementById(section + "Input");
    let url = input.value.trim();
    if (!url) return alert("Please paste a valid Google Drive link.");

    let saved = JSON.parse(localStorage.getItem(section)) || [];
    saved.push(url);
    localStorage.setItem(section, JSON.stringify(saved));

    displayFile(section, url);
    input.value = "";
}

// Convert Google Drive sharing link to embeddable link
function convertToEmbedURL(url) {
    const fileIdMatch = url.match(/[-\w]{25,}/);
    if (!fileIdMatch) return null;
    const fileId = fileIdMatch[0];

    if (url.includes("video") || url.includes(".mp4")) {
        return `https://drive.google.com/file/d/${fileId}/preview`;
    } else if (url.includes(".pdf") || url.includes("pdf")) {
        return `https://drive.google.com/file/d/${fileId}/preview`;
    } else if (url.includes(".doc") || url.includes(".docx") || url.includes("document")) {
        return `https://docs.google.com/document/d/${fileId}/preview`;
    } else if (url.includes(".ppt") || url.includes(".pptx")) {
        return `https://docs.google.com/presentation/d/${fileId}/embed?start=false&loop=false&delayms=3000`;
    } else if (url.includes(".jpg") || url.includes(".jpeg") || url.includes(".png") || url.includes(".gif")) {
        return `https://drive.google.com/uc?export=view&id=${fileId}`;
    } else {
        // default to file preview
        return `https://drive.google.com/file/d/${fileId}/preview`;
    }
}

// Display the file inside the section
function displayFile(section, url) {
    const container = document.getElementById(section + "Display");

    const div = document.createElement("div");
    div.className = "file-item";

    const embedURL = convertToEmbedURL(url);

    if (!embedURL) {
        div.innerHTML = "<p>Cannot embed this file. Check the link.</p>";
    } else {
        if (url.match(/\.(pdf)$/i) || url.includes("/file/d/")) {
            // Embed PDFs and videos
            div.innerHTML = `<iframe src="${embedURL}" width="100%" height="400px" frameborder="0" allowfullscreen></iframe>`;
        } else if (url.match(/\.(doc|docx)$/i)) {
            div.innerHTML = `<iframe src="${embedURL}" width="100%" height="400px" frameborder="0"></iframe>`;
        } else if (url.match(/\.(ppt|pptx)$/i)) {
            div.innerHTML = `<iframe src="${embedURL}" width="100%" height="400px" frameborder="0" allowfullscreen></iframe>`;
        } else if (url.match(/\.(jpg|jpeg|png|gif)$/i)) {
            div.innerHTML = `<img src="${embedURL}" alt="Image" style="width:100%;border-radius:5px;">`;
        } else {
            // default iframe preview
            div.innerHTML = `<iframe src="${embedURL}" width="100%" height="400px" frameborder="0"></iframe>`;
        }
    }

    container.appendChild(div);
}
