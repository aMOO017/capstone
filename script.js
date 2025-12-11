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

// Convert Google Drive sharing link to embeddable URL
function convertToEmbedURL(url) {
    const fileIdMatch = url.match(/[-\w]{25,}/);
    if (!fileIdMatch) return null;
    const fileId = fileIdMatch[0];

    if (url.includes("video") || url.includes(".mp4") || url.includes("/file/d/")) {
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
        return `https://drive.google.com/file/d/${fileId}/preview`;
    }
}

// Display the file inside the section
function displayFile(section, url) {
    const container = document.getElementById(section + "Display");

    const div = document.createElement("div");
    div.className = "file-item";

    const embedURL = convertToEmbedURL(url);

    let contentHTML = "";

    if (!embedURL) {
        contentHTML = "<p>Cannot embed this file. Check the link.</p>";
    } else {
        if (url.match(/\.(pdf)$/i) || url.includes("/file/d/")) {
            contentHTML = `<iframe src="${embedURL}" width="100%" height="400px" frameborder="0" allowfullscreen></iframe>`;
        } else if (url.match(/\.(doc|docx)$/i)) {
            contentHTML = `<iframe src="${embedURL}" width="100%" height="400px" frameborder="0"></iframe>`;
        } else if (url.match(/\.(ppt|pptx)$/i)) {
            contentHTML = `<iframe src="${embedURL}" width="100%" height="400px" frameborder="0" allowfullscreen></iframe>`;
        } else if (url.match(/\.(jpg|jpeg|png|gif)$/i)) {
            contentHTML = `<img src="${embedURL}" alt="Image" style="width:100%;border-radius:5px;">`;
        } else {
            contentHTML = `<iframe src="${embedURL}" width="100%" height="400px" frameborder="0"></iframe>`;
        }
    }

    // Download button (Google Drive direct download)
    const fileIdMatch = url.match(/[-\w]{25,}/);
    let downloadURL = fileIdMatch ? `https://drive.google.com/uc?export=download&id=${fileIdMatch[0]}` : url;
    const downloadButton = `<a href="${downloadURL}" target="_blank" class="download-btn">Download</a>`;

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.style.background = "#d9534f";
    deleteButton.style.color = "#fff";
    deleteButton.style.border = "none";
    deleteButton.style.padding = "6px 10px";
    deleteButton.style.borderRadius = "5px";
    deleteButton.style.marginLeft = "5px";
    deleteButton.onclick = function() {
        deleteFile(section, url, div);
    };

    div.innerHTML = contentHTML + "<div style='margin-top:8px;'>" + downloadButton + "</div>";
    div.appendChild(deleteButton);

    container.appendChild(div);
}

// Delete file from localStorage and remove from display
function deleteFile(section, url, divElement) {
    if (!confirm("Are you sure you want to delete this file from the section?")) return;

    let saved = JSON.parse(localStorage.getItem(section)) || [];
    saved = saved.filter(link => link !== url);
    localStorage.setItem(section, JSON.stringify(saved));

    divElement.remove();
}
