// Onboarding Modal Logic
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('onboardingModal');
  const newPartnerBtn = document.getElementById('newPartnerBtn');
  const establishedPartnerBtn = document.getElementById('establishedPartnerBtn');
  const newPartnerForm = document.getElementById('newPartnerForm');
  const establishedPartnerForm = document.getElementById('establishedPartnerForm');
  const startFastStartBtn = document.getElementById('startFastStart');
  const setGoalsBtn = document.getElementById('setGoals');

  // Show onboarding modal only if onboarding is not complete
  if (modal) {
    if (!localStorage.getItem('onboardingComplete')) {
      modal.style.display = 'block';
    } else {
      modal.style.display = 'none';
    }
  }

  // New Partner Selection
  newPartnerBtn.addEventListener('click', () => {
    newPartnerForm.style.display = 'flex';
    establishedPartnerForm.style.display = 'none';
    newPartnerBtn.classList.add('active');
    establishedPartnerBtn.classList.remove('active');
  });

  // Established Partner Selection
  establishedPartnerBtn.addEventListener('click', () => {
    establishedPartnerForm.style.display = 'flex';
    newPartnerForm.style.display = 'none';
    establishedPartnerBtn.classList.add('active');
    newPartnerBtn.classList.remove('active');
  });

  // Start Fast Start
  startFastStartBtn.addEventListener('click', () => {
    const joinDate = document.getElementById('joinDate').value;
    const customerCount = document.getElementById('customerCount').value;

    if (!joinDate) {
      alert('Please enter your join date');
      return;
    }

    // Save partner data
    localStorage.setItem('partnerType', 'new');
    localStorage.setItem('joinDate', joinDate);
    localStorage.setItem('customerCount', customerCount || '0');
    localStorage.setItem('onboardingComplete', 'true');

    // Update metrics for dashboard
    let metrics = JSON.parse(localStorage.getItem('metrics') || '{}');
    metrics.customersSignedCount = parseInt(customerCount) || 0;
    metrics.partnersSignedCount = 0;
    localStorage.setItem('metrics', JSON.stringify(metrics));
    if (typeof updateDashboard === 'function') updateDashboard();

    // Close modal and redirect to Fast Start
    modal.style.display = 'none';
    switchTab('dashboard');
    setTimeout(() => {
      if (typeof renderFastStartWidget === 'function') renderFastStartWidget();
    }, 100);
  });

  // Set Goals
  setGoalsBtn.addEventListener('click', () => {
    const establishedJoinDate = document.getElementById('establishedJoinDate').value;
    const currentLevel = document.getElementById('currentLevel').value;
    const targetLevel = document.getElementById('targetLevel').value;
    const targetDate = document.getElementById('targetDate').value;
    const customerCount = document.getElementById('establishedCustomerCount').value;
    const partnerCount = document.getElementById('establishedPartnerCount').value;

    if (!establishedJoinDate || !currentLevel || !targetLevel || !targetDate || !customerCount || !partnerCount) {
      alert('Please fill in all fields');
      return;
    }

    // Save partner data
    localStorage.setItem('partnerType', 'established');
    localStorage.setItem('joinDate', establishedJoinDate);
    localStorage.setItem('currentLevel', currentLevel);
    localStorage.setItem('targetLevel', targetLevel);
    localStorage.setItem('targetDate', targetDate);
    localStorage.setItem('customerCount', customerCount);
    localStorage.setItem('partnerCount', partnerCount);
    localStorage.setItem('onboardingComplete', 'true');

    // Update metrics for dashboard
    let metrics = JSON.parse(localStorage.getItem('metrics') || '{}');
    metrics.customersSignedCount = parseInt(customerCount) || 0;
    metrics.partnersSignedCount = parseInt(partnerCount) || 0;
    localStorage.setItem('metrics', JSON.stringify(metrics));
    if (typeof updateDashboard === 'function') updateDashboard();

    // Close modal and redirect to dashboard
    modal.style.display = 'none';
    switchTab('dashboard');
    setTimeout(() => {
      if (typeof renderFastStartWidget === 'function') renderFastStartWidget();
    }, 100);
  });
}); 