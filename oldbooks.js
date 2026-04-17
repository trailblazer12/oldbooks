let prevPage = 'page-home';
let currentFilter = 'all';
let currentKeyword = '';

// 切换页面显示
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
  });
  document.getElementById(pageId).classList.add('active');
  window.scrollTo(0, 0);
}

// 渲染书籍列表
function renderBooks(books, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = books.map(book => `
    <div class="book-card" onclick="showDetail(${book.book_id})">
      <div class="book-cover" style="font-size:36px">${book.icon}</div>
      <div class="book-info">
        <div class="book-title">${book.title}</div>
        <div class="book-meta">
          <span class="condition-badge">${getConditionText(book.condition)}</span>
          <span class="condition-badge">📚${book.category}</span>
        </div>
        <div class="book-footer">
          <div class="book-price"><span>¥</span>${book.price}</div>
          <div class="seller-info">@${book.seller_name} ⭐${book.seller_credit}</div>
        </div>
      </div>
    </div>
  `).join('');
}

// 成色数字转中文描述
function getConditionText(condition) {
  const map = {
    1: '⚠️ 残旧',
    2: '📌 一般',
    3: '✅ 良好',
    4: '⭐ 八成新',
    5: '🌟 近全新'
  };
  return map[condition] || '未知';
}

// 首页搜索触发
function doSearch() {
  const keyword = document.getElementById('home-search-input').value.trim();
  if (!keyword) return;
  currentKeyword = keyword;
  prevPage = 'page-home';
  document.getElementById('search-input').value = keyword;
  showPage('page-search');
  runSearch(keyword);
}

// 分类搜索触发
function searchByCategory(cat) {
  currentKeyword = cat;
  document.getElementById('search-input').value = cat;
  prevPage = 'page-home';
  showPage('page-search');
  runSearch(cat);
}

// 搜索页搜索触发
function doSearchFromPage() {
  currentKeyword = document.getElementById('search-input').value.trim();
  runSearch(currentKeyword);
}

// 核心搜索逻辑
function runSearch(keyword) {
  let results = MOCK_BOOKS.filter(book =>
    book.title.toLowerCase().includes(keyword.toLowerCase()) ||
    book.category.includes(keyword)
  );
  results = applyFilterLogic(results, currentFilter);
  
  document.getElementById('result-count').textContent =
    `共找到 ${results.length} 本与"${keyword}"相关的书`;
  renderBooks(results, 'search-book-list');
}

// 切换筛选条件
function applyFilter(chip, filterType) {
  currentFilter = filterType;
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  runSearch(currentKeyword);
}

// 筛选逻辑
function applyFilterLogic(books, filter) {
  if (filter === 'cheap')  return books.filter(b => b.price <= 30);
  if (filter === 'good')   return books.filter(b => b.condition >= 4);
  if (filter === 'credit') return books.filter(b => b.seller_credit >= 95);
  if (filter === 'new')    return [...books].reverse();
  return books;
}

// 显示书籍详情
function showDetail(bookId) {
  const book = MOCK_BOOKS.find(b => b.book_id === bookId);
  if (!book) return;

  prevPage = document.querySelector('.page.active').id;
  
  document.getElementById('detail-cover').textContent = book.icon;
  document.getElementById('detail-cover').style.fontSize = '80px';
  document.getElementById('detail-price').textContent = book.price;
  document.getElementById('detail-title').textContent = book.title;
  document.getElementById('detail-condition').textContent = `📦 成色：${getConditionText(book.condition)} | 📚 种类：${book.category}`;
  document.getElementById('detail-desc').textContent = `💬 卖家说：${book.description}`;
  document.getElementById('seller-name').textContent = book.seller_name;
  document.getElementById('seller-credit').textContent = `✅ 信用分 ${book.seller_credit} / 100`;
  document.getElementById('seller-avatar').textContent = book.seller_name[0];

  showPage('page-detail');
}

// 购买书籍逻辑
function buyBook() {
  const btn = document.querySelector('.buy-btn');
  btn.textContent = '⏳ 提交中…';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = '📩 我要买这本书';
    btn.disabled = false;
    document.getElementById('success-modal').classList.add('show');
  }, 600);
}

// 关闭成功弹窗
function closeModal() {
  document.getElementById('success-modal').classList.remove('show');
  showPage('page-home');
}

// 回车触发搜索
document.getElementById('home-search-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') doSearch();
});
document.getElementById('search-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') doSearchFromPage();
});

// 初始化首页书籍列表
renderBooks(MOCK_BOOKS, 'home-book-list');