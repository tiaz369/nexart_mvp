// Artists 列表页面逻辑

async function loadArtists() {
  const artistsGrid = document.getElementById('artistsGrid');

  try {
    // 获取所有已发布的作品
    const artworks = await db.collection('artworks')
      .where('isPublished', '==', true)
      .get();

    if (artworks.empty) {
      artistsGrid.innerHTML = `
        <div class="empty-state">
          <h2>No artists yet</h2>
          <p>Be among our first pioneer artists!</p>
          <a href="apply.html" class="btn-primary">Apply Now</a>
        </div>
      `;
      return;
    }

    // 获取唯一的艺术家 ID
    const artistIds = [...new Set(artworks.docs.map(doc => doc.data().artistId))];

    artistsGrid.innerHTML = '';

    // 为每个艺术家创建卡片
    for (const artistId of artistIds) {
      const artistDoc = await db.collection('users').doc(artistId).get();

      if (!artistDoc.exists) continue;

      const artist = artistDoc.data();

      // 计算该艺术家的作品数量
      const artworkCount = artworks.docs.filter(doc => doc.data().artistId === artistId).length;

      artistsGrid.innerHTML += `
        <div class="artist-card">
          <div class="artist-avatar-container">
            ${artist.avatarUrl ?
              `<img src="${artist.avatarUrl}" alt="${artist.displayName}" class="artist-avatar-large">` :
              `<div class="artist-avatar-placeholder-large">${artist.displayName[0].toUpperCase()}</div>`
            }
          </div>

          <div class="artist-info">
            <h3 class="artist-name">${artist.displayName}</h3>
            ${artist.bio ?
              `<p class="artist-bio">${artist.bio.substring(0, 120)}${artist.bio.length > 120 ? '...' : ''}</p>` :
              '<p class="artist-bio">Artist at NexArt</p>'
            }
            <p class="artwork-count">${artworkCount} ${artworkCount === 1 ? 'artwork' : 'artworks'}</p>

            ${artist.socialLinks && (artist.socialLinks.twitter || artist.socialLinks.instagram) ? `
              <div class="social-links-small">
                ${artist.socialLinks.twitter ? `<a href="https://twitter.com/${artist.socialLinks.twitter}" target="_blank">🐦</a>` : ''}
                ${artist.socialLinks.instagram ? `<a href="https://instagram.com/${artist.socialLinks.instagram}" target="_blank">📷</a>` : ''}
              </div>
            ` : ''}
          </div>

          <a href="artist-profile.html?id=${artistId}" class="btn-view-profile">View Profile</a>
        </div>
      `;
    }

  } catch (error) {
    console.error('Error loading artists:', error);
    artistsGrid.innerHTML = `
      <div class="error-state">
        <p>Error loading artists. Please refresh the page.</p>
      </div>
    `;
  }
}

// 页面加载时执行
loadArtists();
