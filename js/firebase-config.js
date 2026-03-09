// Firebase Configuration
// 注意：这些配置信息是公开的客户端密钥，可以安全地放在前端代码中

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);

// 导出 Firebase 服务
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// 开发环境下可以启用本地模拟器（可选）
// if (window.location.hostname === 'localhost') {
//   db.useEmulator('localhost', 8080);
//   auth.useEmulator('http://localhost:9099');
//   storage.useEmulator('localhost', 9199);
// }

console.log('Firebase initialized successfully');
