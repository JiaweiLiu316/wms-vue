<template>
  <div class="home-page">
    <!-- 表格展示 -->
    <el-table :data="filteredTableData" style="width: 100%" height="250">
      <el-table-column prop="dateTime" label="Time" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="state" label="State" />
      <el-table-column prop="city" label="City" />
      <el-table-column prop="address" label="Address" />
      <el-table-column prop="isCompleted" label="isCompleted">
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

// 当前日期，默认显示当月
const currentDate = ref(new Date());

// 存储选中的日期
const selectedDate = ref(null);
// 模拟任务数据
const events = ref([
  {
    dateTime: "2024-11-12 19:00:00",
    name: "Meeting",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    isCompleted: false,
  },
  {
    dateTime: "2024-11-12 20:00:00",
    name: "Dinner",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    isCompleted: true,
  },
  {
    dateTime: "2024-11-25 14:00:00",
    name: "Project Discussion",
    state: "California",
    city: "San Francisco",
    address: "No. 123, Market St, San Francisco",
    isCompleted: false,
  },
  {
    dateTime: "2024-11-23 16:00:00",
    name: "Code Review",
    state: "California",
    city: "San Francisco",
    address: "No. 123, Market St, San Francisco",
    isCompleted: false,
  },
  {
    dateTime: "2024-11-27 10:00:00",
    name: "Training",
    state: "California",
    city: "San Diego",
    address: "No. 456, Beach St, San Diego",
    isCompleted: true,
  },
]);

// 表格中展示的任务数据
const filteredTableData = ref([]);

// 获取某天的任务数量
const getTaskCount = (day) => {
  return events.value.filter((event) => formatDate(event.dateTime) === day)
    .length;
};

// 根据某天的任务数据生成状态和数量
const getTaskSummary = (day) => {
  const tasks = events.value.filter(
    (event) => formatDate(event.dateTime) === day
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
    (event) => formatDate(event.dateTime) === day
  );
  const hasPending = tasks.some((task) => !task.isCompleted);

  return hasPending ? "pending" : "completed";
};

// 格式化日期为 "yyyy-MM-dd"
const formatDate = (dateTime) => {
  const date = new Date(dateTime);
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
    (event) => formatDate(event.dateTime) === day
  ); // 更新表格数据
};
// 在组件加载时自动选中今天的日期，并填充当天数据
onMounted(() => {
  const today = new Date().toISOString().split("T")[0]; // 获取当前日期，格式为 "yyyy-MM-dd"
  selectedDate.value = today; // 选中今天的日期
  filteredTableData.value = events.value.filter(
    (event) => formatDate(event.dateTime) === today
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
