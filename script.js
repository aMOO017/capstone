function previewFiles(inputElement, previewContainer, type) {
    previewContainer.innerHTML = '';
    const files = inputElement.files;

    for (let file of files) {
        const div = document.createElement('div');
        div.classList.add('file-item');

        // For videos
        if (file.type.includes('video')) {
            const url = URL.createObjectURL(file);
            div.innerHTML = `<p>${file.name}</p><video controls src="${url}"></video>`;
        }
        // For images
        else if (file.type.includes('image')) {
            const url = URL.createObjectURL(file);
            div.innerHTML = `<p>${file.name}</p><img src="${url}" alt="${file.name}">`;
        }
        // For documents
        else {
            div.innerHTML = `<p>${file.name}</p>`;
        }

        previewContainer.appendChild(div);
    }
}

// Resumes
const resumeFiles = document.getElementById('resumeFiles');
const resumePreview = document.getElementById('resumePreview');
resumeFiles.addEventListener('change', () => previewFiles(resumeFiles, resumePreview));

// Autobiography
const autobiographyFiles = document.getElementById('autobiographyFiles');
const autobiographyPreview = document.getElementById('autobiographyPreview');
autobiographyFiles.addEventListener('change', () => previewFiles(autobiographyFiles, autobiographyPreview));

// Videos
const videoFiles = document.getElementById('videoFiles');
const videoPreview = document.getElementById('videoPreview');
videoFiles.addEventListener('change', () => previewFiles(videoFiles, videoPreview));

// African Culture
const cultureFiles = document.getElementById('cultureFiles');
const culturePreview = document.getElementById('culturePreview');
cultureFiles.addEventListener('change', () => previewFiles(cultureFiles, culturePreview));

// Society Challenges
const societyFiles = document.getElementById('societyFiles');
const societyPreview = document.getElementById('societyPreview');
societyFiles.addEventListener('change', () => previewFiles(societyFiles, societyPreview));
