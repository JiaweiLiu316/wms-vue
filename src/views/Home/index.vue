<template>
  <div class="home-page">
    <!-- 表格展示 -->
    <el-table :data="filteredTableData" style="width: 100%" height="250">
      <el-table-column prop="deliveryDate" label="日期">
        <template #default="{ row }">
          <span>{{ formatDate01(row.deliveryDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="deliveryMethod" label="交收方式">
        <template #default="{ row }">
          <span class="ellipsis" @click="showDetails(row)">
            {{ deliveryMethodMap[row.deliveryMethod] || row.deliveryMethod }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="customerName" label="顾客" />
      <el-table-column prop="phoneNumber" label="联系方式" />
      <el-table-column prop="deliveryAddress" label="交收地址">
        <template #default="{ row }">
          <el-tooltip class="item" effect="dark" :content="row.deliveryAddress" placement="top">
            <span class="ellipsis" @click="showDetails(row)">{{ row.deliveryAddress.slice(-10) }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="products" label="商品">
        <template #default="{ row }">
          <div style="width: 100%;">
            <!-- 使用v-for遍历订单中的商品列表，为每个商品生成一个el-tag -->
            <el-tooltip v-for="(item, index) in row.products" :key="index" :content="item" placement="top" :popper-class="{'custom-el-tag': true}">
              <el-tag :key="index" :size="'medium'" class="custom-el-tag" :style="{ maxWidth: '20ch', whiteSpace: 'normal', wordWrap: 'break-word' }">
                <!-- 这里只显示item的键 -->
                {{ Object.keys(item)[0] }}
              </el-tag>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="备注" />
      <el-table-column prop="deliveryPerson" label="交收人员" />
      <el-table-column prop="isCompleted" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.isCompleted ? 'success' : 'danger'" size="small">{{ row.isCompleted ? '✔️ 完成' : '⚠️ 待办' }}</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <!-- 日历展示 -->
    <div class="calendar">
      <el-calendar v-model="currentDate">
        <!-- 自定义日期单元格 -->
        <template #date-cell="{ data }">
          <div class="date-cell" :class="{ 'is-selected': isSelectedDate(data.day) }" @click="selectDate(data.day)">
            <!-- 显示日期 -->
            <p>{{ formatDisplayDate(data.day) }}</p>
            <!-- 显示任务状态 -->
            <p v-if="getTaskCount(data.day) > 0" :class="getTaskClass(data.day)">
              {{ getTaskSummary(data.day) }}
            </p>
            <!-- 高亮日期时显示表情 -->
            <p v-if="isSelectedDate(data.day)" class="highlighted-date">
              😀
            </p>
          </div>
        </template>
      </el-calendar>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, toRaw } from "vue";
import { deliveryList } from "@/api/delivery.js";
import { ElMessage } from 'element-plus';

// 当前日期，默认显示当月
const currentDate = ref(new Date());

// 存储选中的日期
const selectedDate = ref(null);
// 模拟任务数据
const events = ref([]);
const filteredTableData = ref([]);
const fetchData = async () => {
  try {
    const res = await deliveryList();
    events.value = res.data; // 后端返回的当前页数据
  } catch (err) {
    ElMessage.error('加载数据失败');
  }
};
fetchData();
// 表格中展示的任务数据
const deliveryMethodMap = {
  sender_pays: "顺丰（寄付）",
  receiver_pays: "顺丰（到付）",
  express_locker: "快递柜",
  offline_delivery: "线下交付",
  undetermined: "待定",
};

// 获取某天的任务数量
const getTaskCount = (day) => {
  return events.value.filter((event) => formatDate(event.deliveryDate) === day)
    .length;
};

// 根据某天的任务数据生成状态和数量
const getTaskSummary = (day) => {
  const tasks = events.value.filter(
    (event) => formatDate(event.deliveryDate) === day
  );
  const completedCount = tasks.filter((task) => task.isCompleted).length;
  const pendingCount = tasks.length - completedCount;

  if (pendingCount > 0) {
    return `⚠️ 待办：${pendingCount}/${tasks.length}`;  // 显示“未完成/总数”
  } else {
    return `✔️ 完成：${completedCount}`;
  }
};

// 根据某天的任务状态返回对应的样式类
const getTaskClass = (day) => {
  const tasks = events.value.filter(
    (event) => formatDate(event.deliveryDate) === day
  );
  const hasPending = tasks.some((task) => !task.isCompleted);

  return hasPending ? "pending" : "completed";
};
const formatDate01 = (date) => {
  return date ? new Date(date).toLocaleString() : '';
};
// 格式化日期为 "yyyy-MM-dd"
const formatDate = (deliveryDate) => {
  const date = new Date(deliveryDate);
  return date.toISOString().split("T")[0];
};

// 格式化显示日期（去掉年份，仅显示 MM-DD）
const formatDisplayDate = (day) => {
  return day.split("-").slice(1).join("-");
};

// 判断某天是否被选中
const isSelectedDate = (day) => {
  return selectedDate.value === day;
};

// 选中日期时的处理
const selectDate = (day) => {
  selectedDate.value = day; // 更新选中日期
  filteredTableData.value = events.value.filter(
    (event) => formatDate(event.deliveryDate) === day
  ); // 更新表格数据
};
// 在组件加载时自动选中今天的日期，并填充当天数据
onMounted(() => {
  const today = new Date().toISOString().split("T")[0]; // 获取当前日期，格式为 "yyyy-MM-dd"
  selectedDate.value = today; // 选中今天的日期
  filteredTableData.value = events.value.filter(
    (event) => formatDate(event.deliveryDate) === today
  ); // 填充当天的任务数据
});
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.calendar {
  width: 100%;
  padding: 1px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f4f4f4;
}
.date-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70px;
  max-width: 100%;
  overflow: hidden;
  position: relative;
}

.date-text {
  font-size: 14px;
  margin-bottom: 5px;
  white-space: nowrap; /* 防止文本溢出 */
  overflow: hidden;
  text-overflow: ellipsis; /* 超出部分用省略号表示 */
}

.highlighted-date {
  font-size: 20px;
  margin-top: 5px;
  color: #ffcc00;
  position: absolute; /* 绝对定位 */
  bottom: 5px; /* 距离单元格底部 5px */
  left: 50%;
  transform: translateX(-50%);
  z-index: 0;
}

.completed {
  color: green;
  font-size: 12px;
}

.pending {
  color: red;
  font-size: 12px;
}
</style>
