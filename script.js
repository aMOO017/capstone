const projectFiles = document.getElementById('projectFiles');
const fileList = document.getElementById('fileList');

projectFiles.addEventListener('change', () => {
    const files = projectFiles.files;
    let output = '<ul>';
    for (let i = 0; i < files.length; i++) {
        output += `<li>${files[i].name}</li>`;
    }
    output += '</ul>';
    fileList.innerHTML = output;
});

document.getElementById('uploadForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Files ready for upload! (This template does not actually upload files, backend needed)');
});
