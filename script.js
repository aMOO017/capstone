// script.js (type=module)
// FULL working Firebase + Firestore implementation for cross-device persistence.
//
// IMPORTANT: Add <script type="module" src="script.js"></script> in your index.html

// -------------------------
// 1) IMPORT FIREBASE (modular)
// -------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";
import { getFirestore, collection, addDoc, query, where, orderBy, onSnapshot, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// -------------------------
// 2) PASTE YOUR firebaseConfig HERE
// -------------------------
const firebaseConfig = {
  apiKey: "PASTE_YOUR_apiKey",
  authDomain: "PASTE_YOUR_authDomain",
  projectId: "PASTE_YOUR_projectId",
  storageBucket: "PASTE_YOUR_storageBucket",
  messagingSenderId: "PASTE_YOUR_messagingSenderId",
  appId: "PASTE_YOUR_appId"
  // measurementId: "optional"
};

// -------------------------
// 3) INITIALIZE FIREBASE
// -------------------------
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

// sections we support
const SECTIONS = ["resume", "autobiography", "invention", "culture", "society", "others"];

// store current user
let currentUser = null;

// -------------------------
// 4) UI helper: display file with download & delete
// -------------------------
function createFileElement(meta) {
  // meta fields: id (firestore doc id), name, type, url, section, timestamp
  const wrapper = document.createElement("div");
  wrapper.className = "file-item";
  wrapper.dataset.docId = meta.id || "";

  const title = document.createElement("p");
  title.textContent = meta.name;
  wrapper.appendChild(title);

  // Show preview depending on type
  if (meta.type?.startsWith("video/")) {
    const video = document.createElement("video");
    video.controls = true;
    video.src = meta.url;
    wrapper.appendChild(video);
  } else if (meta.type?.startsWith("image/")) {
    const img = document.createElement("img");
    img.src = meta.url;
    img.style.width = "100%";
    wrapper.appendChild(img);
  } else if (meta.type === "application/pdf") {
    const embed = document.createElement("embed");
    embed.src = meta.url;
    embed.type = "application/pdf";
    embed.width = "100%";
    embed.height = 400;
    wrapper.appendChild(embed);
  } else if (meta.type?.startsWith("text/")) {
    // fetch text content
    fetch(meta.url).then(r => r.text()).then(txt => {
      const ta = document.createElement("textarea");
      ta.readOnly = true;
      ta.style.width = "100%";
      ta.style.height = "200px";
      ta.value = txt;
      wrapper.appendChild(ta);
    }).catch(()=> {
      const p = document.createElement("p");
      p.textContent = "(couldn't load text preview)";
      wrapper.appendChild(p);
    });
  } else {
    const p = document.createElement("p");
    p.textContent = "(Preview not available)";
    wrapper.appendChild(p);
  }

  // download button
  const down = document.createElement("a");
  down.className = "download-btn";
  down.href = meta.url;
  down.download = meta.name;
  down.textContent = "Download";
  down.style.display = "inline-block";
  down.style.marginRight = "8px";
  wrapper.appendChild(down);

  // delete button (only if owner)
  if (currentUser && meta.uid === currentUser.uid) {
    const del = document.createElement("button");
    del.textContent = "Delete";
    del.style.background = "#d9534f";
    del.style.color = "#fff";
    del.style.border = "none";
    del.style.padding = "8px 10px";
    del.style.borderRadius = "5px";
    del.onclick = () => {
      if (!confirm(`Delete "${meta.name}"? This removes the file for all devices.`)) return;
      deleteStoredFile(meta);
    };
    wrapper.appendChild(del);
  }

  return wrapper;
}

// -------------------------
// 5) DISPLAY LIST FOR A SECTION (clears and appends)
// -------------------------
function renderSectionFiles(section, docs) {
  const display = document.getElementById(section + "Display");
  if (!display) return;
  display.innerHTML = "";
  // docs: array of metadata objects
  docs.forEach(meta => {
    const el = createFileElement(meta);
    display.appendChild(el);
  });
}

// -------------------------
// 6) SAVE metadata to Firestore
// -------------------------
async function saveFileMetadata(bucketPath, section, name, type, url) {
  // add doc with uid so we can query per user
  const docRef = await addDoc(collection(db, "files"), {
    uid: currentUser.uid,
    storagePath: bucketPath, // path inside storage
    section,
    name,
    type,
    url,
    timestamp: Date.now()
  });
  return docRef.id;
}

// -------------------------
// 7) UPLOAD file to Firebase Storage + save metadata
// -------------------------
export async function uploadFile(event, section) {
  const file = event.target.files?.[0];
  if (!file) return alert("No file selected.");

  // simple validation: section must be known
  if (!SECTIONS.includes(section)) {
    return alert("Unknown section: " + section);
  }

  // storage path: users/{uid}/{section}/{timestamp}_{filename}
  const ts = Date.now();
  const path = `users/${currentUser.uid}/${section}/${ts}_${file.name}`;
  const sRef = storageRef(storage, path);

  // upload with progress indicator
  const uploadTask = uploadBytesResumable(sRef, file);

  // create or get a small progress UI
  const display = document.getElementById(section + "Display");
  const progressDiv = document.createElement("div");
  progressDiv.className = "file-item";
  progressDiv.textContent = `Uploading ${file.name}... 0%`;
  display.prepend(progressDiv);

  uploadTask.on('state_changed',
    (snapshot) => {
      const percent = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      progressDiv.textContent = `Uploading ${file.name}... ${percent}%`;
    },
    (error) => {
      console.error("Upload error:", error);
      progressDiv.textContent = `Upload failed: ${error.message}`;
    },
    async () => {
      // completed
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      // save metadata in Firestore
      try {
        const docId = await saveFileMetadata(path, section, file.name, file.type || "application/octet-stream", downloadURL);
        progressDiv.remove();
        // UI will auto update via Firestore onSnapshot listener
      } catch (e) {
        console.error("Error saving metadata:", e);
        progressDiv.textContent = "Upload succeeded but saving metadata failed.";
      }
    }
  );
}

// -------------------------
// 8) DELETE file (Storage + Firestore)
// -------------------------
async function deleteStoredFile(meta) {
  // meta should contain id (firestore doc id) and storagePath
  try {
    // delete storage object
    const sRef = storageRef(storage, meta.storagePath);
    await deleteObject(sRef);
  } catch (e) {
    console.warn("Could not delete storage object (maybe already removed):", e);
  }

  try {
    // delete firestore doc
    await deleteDoc(doc(db, "files", meta.id));
  } catch (e) {
    console.error("Could not delete metadata doc:", e);
  }
}

// -------------------------
// 9) SUBSCRIBE to Firestore changes for the current user
// -------------------------
function startRealtimeListeners() {
  // listen for all files owned by this user, grouped by section
  // We'll keep a map section->array
  const filesBySection = {};
  SECTIONS.forEach(s => filesBySection[s] = []);

  // query and onSnapshot
  const q = query(collection(db, "files"), where("uid", "==", currentUser.uid), orderBy("timestamp", "desc"));
  onSnapshot(q, (snapshot) => {
    // rebuild filesBySection each update
    const temp = {};
    SECTIONS.forEach(s => temp[s] = []);

    snapshot.forEach(docSnap => {
      const d = docSnap.data();
      const meta = {
        id: docSnap.id,
        uid: d.uid,
        storagePath: d.storagePath,
        section: d.section,
        name: d.name,
        type: d.type,
        url: d.url,
        timestamp: d.timestamp
      };
      if (!temp[meta.section]) temp[meta.section] = [];
      temp[meta.section].push(meta);
    });

    // render each section
    SECTIONS.forEach(s => renderSectionFiles(s, temp[s]));
  }, (err) => {
    console.error("Error listening to files:", err);
  });
}

// -------------------------
// 10) AUTHENTICATE ANONYMOUSLY and START
// -------------------------
signInAnonymously(auth)
  .then(() => {
    // wait for auth state - onAuthStateChanged will set currentUser
    onAuthStateChanged(auth, (user) => {
      if (user) {
        currentUser = user;
        console.log("Signed in anonymously as", user.uid);
        startRealtimeListeners();
      } else {
        currentUser = null;
      }
    });
  })
  .catch((error) => {
    console.error("Anonymous sign-in failed:", error);
    alert("Unable to sign in: " + error.message);
  });

// -------------------------
// 11) Expose uploadFile to window so inline onchange handlers work
// -------------------------
window.uploadFile = uploadFile;
