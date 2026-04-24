let currentOrderFilter = 'all';

// 切换页面（复用原有逻辑，兼容首页跳转）
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
  });
  if (document.getElementById(pageId)) {
    document.getElementById(pageId).classList.add('active');
  }
  window.scrollTo(0, 0);
}

// 通过ID获取书籍信息（处理边界）
function getBookById(bookId) {
  const book = MOCK_BOOKS.find(b => b.book_id === bookId);
  return book || {
    title: '未知书籍',
    price: 0,
    icon: '📚',
    category: '未知分类'
  };
}

// 通过ID获取用户信息（处理边界）
function getUserById(userId) {
  const user = MOCK_USERS.find(u => u.user_id === userId);
  return user || {
    seller_name: '未知用户',
    seller_credit: 0
  };
}

// 订单状态转中文文本
function getOrderStatusText(status) {
  const statusMap = {
    'PENDING': '待处理',
    'FINISHED': '已完成',
    'CANCELED': '已取消'
  };
  return statusMap[status] || '未知状态';
}

// 渲染订单列表
function renderOrders(orders) {
  const container = document.getElementById('order-list-container');
  
  // 无订单时的提示
  if (orders.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:40px 20px; color:var(--gray);">
        <div style="font-size:48px; margin-bottom:16px;">📭</div>
        <div style="font-size:16px; font-weight:600;">暂无符合条件的订单</div>
        <div style="font-size:13px; margin-top:8px;">换个筛选条件看看吧～</div>
      </div>
    `;
    return;
  }

  // 渲染订单卡片
  container.innerHTML = orders.map(order => {
    const book = getBookById(order.book_id);
    const buyer = getUserById(order.buyer_id);
    const seller = getUserById(order.seller_id);
    const statusText = getOrderStatusText(order.order_status);
    const statusClass = `status-${order.order_status.toLowerCase()}`;

    return `
      <div class="order-card">
        <!-- 书籍封面 -->
        <div class="book-cover" style="font-size:36px">${book.icon}</div>
        
        <!-- 订单信息 -->
        <div style="flex:1;">
          <div class="book-title">${book.title}</div>
          
          <!-- 订单状态标签 -->
          <div class="order-status ${statusClass}" style="margin:8px 0;">
            ${statusText}
          </div>
          
          <!-- 价格 -->
          <div class="book-price" style="font-size:16px;"><span>¥</span>${book.price}</div>
          
          <!-- 订单元信息 -->
          <div class="order-meta">
            <div>📅 下单时间：${order.order_time}</div>
            ${order.finish_time ? `<div>✅ 完成时间：${order.finish_time}</div>` : ''}
            <div>👤 买家：${buyer.seller_name} | 👥 卖家：${seller.seller_name}</div>
            <div>🆔 订单编号：${order.order_id}</div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // 更新订单数量提示
  document.getElementById('order-count').textContent =
    `共找到 ${orders.length} 笔订单`;
}

// 应用订单筛选条件
function applyOrderFilter(chip, filterType) {
  currentOrderFilter = filterType;
  
  // 更新筛选按钮样式
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  
  // 筛选并渲染订单
  filterAndRenderOrders();
}

// 筛选订单核心逻辑
function filterAndRenderOrders() {
  let filteredOrders = [...MOCK_ORDERS];
  
  // 根据状态筛选
  if (currentOrderFilter !== 'all') {
    filteredOrders = filteredOrders.filter(order => 
      order.order_status === currentOrderFilter
    );
  }

  // 按下单时间倒序排列
  filteredOrders.sort((a, b) => 
    new Date(b.order_time) - new Date(a.order_time)
  );

  // 渲染筛选后的订单
  renderOrders(filteredOrders);
}

// 初始化：渲染全部订单
document.addEventListener('DOMContentLoaded', () => {
  filterAndRenderOrders();
});