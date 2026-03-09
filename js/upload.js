// 上传页面逻辑

// 检查用户是否为 artist
requireAuth();

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = 'auth.html';
    return;
  }

  const userDoc = await db.collection('users').doc(user.uid).get();
  const userData = userDoc.data();

  if (userData.role !== 'artist') {
    alert('Only artists can upload artworks');
    window.location.href = 'dashboard.html';
  }
});

// 字符计数
document.getElementById('title').addEventListener('input', (e) => {
  document.getElementById('titleCount').textContent = e.target.value.length;
});

document.getElementById('description').addEventListener('input', (e) => {
  document.getElementById('descCount').textContent = e.target.value.length;
});

// 图片预览
let selectedFile = null;

document.getElementById('artworkImage').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // 检查文件大小 (5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('File size must be less than 5MB');
    e.target.value = '';
    return;
  }

  // 检查文件类型
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    alert('Only JPG, PNG, GIF, and WEBP files are allowed');
    e.target.value = '';
    return;
  }

  selectedFile = file;

  // 显示预览
  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById('imagePreview').innerHTML = `
      <div class="preview-container">
        <img src="${e.target.result}" alt="Preview">
        <button type="button" onclick="removeImage()" class="btn-remove">✕ Remove</button>
      </div>
    `;
    document.getElementById('imageUploadArea').style.display = 'none';
  };
  reader.readAsDataURL(file);
});

// 拖放上传
const uploadArea = document.getElementById('imageUploadArea');

uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', () => {
  uploadArea.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.classList.remove('drag-over');

  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    document.getElementById('artworkImage').files = e.dataTransfer.files;
    document.getElementById('artworkImage').dispatchEvent(new Event('change'));
  }
});

// 移除图片
function removeImage() {
  selectedFile = null;
  document.getElementById('artworkImage').value = '';
  document.getElementById('imagePreview').innerHTML = '';
  document.getElementById('imageUploadArea').style.display = 'block';
}

// 表单提交
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const user = auth.currentUser;
  if (!user) {
    alert('Please login first');
    window.location.href = 'auth.html';
    return;
  }

  if (!selectedFile) {
    alert('Please select an image');
    return;
  }

  // 禁用提交按钮
  const submitBtn = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');
  submitBtn.disabled = true;
  btnText.textContent = 'Uploading...';

  const progressEl = document.getElementById('uploadProgress');
  const messageEl = document.getElementById('uploadMessage');

  try {
    // 1. 上传图片到 Firebase Storage
    const timestamp = Date.now();
    const fileName = `${timestamp}_${selectedFile.name}`;
    const storageRef = storage.ref();
    const imageRef = storageRef.child(`artworks/${user.uid}/${fileName}`);

    const uploadTask = imageRef.put(selectedFile);

    // 监听上传进度
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progressEl.innerHTML = `
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progress}%"></div>
          </div>
          <p>Uploading image: ${Math.round(progress)}%</p>
        `;
      },
      (error) => {
        console.error('Upload error:', error);
        messageEl.textContent = 'Upload failed: ' + error.message;
        messageEl.className = 'message error';
        submitBtn.disabled = false;
        btnText.textContent = 'Upload Artwork';
      },
      async () => {
        // 上传完成
        const imageUrl = await uploadTask.snapshot.ref.getDownloadURL();

        progressEl.innerHTML = '<p>Saving artwork details...</p>';

        // 2. 保存作品数据到 Firestore
        const artworkData = {
          artistId: user.uid,
          title: document.getElementById('title').value.trim(),
          description: document.getElementById('description').value.trim(),
          imageUrl: imageUrl,
          year: parseInt(document.getElementById('year').value) || null,
          medium: document.getElementById('medium').value || null,
          isPublished: document.getElementById('isPublished').checked,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        await db.collection('artworks').add(artworkData);

        // 成功
        messageEl.textContent = 'Artwork uploaded successfully!';
        messageEl.className = 'message success';
        progressEl.innerHTML = '';

        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1500);
      }
    );

  } catch (error) {
    console.error('Error uploading artwork:', error);
    messageEl.textContent = 'Error: ' + error.message;
    messageEl.className = 'message error';
    submitBtn.disabled = false;
    btnText.textContent = 'Upload Artwork';
    progressEl.innerHTML = '';
  }
});
