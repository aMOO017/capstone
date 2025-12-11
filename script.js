function previewFiles(input, outputBox) {
    outputBox.innerHTML = "";
    const files = input.files;

    for (let file of files) {
        const div = document.createElement("div");
        div.classList.add("file-item");

        // Create file URL
        const url = URL.createObjectURL(file);

        // Videos
        if (file.type.startsWith("video/")) {
            div.innerHTML = `<p>${file.name}</p>
                             <video controls src="${url}"></video>`;
        }

        // Images
        else if (file.type.startsWith("image/")) {
            div.innerHTML = `<p>${file.name}</p>
                             <img src="${url}">`;
        }

        // PDF View
        else if (file.type === "application/pdf") {
            div.innerHTML = `<p>${file.name}</p>
                             <iframe src="${url}" height="500px"></iframe>`;
        }

        // Text files
        else if (file.type.startsWith("text/")) {
            const reader = new FileReader();
            reader.onload = (e) => {
                div.innerHTML = `<p>${file.name}</p>
                                 <textarea style="width:100%;height:200px;">${e.target.result}</textarea>`;
            };
            reader.readAsText(file);
        }

        // Word or PowerPoint → DOWNLOAD ONLY
        else {
            div.innerHTML = `<p>${file.name}</p>
                             <a class="download-btn" href="${url}" download="${file.name}">
                                Download File
                             </a>`;
        }

        outputBox.appendChild(div);
    }
}

// Connect input to preview
document.getElementById("resumeFiles").addEventListener("change",
    () => previewFiles(resumeFiles, resumePreview));

document.getElementById("autobiographyFiles").addEventListener("change",
    () => previewFiles(autobiographyFiles, autobiographyPreview));

document.getElementById("videoFiles").addEventListener("change",
    () => previewFiles(videoFiles, videoPreview));

document.getElementById("cultureFiles").addEventListener("change",
    () => previewFiles(cultureFiles, culturePreview));

document.getElementById("societyFiles").addEventListener("change",
    () => previewFiles(societyFiles, societyPreview));
