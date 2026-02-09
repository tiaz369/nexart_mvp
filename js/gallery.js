// Gallery 页面逻辑

async function loadGallery() {
  const galleryGrid = document.getElementById('galleryGrid');

  try {
    // 获取所有已发布的作品
    const artworks = await db.collection('artworks')
      .where('isPublished', '==', true)
      .orderBy('createdAt', 'desc')
      .get();

    if (artworks.empty) {
      galleryGrid.innerHTML = `
        <div class="empty-state">
          <h2>No artworks yet</h2>
          <p>Be the first to share your art with the community!</p>
          <a href="auth.html" class="btn-primary">Join as Artist</a>
        </div>
      `;
      return;
    }

    galleryGrid.innerHTML = '';

    // 获取当前用户的收藏（如果已登录）
    let userSaves = new Set();
    if (auth.currentUser) {
      const saves = await db.collection('saves')
        .where('userId', '==', auth.currentUser.uid)
        .get();
      saves.forEach(doc => userSaves.add(doc.data().artworkId));
    }

    // 显示每个作品
    for (const doc of artworks.docs) {
      const artwork = doc.data();
      const isSaved = userSaves.has(doc.id);

      // 获取艺术家信息
      const artistDoc = await db.collection('users').doc(artwork.artistId).get();
      const artist = artistDoc.data();

      galleryGrid.innerHTML += `
        <div class="artwork-card" data-artwork-id="${doc.id}">
          <div class="artwork-image" onclick="window.location.href='artwork.html?id=${doc.id}'">
            <img src="${artwork.imageUrl}" alt="${artwork.title}" loading="lazy">
          </div>
          <div class="artwork-info">
            <h3 class="artwork-title">${artwork.title}</h3>
            <p class="artist-name" onclick="window.location.href='artist-profile.html?id=${artwork.artistId}'" style="cursor: pointer;">
              by ${artist.displayName}
            </p>
            ${artwork.year ? `<p class="artwork-year">${artwork.year}</p>` : ''}
            ${artwork.medium ? `<p class="artwork-medium">${artwork.medium}</p>` : ''}
            <button class="save-btn ${isSaved ? 'saved' : ''}"
                    onclick="toggleSave('${doc.id}', this)"
                    data-artwork-id="${doc.id}">
              ${isSaved ? '❤️ Saved' : '🤍 Save'}
            </button>
          </div>
        </div>
      `;
    }

  } catch (error) {
    console.error('Error loading gallery:', error);
    galleryGrid.innerHTML = `
      <div class="error-state">
        <p>Error loading gallery. Please refresh the page.</p>
      </div>
    `;
  }
}

// 切换收藏状态
async function toggleSave(artworkId, button) {
  const user = auth.currentUser;

  if (!user) {
    if (confirm('Please login to save artworks. Go to login page?')) {
      window.location.href = 'auth.html';
    }
    return;
  }

  try {
    button.disabled = true;

    // 检查是否已收藏
    const saveQuery = await db.collection('saves')
      .where('userId', '==', user.uid)
      .where('artworkId', '==', artworkId)
      .get();

    if (saveQuery.empty) {
      // 添加收藏
      await db.collection('saves').add({
        userId: user.uid,
        artworkId: artworkId,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      button.textContent = '❤️ Saved';
      button.classList.add('saved');
    } else {
      // 取消收藏
      const batch = db.batch();
      saveQuery.forEach(doc => batch.delete(doc.ref));
      await batch.commit();

      button.textContent = '🤍 Save';
      button.classList.remove('saved');
    }

    button.disabled = false;

  } catch (error) {
    console.error('Error toggling save:', error);
    alert('Error saving artwork. Please try again.');
    button.disabled = false;
  }
}

// 页面加载时执行
loadGallery();
