<template>
  <div class="sidebar">
    <router-link to="/layout/home" class="menu-item first-item" active-class="active">首页</router-link>
    <router-link to="/layout/productInfo" class="menu-item" active-class="active">商品详情</router-link>
    <router-link to="/layout/orderInfo" class="menu-item" active-class="active">订单详情</router-link>
    <router-link to="/layout/delivery" class="menu-item" active-class="active">交收详情</router-link>
    <router-link to="/layout/customerPayment" class="menu-item" active-class="active">支付详情</router-link>
    <router-link to="/layout/userInfo" class="menu-item" active-class="active">顾客详情</router-link>
    <router-link to="/layout/about" class="menu-item" active-class="active">关于</router-link>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
};
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: #f4f4f4;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column; /* 让子元素垂直排列 */
}

.menu-item {
  display: block; /* 强制每个链接成为块级元素，保证换行 */
  padding: 10px;
  text-decoration: none;
  color: #333;
  margin-bottom: 15px; /* 增加下边距，确保链接之间有间隔 */
  font-weight: bold; /* 让字体加粗 */
  font-size: 18px; /* 设置字体大小 */
  border-radius: 8px; /* 设置圆角 */
  letter-spacing: 2px; /* 设置字母之间的间距 */
  transition: background-color 0.3s, transform 0.3s; /* 平滑过渡效果 */
}

.first-item {
  margin-top: 30px; /* 给第一个链接增加顶部间距 */
}

.menu-item:hover {
  background-color: #ddd;
  transform: scale(1.05); /* 鼠标悬停时略微放大 */
}

.active {
  background-color: #bde4bedc;
  color: white;
  border-radius: 8px; /* 确保选中状态也有圆角 */
}
</style>
