// Artist Application 页面逻辑

// 字数统计
document.getElementById('artistStatement').addEventListener('input', (e) => {
  const text = e.target.value.trim();
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  document.getElementById('wordCount').textContent = wordCount;

  // 颜色提示
  const counter = document.getElementById('wordCount');
  if (wordCount < 200) {
    counter.style.color = '#c33';
  } else if (wordCount > 500) {
    counter.style.color = '#c33';
  } else {
    counter.style.color = '#3c3';
  }
});

// 表单提交
document.getElementById('applyForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitBtn = document.getElementById('submitBtn');
  const messageEl = document.getElementById('applyMessage');

  // 验证字数
  const statement = document.getElementById('artistStatement').value.trim();
  const words = statement.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  if (wordCount < 200) {
    messageEl.textContent = 'Artist statement must be at least 200 words.';
    messageEl.className = 'message error';
    return;
  }

  if (wordCount > 500) {
    messageEl.textContent = 'Artist statement must not exceed 500 words.';
    messageEl.className = 'message error';
    return;
  }

  // 禁用按钮
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';

  try {
    const applicationData = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      portfolioUrl: document.getElementById('portfolioUrl').value.trim(),
      artistStatement: statement,
      instagram: document.getElementById('instagram').value.trim(),
      twitter: document.getElementById('twitter').value.trim(),
      status: 'pending',
      submittedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    // 保存到 Firestore
    await db.collection('applications').add(applicationData);

    // 显示成功消息
    document.getElementById('applyForm').classList.add('hidden');
    document.getElementById('successMessage').classList.remove('hidden');

    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });

  } catch (error) {
    console.error('Error submitting application:', error);
    messageEl.textContent = 'Error submitting application. Please try again.';
    messageEl.className = 'message error';
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Application';
  }
});
