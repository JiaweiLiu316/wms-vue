<template>
  <div class="login-wrapper">
    <div class="login-container">
      <h2>楽童-WMS</h2>
      <form @submit.prevent="handleSubmit">
        <div class="input-group">
          <label for="username">用户名</label>
          <input type="text" id="username" v-model="username" placeholder="请输入用户名" required />
        </div>
        <div class="input-group">
          <label for="password">密 码</label>
          <input type="password" id="password" v-model="password" placeholder="请输入密码" required />
        </div>
        <button type="submit">登 录</button>
      </form>
    </div>
    <div class="foter">
      <p>© 2024 楽童管理系统</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// 直接赋值为 'test'
const username = ref('test');
const password = ref('test');
const router = useRouter();

const handleSubmit = () => {
  const validUsername = 'test';
  const validPassword = 'test';

  // 校验用户名和密码
  if (username.value === validUsername && password.value === validPassword) {
    // 登录成功，跳转到首页
    router.push('/layout/home');  // 确保 "/home" 路由存在
  } else {
    // 登录失败，提示账户密码错误
    alert('账户名或密码错误');
  }
};
</script>

<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%; /* 设置父容器高度为 100vh，确保占满整个视口 */
  width: 100vw;
  background-color: #faf9f6; /* 小米白背景色 */
}
/* 登录容器样式 */
.login-container {
  width: 350px; /* 设置宽度 */
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
  background-color: #fff;
  margin-top: -100px;
  box-shadow: 0px 3px 12px 12px var(--el-color-primary-light-7);
}

h2 {
  margin-bottom: 15px;
  font-size: 28px;
  color: #333;
}

h3 {
  margin-top: 0;
  font-size: 16px;
  color: #666;
}

.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

label {
  width: 80px;
  text-align: justify;
  margin-right: 8px;
}

input {
  width: 100%;
  padding: 8px;
  margin-top: 8px;
  border-radius: 4px;
  border: 1px solid #dddddd62;
  background-color: rgba(250, 235, 215, 0.219);
  color: black;
  transition: all 0.3s ease; /* 添加过渡效果 */
}

input:focus {
  outline: none; /* 去掉默认的浏览器高亮 */
  box-shadow: 0 0 4px rgba(0, 128, 0, 0.4); /* 柔和的绿色阴影 */
  border: 1px solid rgba(0, 128, 0, 0.6); /* 边框颜色更淡 */
  background-color: rgba(240, 255, 240, 0.3); /* 选中时背景更淡 */
}

button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

</style>
