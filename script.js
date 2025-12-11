// Load saved files from localStorage on startup
window.onload = function() {
    ["resume", "autobiography", "culture", "society"].forEach(section => {
        let saved = localStorage.getItem(section);
        if (saved) {
            displaySavedFile(section, JSON.parse(saved));
        }
    });
};

function uploadFile(event, section) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const base64 = e.target.result;

        // Store only non-video files in localStorage
        if (!file.type.startsWith("video")) {
            localStorage.setItem(section, JSON.stringify({
                name: file.name,
                type: file.type,
                content: base64
            }));
        }

        displayFile(section, file.name, file.type, base64);
    };

    reader.readAsDataURL(file);
}

function displaySavedFile(section, savedFile) {
    displayFile(section, savedFile.name, savedFile.type, savedFile.content);
}

function displayFile(section, name, type, content) {
    const display = document.getElementById(section + "Display");
    display.innerHTML = ""; // Clear old preview

    let div = document.createElement("div");
    div.classList.add("file-item");

    // Text or PDF preview
    if (type.includes("pdf")) {
        div.innerHTML = `
            <p>${name}</p>
            <embed src="${content}" width="100%" height="400px"></embed>
            <br><a href="${content}" download="${name}">Download</a>
        `;
    }
    else if (type.includes("text")) {
        div.innerHTML = `
            <p>${name}</p>
            <textarea style="width:100%;height:200px;">${atob(content.split(",")[1])}</textarea>
            <br><a href="${content}" download="${name}">Download</a>
        `;
    }
    else if (type.startsWith("video")) {
        div.innerHTML = `
            <p>${name}</p>
            <video controls src="${content}"></video>
            <br><a href="${content}" download="${name}">Download</a>
            <p style="color:red;">(Video will not be saved permanently – browser storage limit)</p>
        `;
    }
    else {
        div.innerHTML = `
            <p>${name}</p>
            <a href="${content}" download="${name}">Download File</a>
        `;
    }

    display.appendChild(div);
}
