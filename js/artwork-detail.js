// 作品详情页面逻辑

async function loadArtworkDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const artworkId = urlParams.get('id');

  if (!artworkId) {
    alert('Artwork not found');
    window.location.href = 'gallery.html';
    return;
  }

  const container = document.getElementById('artworkContent');

  try {
    // 获取作品数据
    const artworkDoc = await db.collection('artworks').doc(artworkId).get();

    if (!artworkDoc.exists) {
      container.innerHTML = `
        <div class="error-state">
          <h2>Artwork not found</h2>
          <p>This artwork may have been removed or doesn't exist.</p>
          <a href="gallery.html" class="btn-primary">Back to Gallery</a>
        </div>
      `;
      return;
    }

    const artwork = artworkDoc.data();

    // 获取艺术家信息
    const artistDoc = await db.collection('users').doc(artwork.artistId).get();
    const artist = artistDoc.data();

    // 检查是否已收藏
    let isSaved = false;
    if (auth.currentUser) {
      const saveDoc = await db.collection('saves')
        .where('userId', '==', auth.currentUser.uid)
        .where('artworkId', '==', artworkId)
        .get();
      isSaved = !saveDoc.empty;
    }

    // 更新页面标题
    document.title = `${artwork.title} - NexArt`;

    // 渲染作品详情
    container.innerHTML = `
      <div class="artwork-detail">
        <div class="artwork-image-section">
          <img src="${artwork.imageUrl}" alt="${artwork.title}" class="artwork-image-large">
        </div>

        <div class="artwork-info-section">
          <div class="breadcrumb">
            <a href="gallery.html">Gallery</a> / ${artwork.title}
          </div>

          <h1 class="artwork-title-large">${artwork.title}</h1>

          <div class="artwork-metadata">
            ${artwork.year ? `<span class="metadata-item"><strong>Year:</strong> ${artwork.year}</span>` : ''}
            ${artwork.medium ? `<span class="metadata-item"><strong>Medium:</strong> ${artwork.medium}</span>` : ''}
          </div>

          <div class="artwork-description">
            <h3>About this work</h3>
            <p>${artwork.description}</p>
          </div>

          <div class="artwork-artist-info">
            <h3>About the Artist</h3>
            <div class="artist-card-inline">
              ${artist.avatarUrl ?
                `<img src="${artist.avatarUrl}" alt="${artist.displayName}" class="artist-avatar">` :
                `<div class="artist-avatar-placeholder">${artist.displayName[0]}</div>`
              }
              <div class="artist-info-text">
                <h4>${artist.displayName}</h4>
                ${artist.bio ? `<p>${artist.bio.substring(0, 150)}${artist.bio.length > 150 ? '...' : ''}</p>` : ''}
              </div>
            </div>
            <a href="artist-profile.html?id=${artwork.artistId}" class="btn-secondary">View Artist Profile</a>
          </div>

          <div class="artwork-actions">
            <button onclick="toggleSaveDetail('${artworkId}', this)"
                    class="btn-save ${isSaved ? 'saved' : ''}"
                    id="saveBtn">
              ${isSaved ? '❤️ Saved' : '🤍 Save Artwork'}
            </button>

            <div class="share-buttons">
              <button onclick="shareOnTwitter('${artwork.title}')" class="btn-share">
                <span>🐦</span> Share on Twitter
              </button>
              <button onclick="copyLink()" class="btn-share">
                <span>🔗</span> Copy Link
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

  } catch (error) {
    console.error('Error loading artwork:', error);
    container.innerHTML = `
      <div class="error-state">
        <h2>Error loading artwork</h2>
        <p>Please try refreshing the page.</p>
        <a href="gallery.html" class="btn-primary">Back to Gallery</a>
      </div>
    `;
  }
}

// 切换收藏（详情页版本）
async function toggleSaveDetail(artworkId, button) {
  const user = auth.currentUser;

  if (!user) {
    if (confirm('Please login to save artworks. Go to login page?')) {
      window.location.href = 'auth.html';
    }
    return;
  }

  try {
    button.disabled = true;

    const saveQuery = await db.collection('saves')
      .where('userId', '==', user.uid)
      .where('artworkId', '==', artworkId)
      .get();

    if (saveQuery.empty) {
      await db.collection('saves').add({
        userId: user.uid,
        artworkId: artworkId,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      button.textContent = '❤️ Saved';
      button.classList.add('saved');
    } else {
      const batch = db.batch();
      saveQuery.forEach(doc => batch.delete(doc.ref));
      await batch.commit();

      button.textContent = '🤍 Save Artwork';
      button.classList.remove('saved');
    }

    button.disabled = false;

  } catch (error) {
    console.error('Error toggling save:', error);
    alert('Error saving artwork. Please try again.');
    button.disabled = false;
  }
}

// 分享到 Twitter
function shareOnTwitter(title) {
  const url = window.location.href;
  const text = `Check out "${title}" on NexArt`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  window.open(twitterUrl, '_blank', 'width=600,height=400');
}

// 复制链接
function copyLink() {
  const url = window.location.href;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy:', err);
      fallbackCopyLink(url);
    });
  } else {
    fallbackCopyLink(url);
  }
}

// 备用复制方法
function fallbackCopyLink(url) {
  const textArea = document.createElement('textarea');
  textArea.value = url;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);
  textArea.select();

  try {
    document.execCommand('copy');
    alert('Link copied to clipboard!');
  } catch (err) {
    alert('Failed to copy link. Please copy manually: ' + url);
  }

  document.body.removeChild(textArea);
}

// 页面加载时执行
loadArtworkDetail();
