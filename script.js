// Sections we have
const sections = ["resume", "autobiography", "invention", "culture", "society", "others"];

// Load saved links from localStorage on page load
window.onload = function() {
    sections.forEach(section => {
        const saved = JSON.parse(localStorage.getItem(section)) || [];
        saved.forEach(link => displayLink(section, link));
    });
};

// Add a new link
function addLink(section) {
    const input = document.getElementById(section + "Input");
    let url = input.value.trim();
    if (!url) return alert("Please paste a valid Google Drive link.");
    
    // Save link in localStorage
    let saved = JSON.parse(localStorage.getItem(section)) || [];
    saved.push(url);
    localStorage.setItem(section, JSON.stringify(saved));

    // Display on page
    displayLink(section, url);

    // Clear input
    input.value = "";
}

// Display a single link
function displayLink(section, url) {
    const container = document.getElementById(section + "Display");

    // Create wrapper div
    const div = document.createElement("div");
    div.className = "file-item";

    // Extract Google Drive file ID if possible for embed
    const match = url.match(/[-\w]{25,}/);
    const fileId = match ? match[0] : null;

    let embedHTML = "";

    // Attempt to embed video, PDF, or image based on Google Drive preview link
    if (fileId) {
        if (url.includes("/view?usp=sharing") || url.includes("/edit")) {
            // convert to direct link
            const directURL = `https://drive.google.com/uc?export=download&id=${fileId}`;
            embedHTML = `<a href="${directURL}" target="_blank">Open / Download File</a>`;
        } else {
            embedHTML = `<a href="${url}" target="_blank">Open / Download File</a>`;
        }
    } else {
        embedHTML = `<a href="${url}" target="_blank">Open / Download File</a>`;
    }

    div.innerHTML = embedHTML;
    container.appendChild(div);
}
