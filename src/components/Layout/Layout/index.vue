<template>
  <div class="layout-container">
    <Sidebar /> <!-- 左侧菜单栏 -->
    <div class="main-content">
      <Navbar /> <!-- 顶部导航栏 -->
      <div class="content-wrapper">
        <div class="view-name"></div>
        <!-- 子路由的内容区域 -->
        <router-view />
      </div>

    </div>
    <div class="foter">
      <p>© 2024 楽童管理系统</p>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '../Sidebar/index.vue';
import Navbar from '../Navbar/index.vue';
</script>

<style scoped>
.layout-container {
  display: flex;
  height: 100%; /* 确保占满全屏 */
  margin: 0 auto; /* 保证左右居中 */
  box-sizing: border-box;
  justify-content: center; /* 水平居中 */

}
.content-wrapper {
  width: 90%; /* 确保整个页面宽度为100% */
  padding: 30px 15px 15px;
  box-shadow: 0px 0px 5px 0px #8cc5ff;
  border-radius: 4px;
  height: calc(100% - 60px);
  overflow: auto;
}
.view-name {
  padding: 0 10px;
  text-align: center;
  line-height: 30px;
  position: absolute;
  transform: translate(50px, -10px);
  border-radius: 4px;
  background: rgb(83, 168, 255);
  color: #fff;
  font-size: 16px;
}

.sidebar {
  position: fixed; /* 固定在左侧 */
  width: 250px;
  background-color: #d9f8f48a;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  top: 0; /* 固定在顶部 */
  left: 0; /* 固定在左边 */
}

.main-content {
  margin-left: 250px; /* 给主内容区域留出左侧栏的空间 */
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: #ffffff; /* 小米白背景色 */
  align-items: center;
}

.navbar {
  width: 100%;
  left: 250px;
  background-color: #b9deeb00;
  color: white;
  text-align: center;
  z-index: 10; /* 确保顶部栏在其他内容上面 */
}
</style>