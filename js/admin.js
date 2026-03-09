// Admin Panel 逻辑

// 检查 admin 权限
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    alert('Please login to access admin panel');
    window.location.href = 'auth.html';
    return;
  }

  // 检查是否为 admin（这里简单检查 email，生产环境应使用 Custom Claims）
  const userDoc = await db.collection('users').doc(user.uid).get();
  const userData = userDoc.data();

  // 将你的 email 替换为实际的 admin email
  const ADMIN_EMAIL = 'your-admin-email@example.com'; // 替换为你的实际 email

  if (user.email !== ADMIN_EMAIL && userData.role !== 'admin') {
    alert('Access denied: Admin only');
    window.location.href = 'index.html';
    return;
  }

  // 加载所有数据
  loadUsers();
  loadArtworks();
  loadApplications();
});

// Tab 切换
function showTab(tabName) {
  // 隐藏所有 tabs
  document.querySelectorAll('.admin-tab-content').forEach(tab => {
    tab.classList.add('hidden');
  });

  // 移除所有按钮的 active 状态
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // 显示选中的 tab
  document.getElementById(tabName + 'Tab').classList.remove('hidden');
  document.getElementById(tabName + 'TabBtn').classList.add('active');
}

// 加载用户
async function loadUsers() {
  const tbody = document.getElementById('usersTableBody');

  try {
    const users = await db.collection('users').orderBy('createdAt', 'desc').get();

    if (users.empty) {
      tbody.innerHTML = '<tr><td colspan="5">No users found</td></tr>';
      return;
    }

    tbody.innerHTML = '';

    users.forEach(doc => {
      const user = doc.data();
      const createdAt = user.createdAt ? user.createdAt.toDate().toLocaleDateString() : 'N/A';

      tbody.innerHTML += `
        <tr>
          <td>${user.email}</td>
          <td>${user.displayName}</td>
          <td><span class="role-badge role-${user.role}">${user.role}</span></td>
          <td>${createdAt}</td>
          <td>
            <button onclick="viewUserProfile('${doc.id}')" class="btn-small">View</button>
            <button onclick="deleteUser('${doc.id}', '${user.email}')" class="btn-small btn-danger">Delete</button>
          </td>
        </tr>
      `;
    });

  } catch (error) {
    console.error('Error loading users:', error);
    tbody.innerHTML = '<tr><td colspan="5" class="error">Error loading users</td></tr>';
  }
}

// 加载作品
async function loadArtworks() {
  const tbody = document.getElementById('artworksTableBody');

  try {
    const artworks = await db.collection('artworks').orderBy('createdAt', 'desc').get();

    if (artworks.empty) {
      tbody.innerHTML = '<tr><td colspan="6">No artworks found</td></tr>';
      return;
    }

    tbody.innerHTML = '';

    for (const doc of artworks.docs) {
      const artwork = doc.data();
      const artistDoc = await db.collection('users').doc(artwork.artistId).get();
      const artist = artistDoc.exists ? artistDoc.data() : null;
      const createdAt = artwork.createdAt ? artwork.createdAt.toDate().toLocaleDateString() : 'N/A';

      tbody.innerHTML += `
        <tr>
          <td><img src="${artwork.imageUrl}" alt="${artwork.title}" class="admin-thumbnail"></td>
          <td>${artwork.title}</td>
          <td>${artist ? artist.displayName : 'Unknown'}</td>
          <td>
            <span class="status-badge ${artwork.isPublished ? 'status-published' : 'status-draft'}">
              ${artwork.isPublished ? 'Published' : 'Draft'}
            </span>
          </td>
          <td>${createdAt}</td>
          <td>
            <button onclick="window.open('artwork.html?id=${doc.id}', '_blank')" class="btn-small">View</button>
            <button onclick="togglePublish('${doc.id}', ${!artwork.isPublished})" class="btn-small">
              ${artwork.isPublished ? 'Unpublish' : 'Publish'}
            </button>
            <button onclick="deleteArtwork('${doc.id}', '${artwork.title}')" class="btn-small btn-danger">Delete</button>
          </td>
        </tr>
      `;
    }

  } catch (error) {
    console.error('Error loading artworks:', error);
    tbody.innerHTML = '<tr><td colspan="6" class="error">Error loading artworks</td></tr>';
  }
}

// 加载申请
async function loadApplications() {
  const tbody = document.getElementById('applicationsTableBody');

  try {
    const applications = await db.collection('applications').orderBy('submittedAt', 'desc').get();

    if (applications.empty) {
      tbody.innerHTML = '<tr><td colspan="6">No applications found</td></tr>';
      return;
    }

    tbody.innerHTML = '';

    applications.forEach(doc => {
      const app = doc.data();
      const submittedAt = app.submittedAt ? app.submittedAt.toDate().toLocaleDateString() : 'N/A';

      tbody.innerHTML += `
        <tr>
          <td>${app.name}</td>
          <td>${app.email}</td>
          <td><a href="${app.portfolioUrl}" target="_blank" class="link">View Portfolio</a></td>
          <td>
            <span class="status-badge status-${app.status}">
              ${app.status}
            </span>
          </td>
          <td>${submittedAt}</td>
          <td>
            <button onclick="viewApplication('${doc.id}')" class="btn-small">View Details</button>
            ${app.status === 'pending' ?
              `<button onclick="markApplicationReviewed('${doc.id}')" class="btn-small">Mark Reviewed</button>` : ''}
          </td>
        </tr>
      `;
    });

  } catch (error) {
    console.error('Error loading applications:', error);
    tbody.innerHTML = '<tr><td colspan="6" class="error">Error loading applications</td></tr>';
  }
}

// 查看用户资料
function viewUserProfile(userId) {
  window.open(`artist-profile.html?id=${userId}`, '_blank');
}

// 删除用户
async function deleteUser(userId, email) {
  if (!confirm(`Are you sure you want to delete user "${email}"? This will also delete all their artworks.`)) {
    return;
  }

  try {
    // 删除用户的所有作品
    const artworks = await db.collection('artworks').where('artistId', '==', userId).get();
    const batch = db.batch();
    artworks.forEach(doc => batch.delete(doc.ref));
    await batch.commit();

    // 删除用户文档
    await db.collection('users').doc(userId).delete();

    alert('User deleted successfully');
    loadUsers();

  } catch (error) {
    console.error('Error deleting user:', error);
    alert('Error deleting user. Please try again.');
  }
}

// 切换作品发布状态
async function togglePublish(artworkId, publish) {
  try {
    await db.collection('artworks').doc(artworkId).update({
      isPublished: publish,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert(`Artwork ${publish ? 'published' : 'unpublished'} successfully`);
    loadArtworks();

  } catch (error) {
    console.error('Error toggling publish:', error);
    alert('Error updating artwork. Please try again.');
  }
}

// 删除作品
async function deleteArtwork(artworkId, title) {
  if (!confirm(`Are you sure you want to delete "${title}"?`)) {
    return;
  }

  try {
    await db.collection('artworks').doc(artworkId).delete();

    // 删除相关的 saves
    const saves = await db.collection('saves').where('artworkId', '==', artworkId).get();
    const batch = db.batch();
    saves.forEach(doc => batch.delete(doc.ref));
    await batch.commit();

    alert('Artwork deleted successfully');
    loadArtworks();

  } catch (error) {
    console.error('Error deleting artwork:', error);
    alert('Error deleting artwork. Please try again.');
  }
}

// 查看申请详情
async function viewApplication(appId) {
  try {
    const appDoc = await db.collection('applications').doc(appId).get();

    if (!appDoc.exists) {
      alert('Application not found');
      return;
    }

    const app = appDoc.data();
    const submittedAt = app.submittedAt ? app.submittedAt.toDate().toLocaleString() : 'N/A';

    document.getElementById('applicationDetails').innerHTML = `
      <div class="application-detail">
        <h2>Application Details</h2>

        <p><strong>Name:</strong> ${app.name}</p>
        <p><strong>Email:</strong> ${app.email}</p>
        <p><strong>Portfolio:</strong> <a href="${app.portfolioUrl}" target="_blank">${app.portfolioUrl}</a></p>
        ${app.instagram ? `<p><strong>Instagram:</strong> ${app.instagram}</p>` : ''}
        ${app.twitter ? `<p><strong>Twitter:</strong> ${app.twitter}</p>` : ''}
        <p><strong>Status:</strong> <span class="status-badge status-${app.status}">${app.status}</span></p>
        <p><strong>Submitted At:</strong> ${submittedAt}</p>

        <div class="artist-statement">
          <h3>Artist Statement</h3>
          <p>${app.artistStatement}</p>
        </div>

        ${app.status === 'pending' ?
          `<button onclick="markApplicationReviewed('${appId}'); closeApplicationModal();" class="btn-primary">Mark as Reviewed</button>` : ''}
      </div>
    `;

    document.getElementById('applicationModal').classList.remove('hidden');

  } catch (error) {
    console.error('Error loading application:', error);
    alert('Error loading application details.');
  }
}

// 关闭申请详情模态框
function closeApplicationModal() {
  document.getElementById('applicationModal').classList.add('hidden');
}

// 标记申请为已审核
async function markApplicationReviewed(appId) {
  try {
    await db.collection('applications').doc(appId).update({
      status: 'reviewed',
      reviewedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert('Application marked as reviewed');
    loadApplications();

  } catch (error) {
    console.error('Error updating application:', error);
    alert('Error updating application. Please try again.');
  }
}
