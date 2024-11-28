<template>
  <div class="view-text">
    <p>支付详情</p>
  </div>

  <!-- 支付列表 -->
  <el-table :data="paginatedData" style="width: 100%" @row-click="handleRowClick">
    <el-table-column label="付款ID" prop="paymentId" />
    <el-table-column label="订单ID" prop="orderId" />
    <el-table-column label="付款方式" prop="paymentMethod" />
    <el-table-column label="付款日期" prop="paymentDate">
      <template #default="{ row }">
        <span>{{ formatDate(row.paymentDate) }}</span>
      </template>
    </el-table-column>
    <el-table-column label="应付款额" prop="amountDue" />
    <el-table-column label="已付款额" prop="amountPaid" />
    <el-table-column label="付款状态" prop="isCompleted">
      <template #default="{ row }">
        <el-tag :type="row.isCompleted ? 'success' : 'danger'" size="small">
          {{ row.isCompleted ? '已完成' : '未完成' }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="right">
      <template #header>
        <el-input v-model="search" placeholder="搜索......" />
      </template>
    </el-table-column>
  </el-table>

  <!-- 分页 -->
  <el-pagination :current-page="currentPage4" :page-size="pageSize4" :page-sizes="[5, 10, 20]" layout="total, sizes, prev, pager, next, jumper" :total="totalData" @current-change="handlePageChange" @size-change="handlePageSizeChange" />

  <!-- 商品详情弹窗 -->
  <el-dialog v-model="showDetailsDialog" title="付款详情" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="selectedPaymentDetail" label-width="120px">
      <el-form-item label="付款ID">
        <el-input v-model="selectedPaymentDetail.paymentId" disabled />
      </el-form-item>
      <el-form-item label="订单ID">
        <el-input v-model="selectedPaymentDetail.orderId" disabled />
      </el-form-item>
      <el-form-item label="客户姓名">
        <el-input v-model="selectedPaymentDetail.customerName" disabled />
      </el-form-item>
      <el-form-item label="客户电话">
        <el-input v-model="selectedPaymentDetail.customerPhone" disabled />
      </el-form-item>
      <el-form-item label="产品名称">
        <div>
          <el-tag v-for="(product, index) in selectedPaymentDetail.productsName" :key="index" style="margin-right: 5px;">
            {{ product }}
          </el-tag>
        </div>
      </el-form-item>
      <el-form-item label="付款方式">
        <el-input v-model="selectedPaymentDetail.paymentMethod" disabled />
      </el-form-item>
      <el-form-item label="付款日期">
        <el-input v-model="selectedPaymentDetail.paymentDate" disabled />
      </el-form-item>
      <el-form-item label="应付款额">
        <el-input v-model="selectedPaymentDetail.amountDue" disabled />
      </el-form-item>
      <el-form-item label="已付款额">
        <el-input v-model="selectedPaymentDetail.amountPaid" disabled />
      </el-form-item>
      <el-form-item label="付款状态">
        <el-input :value="paymentStatus" disabled />
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="showDetailsDialog = false">关闭</el-button>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

// 数据和状态管理
const search = ref('');
const currentPage4 = ref(1);
const pageSize4 = ref(5);
const totalData = ref(0);

// 模拟接口数据
const fullData = ref([
  {
    paymentId: 'P12345',
    orderId: 'O98765',
    paymentMethod: '信用卡',
    paymentDate: '2024-11-01 10:00:00',
    amountDue: 100.00,
    amountPaid: 100.00,
    isCompleted: true
  },
  {
    paymentId: 'P12346',
    orderId: 'O98766',
    paymentMethod: '支付宝',
    paymentDate: '2024-11-02 12:00:00',
    amountDue: 150.00,
    amountPaid: 150.00,
    isCompleted: true
  },
  {
    paymentId: 'P12347',
    orderId: 'O98767',
    paymentMethod: '微信支付',
    paymentDate: '2024-11-03 14:30:00',
    amountDue: 200.00,
    amountPaid: 0.00,
    isCompleted: false
  },
  {
    paymentId: 'P12348',
    orderId: 'O98768',
    paymentMethod: '银行转账',
    paymentDate: '2024-11-04 16:45:00',
    amountDue: 500.00,
    amountPaid: 200.00,
    isCompleted: false
  },
  {
    paymentId: 'P12349',
    orderId: 'O98769',
    paymentMethod: '信用卡',
    paymentDate: '2024-11-05 18:00:00',
    amountDue: 350.00,
    amountPaid: 350.00,
    isCompleted: true
  }
  ,
  {
    paymentId: 'P12349',
    orderId: 'O98769',
    paymentMethod: '信用卡',
    paymentDate: '2024-11-05 18:00:00',
    amountDue: 350.00,
    amountPaid: 350.00,
    isCompleted: true
  }
  ,
  {
    paymentId: 'P12349',
    orderId: 'O98769',
    paymentMethod: '信用卡',
    paymentDate: '2024-11-05 18:00:00',
    amountDue: 350.00,
    amountPaid: 350.00,
    isCompleted: true
  }
  ,
  {
    paymentId: 'P12349',
    orderId: 'O98769',
    paymentMethod: '信用卡',
    paymentDate: '2024-11-05 18:00:00',
    amountDue: 350.00,
    amountPaid: 350.00,
    isCompleted: true
  }
]);
const paymentStatus = computed(() => {
  return selectedPaymentDetail.value.isCompleted ? '已完成' : '未完成';
});
// 总数
totalData.value = fullData.value.length;

// 过滤数据
const filteredData = computed(() => {
  const query = search.value.trim().toLowerCase();
  return fullData.value.filter(
    (data) =>
      !search.value ||
      data.paymentId.toLowerCase().includes(query) ||
      data.orderId.toLowerCase().includes(query) ||
      data.paymentMethod.toLowerCase().includes(query) ||
      data.paymentDate.toLowerCase().includes(query) ||
      String(data.amountDue).includes(query) ||
      String(data.amountPaid).includes(query) ||
      String(data.isCompleted).includes(query)
  );
});

// 分页数据
const paginatedData = computed(() => {
  const start = (currentPage4.value - 1) * pageSize4.value;
  const end = currentPage4.value * pageSize4.value;
  return filteredData.value.slice(start, end);
});

// 更新总数
const updateTotalData = () => {
  totalData.value = filteredData.value.length;
};

// 监听分页和搜索
watch([search, currentPage4, pageSize4], updateTotalData);

// 显示弹窗
const showDetailsDialog = ref(false);

// 存储选择的付款详情
const selectedPaymentDetail = ref({
  paymentId: '',
  orderId: '',
  customerName: '',
  customerPhone: '',
  productsName: [],
  paymentMethod: '',
  paymentDate: '',
  amountDue: 0,
  amountPaid: 0,
  isCompleted: false
});

// 格式化日期
const formatDate = (date) => {
  return date ? new Date(date).toLocaleString() : '';
};

// 选择行时显示详情
const handleRowClick = (row) => {
  selectedPaymentDetail.value = { ...row };
  showDetailsDialog.value = true;
};

// 处理分页变更
const handlePageChange = (newPage) => {
  currentPage4.value = newPage;
};

// 处理页面大小变化
const handlePageSizeChange = (newSize) => {
  pageSize4.value = newSize;
};
</script>

<style scoped>
.view-text {
  font-size: 24px;
  font-weight: bold;
}

.el-input {
  width: 100%;
}

.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}
</style>
