// -------------------------------------------
// INSERT CSS USING JAVASCRIPT (optional — only if you don't use external style.css)
// -------------------------------------------
// If you use external style.css you can omit this block.
/*
const style = document.createElement("style");
style.textContent = `
  body { font-family: Arial, sans-serif; margin:0; background:#f4f4f4; }
  header { background:#222; color:white; padding:20px; text-align:center; }
  nav a { margin: 0 15px; color:#ffd700; text-decoration:none; font-weight:bold; }
  .container { width: 80%; margin:auto; padding:20px; }
  section { background:white; padding:20px; margin-bottom:20px; border-radius:8px; box-shadow:0px 3px 10px rgba(0,0,0,0.2); }
  .file-item { padding:10px; background:#fafafa; border:1px solid #ddd; border-radius:5px; margin-bottom:10px; }
  video, img, embed, textarea { width:100%; margin-top:10px; border-radius:5px; }
  textarea { height:200px; }
  .download-btn { display:inline-block; margin-top:10px; padding:8px 12px; background:#28a745; color:#fff; text-decoration:none; border-radius:5px; }
`;
document.head.appendChild(style);
*/

// -------------------------------------------
// UTILITY FUNCTIONS
// -------------------------------------------

function displayFile(elementId, fileName, fileType, fileContentOrURL, isBlobURL = false) {
  const container = document.getElementById(elementId + "Display");
  container.innerHTML = ""; // clear previous

  const div = document.createElement("div");
  div.classList.add("file-item");

  // Video with blob URL (not saved)
  if (fileType.startsWith("video/")) {
    div.innerHTML = `
      <p>${fileName}</p>
      <video controls src="${fileContentOrURL}"></video><br>
      <a class="download-btn" href="${fileContentOrURL}" download="${fileName}">Download Video</a>
      <p style="color: red; font-size: 0.9em;">(Video preview will work this session, videos are not saved permanently)</p>
    `;
  }
  // Image
  else if (fileType.startsWith("image/")) {
    div.innerHTML = `
      <p>${fileName}</p>
      <img src="${fileContentOrURL}" alt="${fileName}">
      <br><a class="download-btn" href="${fileContentOrURL}" download="${fileName}">Download Image</a>
    `;
  }
  // PDF
  else if (fileType === "application/pdf") {
    div.innerHTML = `
      <p>${fileName}</p>
      <embed src="${fileContentOrURL}" type="application/pdf" width="100%" height="500px">
      <br><a class="download-btn" href="${fileContentOrURL}" download="${fileName}">Download PDF</a>
    `;
  }
  // Text file
  else if (fileType.startsWith("text/")) {
    // Decode Base64
    const text = atob(fileContentOrURL.split(",")[1]);
    div.innerHTML = `
      <p>${fileName}</p>
      <textarea readonly>${text}</textarea>
      <br><a class="download-btn" href="${fileContentOrURL}" download="${fileName}">Download Text</a>
    `;
  }
  // Other — treat as generic downloadable file (e.g. Word, PPT, etc.)
  else {
    div.innerHTML = `
      <p>${fileName}</p>
      <a class="download-btn" href="${fileContentOrURL}" download="${fileName}">Download File</a>
    `;
  }

  container.appendChild(div);
}

function displaySavedFile(section, savedObj) {
  displayFile(section, savedObj.name, savedObj.type, savedObj.content, false);
}

// -------------------------------------------
// UPLOAD HANDLER
// -------------------------------------------
window.uploadFile = function(event, section) {
  const file = event.target.files[0];
  if (!file) return;

  const fileType = file.type;
  const fileName = file.name;

  // For video: create blob URL, but do NOT save to localStorage
  if (fileType.startsWith("video/")) {
    const blobURL = URL.createObjectURL(file);
    displayFile(section, fileName, fileType, blobURL, true);
    return;
  }

  // For other files: read as Data URL (base64), save and display
  const reader = new FileReader();
  reader.onload = function(e) {
    const dataURL = e.target.result;
    const fileData = {
      name: fileName,
      type: fileType,
      content: dataURL
    };
    // Save to localStorage
    try {
      localStorage.setItem(section, JSON.stringify(fileData));
    } catch (err) {
      console.warn("Could not save to localStorage:", err);
    }
    displayFile(section, fileName, fileType, dataURL, false);
  };
  reader.readAsDataURL(file);
};

// -------------------------------------------
// ON LOAD: restore saved files
// -------------------------------------------
window.onload = function() {
  const sections = ["resume", "autobiography", "invention", "culture", "society", "others"];
  sections.forEach(sec => {
    const raw = localStorage.getItem(sec);
    if (raw) {
      try {
        const obj = JSON.parse(raw);
        displaySavedFile(sec, obj);
      } catch (e) {
        console.warn("Error parsing saved data for", sec, e);
      }
    }
  });
};
