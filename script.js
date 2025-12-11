// Define your files here (replace FILE_ID with actual Google Drive file IDs)
const portfolioFiles = {
    resume: [
        { id: "FILE_ID_FOR_RESUME_1", type: "pdf" },
        { id: "FILE_ID_FOR_RESUME_2", type: "pdf" }
    ],
    autobiography: [
        { id: "FILE_ID_FOR_AUTOBIO", type: "doc" }
    ],
    invention: [
        { id: "FILE_ID_FOR_VIDEO", type: "video" }
    ],
    culture: [
        { id: "FILE_ID_FOR_CULTURE", type: "doc" }
    ],
    society: [
        { id: "FILE_ID_FOR_SOCIETY", type: "doc" }
    ],
    others: [
        { id: "FILE_ID_FOR_OTHER", type: "pdf" }
    ]
};

// Function to generate embed URL based on file type
function getEmbedURL(file) {
    switch(file.type) {
        case "pdf":
        case "video":
            return `https://drive.google.com/file/d/${file.id}/preview`;
        case "doc":
            return `https://docs.google.com/document/d/${file.id}/preview`;
        case "ppt":
            return `https://docs.google.com/presentation/d/${file.id}/embed?start=false&loop=false&delayms=3000`;
        case "image":
            return `https://drive.google.com/uc?export=view&id=${file.id}`;
        default:
            return `https://drive.google.com/file/d/${file.id}/preview`;
    }
}

// Function to display all files in all sections
function displayPortfolio() {
    for (const section in portfolioFiles) {
        const container = document.getElementById(section + "Display");
        if (!container) continue;

        portfolioFiles[section].forEach(file => {
            const div = document.createElement("div");
            div.className = "file-item";

            let embedHTML = "";
            const embedURL = getEmbedURL(file);

            if(file.type === "pdf" || file.type === "video") {
                embedHTML = `<iframe src="${embedURL}" width="100%" height="400px" allowfullscreen></iframe>`;
            } else if(file.type === "doc" || file.type === "ppt") {
                embedHTML = `<iframe src="${embedURL}" width="100%" height="400px"></iframe>`;
            } else if(file.type === "image") {
                embedHTML = `<img src="${embedURL}" alt="Image" style="width:100%;border-radius:5px;">`;
            } else {
                embedHTML = `<iframe src="${embedURL}" width="100%" height="400px"></iframe>`;
            }

            // Download button
            const downloadURL = `https://drive.google.com/uc?export=download&id=${file.id}`;
            const downloadButton = `<a href="${downloadURL}" target="_blank" class="download-btn">Download</a>`;

            div.innerHTML = embedHTML + "<div style='margin-top:8px;'>" + downloadButton + "</div>";
            container.appendChild(div);
        });
    }
}

// Call displayPortfolio on page load
window.onload = displayPortfolio;
