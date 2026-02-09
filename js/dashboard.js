// Dashboard 页面逻辑

// 页面加载时检查认证
requireAuth();

let userData = null;

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = 'auth.html';
    return;
  }

  try {
    // 获取用户数据
    const userDoc = await db.collection('users').doc(user.uid).get();
    if (!userDoc.exists) {
      console.error('User document not found');
      alert('Error loading user data');
      return;
    }

    userData = userDoc.data();

    // 更新欢迎消息
    document.getElementById('welcomeMessage').textContent =
      `Welcome back, ${userData.displayName}!`;

    // 根据角色加载不同内容
    if (userData.role === 'artist') {
      loadArtistDashboard(user.uid);
    } else if (userData.role === 'viewer') {
      loadViewerDashboard(user.uid);
    } else {
      document.getElementById('roleBasedContent').innerHTML =
        '<p>Unknown user role. Please contact support.</p>';
    }

  } catch (error) {
    console.error('Error loading dashboard:', error);
    alert('Error loading dashboard. Please try refreshing the page.');
  }
});

// Artist Dashboard
async function loadArtistDashboard(userId) {
  const content = document.getElementById('roleBasedContent');

  content.innerHTML = `
    <div class="artist-dashboard">
      <div class="dashboard-actions">
        <a href="upload.html" class="btn-primary btn-large">
          <span class="icon">+</span> Upload New Artwork
        </a>
        <a href="artist-profile.html?id=${userId}" class="btn-secondary">
          View My Public Profile
        </a>
      </div>

      <div class="dashboard-section">
        <h2>My Artworks</h2>
        <div id="artistArtworks" class="artworks-grid">
          <div class="loading">Loading your artworks...</div>
        </div>
      </div>

      <div class="dashboard-section">
        <h2>Profile Settings</h2>
        <div class="profile-settings">
          <div class="form-group">
            <label>Display Name</label>
            <input type="text" id="editDisplayName" value="${userData.displayName || ''}">
          </div>
          <div class="form-group">
            <label>Bio</label>
            <textarea id="editBio" maxlength="500" placeholder="Tell us about yourself and your art...">${userData.bio || ''}</textarea>
          </div>
          <div class="form-group">
            <label>Twitter</label>
            <input type="text" id="editTwitter" placeholder="@username" value="${userData.socialLinks?.twitter || ''}">
          </div>
          <div class="form-group">
            <label>Instagram</label>
            <input type="text" id="editInstagram" placeholder="@username" value="${userData.socialLinks?.instagram || ''}">
          </div>
          <div class="form-group">
            <label>Website</label>
            <input type="url" id="editWebsite" placeholder="https://" value="${userData.socialLinks?.website || ''}">
          </div>
          <button onclick="saveProfile()" class="btn-primary">Save Profile</button>
          <div id="profileMessage"></div>
        </div>
      </div>
    </div>
  `;

  // 加载艺术家的作品
  loadArtistArtworks(userId);
}

// Viewer Dashboard
async function loadViewerDashboard(userId) {
  const content = document.getElementById('roleBasedContent');

  content.innerHTML = `
    <div class="viewer-dashboard">
      <div class="dashboard-actions">
        <a href="gallery.html" class="btn-primary btn-large">
          Explore Gallery
        </a>
        <a href="artists.html" class="btn-secondary">
          Discover Artists
        </a>
      </div>

      <div class="dashboard-section">
        <h2>My Saved Artworks</h2>
        <div id="savedArtworks" class="artworks-grid">
          <div class="loading">Loading your saved artworks...</div>
        </div>
      </div>

      <div class="dashboard-section">
        <h2>Profile Settings</h2>
        <div class="profile-settings">
          <div class="form-group">
            <label>Display Name</label>
            <input type="text" id="editDisplayName" value="${userData.displayName || ''}">
          </div>
          <div class="form-group">
            <label>Bio</label>
            <textarea id="editBio" maxlength="300" placeholder="Tell us about your interests...">${userData.bio || ''}</textarea>
          </div>
          <button onclick="saveProfile()" class="btn-primary">Save Profile</button>
          <div id="profileMessage"></div>
        </div>
      </div>
    </div>
  `;

  // 加载保存的作品
  loadSavedArtworks(userId);
}

// 加载艺术家的作品
async function loadArtistArtworks(userId) {
  const grid = document.getElementById('artistArtworks');

  try {
    const artworks = await db.collection('artworks')
      .where('artistId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    if (artworks.empty) {
      grid.innerHTML = `
        <div class="empty-state">
          <p>You haven't uploaded any artworks yet.</p>
          <a href="upload.html" class="btn-primary">Upload Your First Artwork</a>
        </div>
      `;
      return;
    }

    grid.innerHTML = '';

    artworks.forEach(doc => {
      const artwork = doc.data();
      grid.innerHTML += `
        <div class="artwork-card">
          <img src="${artwork.imageUrl}" alt="${artwork.title}">
          <div class="artwork-info">
            <h3>${artwork.title}</h3>
            <p class="status ${artwork.isPublished ? 'published' : 'draft'}">
              ${artwork.isPublished ? '✓ Published' : '○ Draft'}
            </p>
            <div class="artwork-actions">
              <a href="artwork.html?id=${doc.id}" class="btn-small">View</a>
              <button onclick="deleteArtwork('${doc.id}', '${artwork.title}')" class="btn-small btn-danger">Delete</button>
            </div>
          </div>
        </div>
      `;
    });

  } catch (error) {
    console.error('Error loading artworks:', error);
    grid.innerHTML = '<p class="error">Error loading artworks. Please refresh the page.</p>';
  }
}

// 加载保存的作品
async function loadSavedArtworks(userId) {
  const grid = document.getElementById('savedArtworks');

  try {
    const saves = await db.collection('saves')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    if (saves.empty) {
      grid.innerHTML = `
        <div class="empty-state">
          <p>You haven't saved any artworks yet.</p>
          <a href="gallery.html" class="btn-primary">Explore Gallery</a>
        </div>
      `;
      return;
    }

    grid.innerHTML = '';

    for (const saveDoc of saves.docs) {
      const save = saveDoc.data();
      const artworkDoc = await db.collection('artworks').doc(save.artworkId).get();

      if (artworkDoc.exists) {
        const artwork = artworkDoc.data();
        const artistDoc = await db.collection('users').doc(artwork.artistId).get();
        const artist = artistDoc.data();

        grid.innerHTML += `
          <div class="artwork-card">
            <img src="${artwork.imageUrl}" alt="${artwork.title}">
            <div class="artwork-info">
              <h3>${artwork.title}</h3>
              <p class="artist-name">by ${artist.displayName}</p>
              <a href="artwork.html?id=${artworkDoc.id}" class="btn-small">View Details</a>
            </div>
          </div>
        `;
      }
    }

  } catch (error) {
    console.error('Error loading saved artworks:', error);
    grid.innerHTML = '<p class="error">Error loading saved artworks. Please refresh the page.</p>';
  }
}

// 保存个人资料
async function saveProfile() {
  const user = auth.currentUser;
  if (!user) return;

  const messageEl = document.getElementById('profileMessage');

  try {
    const updateData = {
      displayName: document.getElementById('editDisplayName').value.trim(),
      bio: document.getElementById('editBio').value.trim()
    };

    // 如果是 artist，保存社交链接
    if (userData.role === 'artist') {
      updateData.socialLinks = {
        twitter: document.getElementById('editTwitter').value.trim(),
        instagram: document.getElementById('editInstagram').value.trim(),
        website: document.getElementById('editWebsite').value.trim()
      };
    }

    await db.collection('users').doc(user.uid).update(updateData);

    messageEl.textContent = 'Profile updated successfully!';
    messageEl.className = 'message success';

    setTimeout(() => {
      messageEl.textContent = '';
      messageEl.className = '';
    }, 3000);

  } catch (error) {
    console.error('Error saving profile:', error);
    messageEl.textContent = 'Error saving profile. Please try again.';
    messageEl.className = 'message error';
  }
}

// 删除作品
async function deleteArtwork(artworkId, title) {
  if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
    return;
  }

  try {
    // 删除作品
    await db.collection('artworks').doc(artworkId).delete();

    // 删除相关的 saves
    const saves = await db.collection('saves').where('artworkId', '==', artworkId).get();
    const batch = db.batch();
    saves.forEach(doc => batch.delete(doc.ref));
    await batch.commit();

    alert('Artwork deleted successfully');
    location.reload();

  } catch (error) {
    console.error('Error deleting artwork:', error);
    alert('Error deleting artwork. Please try again.');
  }
}
