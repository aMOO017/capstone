const projectFiles = document.getElementById('projectFiles');
const filePreview = document.getElementById('filePreview');

projectFiles.addEventListener('change', () => {
    filePreview.innerHTML = ''; // Clear previous preview
    const files = projectFiles.files;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileType = file.type;
        const fileURL = URL.createObjectURL(file);

        const div = document.createElement('div');
        div.classList.add('file-item');

        if (fileType.includes('video')) {
            // Preview video
            div.innerHTML = `<p>${file.name}</p><video controls src="${fileURL}"></video>`;
        } else if (fileType.includes('word') || file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
            // Preview Word document via iframe using Google Docs Viewer
            div.innerHTML = `<p>${file.name}</p><iframe src="https://docs.google.com/gview?url=${fileURL}&embedded=true"></iframe>`;
        } else if (file.name.endsWith('.ppt') || file.name.endsWith('.pptx')) {
            // Preview PowerPoint via iframe using Google Docs Viewer
            div.innerHTML = `<p>${file.name}</p><iframe src="https://docs.google.com/gview?url=${fileURL}&embedded=true"></iframe>`;
        } else {
            div.innerHTML = `<p>${file.name} (Preview not available)</p>`;
        }

        filePreview.appendChild(div);
    }
});
