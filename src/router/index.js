import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Login/index.vue";
import Layout from "../components/Layout/Layout/index.vue";
import Home from "../views/Home/index.vue";
import UserInfo from "../views/UserInfo/index.vue";
import ProductInfo from "../views/ProductInfo/index.vue";
import OrderInfo from"../views/OrderInfo/index.vue";
import About from"../views/About/index.vue"
import Delivery from"../views/Delivery/index.vue"
import CustomerPayment from"../views/CustomerPayment/index.vue"

const routes = [
  {
    path: "/login", // 登录页路径
    name: "Login",
    component: Login,
  },
  {
    path: "/", // 根路径直接跳转到登录页
    redirect: "/login",
  },
  {
    path: "/layout", // 包含布局的页面路径
    component: Layout,
    children: [
      {
        path: "home", // 首页子路由
        name: "Home",
        component: Home,
      },
      {
        path: "userInfo", // 用户信息页面
        name: "userInfo",
        component: UserInfo,
      },{
        path: "orderInfo", // 订单页面
        name: "orderInfo",
        component: OrderInfo,
      },
      {
        path: "productInfo", // 商品页面
        name: "productInfo",
        component: ProductInfo,
      },
      {
        path: "about", // 关于
        name: "about",
        component: About,
      },
      {
        path: "delivery", // 关于
        name: "delivery",
        component: Delivery,
      },
      {
        path: "customerPayment", // 关于
        name: "customerPayment",
        component: CustomerPayment,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
