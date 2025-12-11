// -------------------------------------------
// UTILITY: Display file in its preview area
// -------------------------------------------
function displayFile(sectionId, fileName, fileType, fileDataURL, isBlobURL = false) {
    const container = document.getElementById(sectionId + "Display");
    container.innerHTML = ""; // Clear previous preview

    const wrapper = document.createElement("div");
    wrapper.classList.add("file-item");

    // Video preview
    if (fileType.startsWith("video/")) {
        wrapper.innerHTML = `
            <p>${fileName}</p>
            <video controls src="${fileDataURL}"></video>
            <a class="download-btn" href="${fileDataURL}" download="${fileName}">Download Video</a>
            <p style="color:red;font-size:0.9em;">(Video cannot be saved permanently)</p>
        `;
    }

    // PDF preview
    else if (fileType === "application/pdf") {
        wrapper.innerHTML = `
            <p>${fileName}</p>
            <embed src="${fileDataURL}" type="application/pdf" width="100%" height="500px">
            <a class="download-btn" href="${fileDataURL}" download="${fileName}">Download PDF</a>
        `;
    }

    // Image preview
    else if (fileType.startsWith("image/")) {
        wrapper.innerHTML = `
            <p>${fileName}</p>
            <img src="${fileDataURL}" style="width:100%;border-radius:5px;">
            <a class="download-btn" href="${fileDataURL}" download="${fileName}">Download Image</a>
        `;
    }

    // Text preview
    else if (fileType.startsWith("text/")) {
        const textContent = atob(fileDataURL.split(",")[1]); 
        wrapper.innerHTML = `
            <p>${fileName}</p>
            <textarea readonly style="width:100%;height:200px;">${textContent}</textarea>
            <a class="download-btn" href="${fileDataURL}" download="${fileName}">Download Text File</a>
        `;
    }

    // Other document types (Word, PPT, etc.)
    else {
        wrapper.innerHTML = `
            <p>${fileName}</p>
            <a class="download-btn" href="${fileDataURL}" download="${fileName}">Download File</a>
            <p>(Preview not available for this file type)</p>
        `;
    }

    container.appendChild(wrapper);
}

// -------------------------------------------
// LOAD SAVED NON-VIDEO FILES ON PAGE OPEN
// -------------------------------------------
window.onload = function () {
    const sections = ["resume", "autobiography", "invention", "culture", "society", "others"];

    sections.forEach(section => {
        const saved = localStorage.getItem(section);
        if (saved) {
            const obj = JSON.parse(saved);
            displayFile(section, obj.name, obj.type, obj.content, false);
        }
    });
};

// -------------------------------------------
// UPLOAD HANDLER
// -------------------------------------------
window.uploadFile = function (event, section) {
    const file = event.target.files[0];
    if (!file) return;

    const fileType = file.type;
    const fileName = file.name;

    // Videos – preview only (NOT saved)
    if (fileType.startsWith("video/")) {
        const blobURL = URL.createObjectURL(file);
        displayFile(section, fileName, fileType, blobURL, true);
        return;
    }

    // All other files – convert to base64
    const reader = new FileReader();

    reader.onload = function (e) {
        const dataURL = e.target.result;

        // Save file metadata + content
        const fileObj = {
            name: fileName,
            type: fileType,
            content: dataURL
        };

        try {
            localStorage.setItem(section, JSON.stringify(fileObj));
        } catch (e) {
            console.warn("Storage limit reached or error saving:", e);
        }

        displayFile(section, fileName, fileType, dataURL, false);
    };

    reader.readAsDataURL(file);
};
