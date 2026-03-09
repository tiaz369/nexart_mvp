// 全局认证状态管理
// 这个文件应该在所有页面中加载，用于管理导航栏的登录/登出状态

let currentUser = null;
let currentUserData = null;

// 监听认证状态变化
auth.onAuthStateChanged(async (user) => {
  currentUser = user;

  if (user) {
    // 用户已登录
    try {
      const userDoc = await db.collection('users').doc(user.uid).get();
      if (userDoc.exists) {
        currentUserData = userDoc.data();
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }

    updateNavForLoggedIn();
  } else {
    // 用户未登录
    currentUserData = null;
    updateNavForLoggedOut();
  }
});

// 更新导航栏 - 已登录状态
function updateNavForLoggedIn() {
  const loginLink = document.getElementById('loginLink');
  const dashboardLink = document.getElementById('dashboardLink');
  const logoutLink = document.getElementById('logoutLink');

  if (loginLink) loginLink.classList.add('hidden');
  if (dashboardLink) dashboardLink.classList.remove('hidden');
  if (logoutLink) logoutLink.classList.remove('hidden');

  // 如果是 admin，显示 admin 链接
  if (currentUserData?.role === 'admin') {
    const adminLink = document.getElementById('adminLink');
    if (adminLink) adminLink.classList.remove('hidden');
  }
}

// 更新导航栏 - 未登录状态
function updateNavForLoggedOut() {
  const loginLink = document.getElementById('loginLink');
  const dashboardLink = document.getElementById('dashboardLink');
  const logoutLink = document.getElementById('logoutLink');
  const adminLink = document.getElementById('adminLink');

  if (loginLink) loginLink.classList.remove('hidden');
  if (dashboardLink) dashboardLink.classList.add('hidden');
  if (logoutLink) logoutLink.classList.add('hidden');
  if (adminLink) adminLink.classList.add('hidden');
}

// 登出功能
async function handleLogout() {
  try {
    await auth.signOut();
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Logout error:', error);
    alert('Error logging out. Please try again.');
  }
}

// 检查是否需要登录才能访问当前页面
function requireAuth() {
  auth.onAuthStateChanged((user) => {
    if (!user) {
      alert('Please login to access this page');
      window.location.href = 'auth.html';
    }
  });
}

// 检查 admin 权限
async function requireAdmin() {
  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      alert('Please login to access this page');
      window.location.href = 'auth.html';
      return;
    }

    const userDoc = await db.collection('users').doc(user.uid).get();
    if (!userDoc.exists || userDoc.data().role !== 'admin') {
      alert('Access denied: Admin only');
      window.location.href = 'index.html';
    }
  });
}
