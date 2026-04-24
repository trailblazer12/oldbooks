let prevPage = 'page-home';
let currentFilter = 'all';
let currentKeyword = '';

// 通过seller_id获取用户信息（处理边界情况：用户不存在时返回默认值）
function getUserBySellerId(sellerId) {
  const user = MOCK_USERS.find(u => u.user_id === sellerId);
  return user || {
    seller_name: '未知卖家',
    seller_credit: 0,
    phone: '未知号码' // 备用字段
  };
}

// 切换页面显示
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
  });
  document.getElementById(pageId).classList.add('active');
  window.scrollTo(0, 0);
}

// 渲染书籍列表（从用户表获取卖家信息）
function renderBooks(books, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = books.map(book => {
    // 关联用户信息
    const seller = getUserBySellerId(book.seller_id);
    return `
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
          <div class="seller-info">@${seller.seller_name} ⭐${seller.seller_credit}</div>
        </div>
      </div>
    </div>
  `}).join('');
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

// 核心搜索逻辑（过滤已卖出书籍）
function runSearch(keyword) {
  let results = MOCK_BOOKS.filter(book =>
    (book.title.toLowerCase().includes(keyword.toLowerCase()) ||
    book.category.includes(keyword)) &&
    book.is_sold === 0 // 关键：只保留未卖出的书籍
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
  if (filter === 'credit') {
    //筛选信用分需从用户表获取
    return books.filter(book => {
      const seller = getUserBySellerId(book.seller_id);
      return seller.seller_credit >= 95;
    });
  }
  if (filter === 'new')    return [...books].reverse();
  return books;
}

// 显示书籍详情（从用户表获取卖家信息）
function showDetail(bookId) {
  const book = MOCK_BOOKS.find(b => b.book_id === bookId);
  if (!book) return;

  // 关联用户信息
  const seller = getUserBySellerId(book.seller_id);
  
  prevPage = document.querySelector('.page.active').id;
  
  document.getElementById('detail-cover').textContent = book.icon;
  document.getElementById('detail-cover').style.fontSize = '80px';
  document.getElementById('detail-price').textContent = book.price;
  document.getElementById('detail-title').textContent = book.title;
  document.getElementById('detail-condition').textContent = `📦 成色：${getConditionText(book.condition)} | 📚 种类：${book.category}`;
  document.getElementById('detail-desc').textContent = `💬 卖家说：${book.description}`;
  document.getElementById('seller-name').textContent = seller.seller_name;
  document.getElementById('seller-credit').textContent = `✅ 信用分 ${seller.seller_credit} / 100`;
  document.getElementById('seller-avatar').textContent = seller.seller_name[0];

  showPage('page-detail');
}

// 渲染已完成订单（取前2条）
function renderFinishedOrders() {
  // 筛选已完成订单并取前2条
  const finishedOrders = MOCK_ORDERS
    .filter(order => order.order_status === "FINISHED")
    .slice(0, 2);
  
  const container = document.getElementById('finished-order-list');
  
  // 无订单时显示提示
  if (finishedOrders.length === 0) {
    container.innerHTML = '<div class="no-order">暂无已完成订单</div>';
    return;
  }

  // 渲染订单卡片
  container.innerHTML = finishedOrders.map(order => {
    // 关联书籍信息（兼容书籍不存在的情况）
    const book = MOCK_BOOKS.find(b => b.book_id === order.book_id) || { title: "未知书籍" };
    // 关联买家/卖家信息（兼容用户不存在的情况）
    const buyer = MOCK_USERS.find(u => u.user_id === order.buyer_id) || { seller_name: "未知买家" };
    const seller = MOCK_USERS.find(u => u.user_id === order.seller_id) || { seller_name: "未知卖家" };

    return `
      <div class="order-card">
        <div class="order-header">
          <span class="order-id">订单 #${order.order_id}</span>
          <span class="order-status">✅ 已完成</span>
        </div>
        <div class="order-body">
          <div class="order-book">📚 ${book.title}</div>
          <div class="order-participants">
            <span>买家：${buyer.seller_name}</span>
            <span>卖家：${seller.seller_name}</span>
          </div>
          <div class="order-time">
            <span>下单：${order.order_time}</span>
            <span>完成：${order.finish_time}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}
// 初始化首页书籍列表（过滤已卖出的书籍）
renderBooks(MOCK_BOOKS.filter(book => book.is_sold === 0), 'home-book-list');
// 新增：初始化渲染已完成订单
renderFinishedOrders();

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

// 初始化首页书籍列表（过滤已卖出的书籍）
renderBooks(MOCK_BOOKS.filter(book => book.is_sold === 0), 'home-book-list');