// 认证页面逻辑

// Tab 切换
function switchToLogin() {
  document.getElementById('loginForm').classList.remove('hidden');
  document.getElementById('signupForm').classList.add('hidden');
  document.getElementById('loginTab').classList.add('active');
  document.getElementById('signupTab').classList.remove('active');
  clearMessages();
}

function switchToSignup() {
  document.getElementById('signupForm').classList.remove('hidden');
  document.getElementById('loginForm').classList.add('hidden');
  document.getElementById('signupTab').classList.add('active');
  document.getElementById('loginTab').classList.remove('active');
  clearMessages();
}

function clearMessages() {
  document.getElementById('loginMessage').textContent = '';
  document.getElementById('signupMessage').textContent = '';
  document.getElementById('loginMessage').className = 'message';
  document.getElementById('signupMessage').className = 'message';
}

// 登录表单提交
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const messageEl = document.getElementById('loginMessage');

  try {
    messageEl.textContent = 'Logging in...';
    messageEl.className = 'message';

    await auth.signInWithEmailAndPassword(email, password);

    messageEl.textContent = 'Login successful! Redirecting...';
    messageEl.className = 'message success';

    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1000);

  } catch (error) {
    console.error('Login error:', error);
    messageEl.textContent = getErrorMessage(error.code);
    messageEl.className = 'message error';
  }
});

// 注册表单提交
document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const displayName = document.getElementById('displayName').value.trim();
  const role = document.getElementById('userRole').value;
  const messageEl = document.getElementById('signupMessage');

  if (!role) {
    messageEl.textContent = 'Please select your role';
    messageEl.className = 'message error';
    return;
  }

  try {
    messageEl.textContent = 'Creating your account...';
    messageEl.className = 'message';

    // 创建用户
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const userId = userCredential.user.uid;

    // 在 Firestore 中创建用户文档
    await db.collection('users').doc(userId).set({
      email: email,
      role: role,
      displayName: displayName,
      bio: '',
      avatarUrl: '',
      socialLinks: {
        twitter: '',
        instagram: '',
        website: ''
      },
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    messageEl.textContent = 'Account created successfully! Redirecting...';
    messageEl.className = 'message success';

    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1000);

  } catch (error) {
    console.error('Signup error:', error);
    messageEl.textContent = getErrorMessage(error.code);
    messageEl.className = 'message error';
  }
});

// 错误消息翻译
function getErrorMessage(errorCode) {
  const errorMessages = {
    'auth/email-already-in-use': 'This email is already registered. Please login instead.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/operation-not-allowed': 'Email/password accounts are not enabled.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.'
  };

  return errorMessages[errorCode] || 'An error occurred. Please try again.';
}

// 如果已登录，重定向到 dashboard
auth.onAuthStateChanged((user) => {
  if (user && window.location.pathname.includes('auth.html')) {
    window.location.href = 'dashboard.html';
  }
});
