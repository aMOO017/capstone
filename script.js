// Resumes Preview
const resumeFiles = document.getElementById('resumeFiles');
const resumePreview = document.getElementById('resumePreview');

resumeFiles.addEventListener('change', () => {
    resumePreview.innerHTML = '';
    const files = resumeFiles.files;
    for (let file of files) {
        const div = document.createElement('div');
        div.classList.add('file-item');
        div.innerHTML = `<p>${file.name}</p>`;
        resumePreview.appendChild(div);
    }
});

// Autobiography
const saveBioBtn = document.getElementById('saveBio');
const bioPreview = document.getElementById('bioPreview');
saveBioBtn.addEventListener('click', () => {
    const text = document.getElementById('autobiographyText').value;
    bioPreview.innerHTML = `<p>${text}</p>`;
});

// Inventions / Videos
const videoFiles = document.getElementById('videoFiles');
const videoPreview = document.getElementById('videoPreview');

videoFiles.addEventListener('change', () => {
    videoPreview.innerHTML = '';
    const files = videoFiles.files;
    for (let file of files) {
        const div = document.createElement('div');
        div.classList.add('file-item');
        const url = URL.createObjectURL(file);
        div.innerHTML = `<p>${file.name}</p><video controls src="${url}"></video>`;
        videoPreview.appendChild(div);
    }
});

// African Culture
const saveCultureBtn = document.getElementById('saveCulture');
const culturePreview = document.getElementById('culturePreview');
saveCultureBtn.addEventListener('click', () => {
    const text = document.getElementById('cultureText').value;
    culturePreview.innerHTML = `<p>${text}</p>`;
});

// Society Challenges
const saveSocietyBtn = document.getElementById('saveSociety');
const societyPreview = document.getElementById('societyPreview');
saveSocietyBtn.addEventListener('click', () => {
    const text = document.getElementById('societyText').value;
    societyPreview.innerHTML = `<p>${text}</p>`;
});
