// Artist Profile 页面逻辑

async function loadArtistProfile() {
  const urlParams = new URLSearchParams(window.location.search);
  const artistId = urlParams.get('id');

  if (!artistId) {
    alert('Artist not found');
    window.location.href = 'artists.html';
    return;
  }

  const container = document.getElementById('artistProfileContent');

  try {
    // 获取艺术家信息
    const artistDoc = await db.collection('users').doc(artistId).get();

    if (!artistDoc.exists) {
      container.innerHTML = `
        <div class="error-state">
          <h2>Artist not found</h2>
          <a href="artists.html" class="btn-primary">Back to Artists</a>
        </div>
      `;
      return;
    }

    const artist = artistDoc.data();

    // 更新页面标题
    document.title = `${artist.displayName} - NexArt`;

    // 获取该艺术家的所有已发布作品
    const artworks = await db.collection('artworks')
      .where('artistId', '==', artistId)
      .where('isPublished', '==', true)
      .orderBy('createdAt', 'desc')
      .get();

    // 渲染艺术家资料
    container.innerHTML = `
      <div class="artist-profile">
        <div class="artist-header">
          <div class="artist-avatar-section">
            ${artist.avatarUrl ?
              `<img src="${artist.avatarUrl}" alt="${artist.displayName}" class="artist-avatar-xl">` :
              `<div class="artist-avatar-placeholder-xl">${artist.displayName[0].toUpperCase()}</div>`
            }
          </div>

          <div class="artist-info-header">
            <h1>${artist.displayName}</h1>
            ${artist.bio ? `<p class="artist-bio-full">${artist.bio}</p>` : ''}

            ${artist.socialLinks && (artist.socialLinks.twitter || artist.socialLinks.instagram || artist.socialLinks.website) ? `
              <div class="social-links">
                ${artist.socialLinks.twitter ?
                  `<a href="https://twitter.com/${artist.socialLinks.twitter.replace('@', '')}" target="_blank" class="social-link">
                    🐦 Twitter
                  </a>` : ''}
                ${artist.socialLinks.instagram ?
                  `<a href="https://instagram.com/${artist.socialLinks.instagram.replace('@', '')}" target="_blank" class="social-link">
                    📷 Instagram
                  </a>` : ''}
                ${artist.socialLinks.website ?
                  `<a href="${artist.socialLinks.website}" target="_blank" class="social-link">
                    🌐 Website
                  </a>` : ''}
              </div>
            ` : ''}

            <p class="artwork-count-large">${artworks.size} ${artworks.size === 1 ? 'artwork' : 'artworks'}</p>
          </div>
        </div>

        <div class="artist-artworks-section">
          <h2>Artworks</h2>
          <div id="artistArtworksGrid" class="artworks-grid">
            ${artworks.empty ?
              '<p class="empty-message">No published artworks yet.</p>' :
              ''
            }
          </div>
        </div>
      </div>
    `;

    // 如果有作品，渲染作品网格
    if (!artworks.empty) {
      const grid = document.getElementById('artistArtworksGrid');

      // 获取当前用户的收藏
      let userSaves = new Set();
      if (auth.currentUser) {
        const saves = await db.collection('saves')
          .where('userId', '==', auth.currentUser.uid)
          .get();
        saves.forEach(doc => userSaves.add(doc.data().artworkId));
      }

      artworks.forEach(doc => {
        const artwork = doc.data();
        const isSaved = userSaves.has(doc.id);

        grid.innerHTML += `
          <div class="artwork-card">
            <div class="artwork-image" onclick="window.location.href='artwork.html?id=${doc.id}'">
              <img src="${artwork.imageUrl}" alt="${artwork.title}" loading="lazy">
            </div>
            <div class="artwork-info">
              <h3 class="artwork-title">${artwork.title}</h3>
              ${artwork.year ? `<p class="artwork-year">${artwork.year}</p>` : ''}
              ${artwork.medium ? `<p class="artwork-medium">${artwork.medium}</p>` : ''}
              <button class="save-btn ${isSaved ? 'saved' : ''}"
                      onclick="toggleSave('${doc.id}', this)">
                ${isSaved ? '❤️ Saved' : '🤍 Save'}
              </button>
            </div>
          </div>
        `;
      });
    }

  } catch (error) {
    console.error('Error loading artist profile:', error);
    container.innerHTML = `
      <div class="error-state">
        <h2>Error loading profile</h2>
        <p>Please try refreshing the page.</p>
        <a href="artists.html" class="btn-primary">Back to Artists</a>
      </div>
    `;
  }
}

// 复用 gallery.js 的 toggleSave 函数
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
loadArtistProfile();
