<template>
  <div class="view-text">
    <p>支付详情</p>
  </div>

  <!-- 支付列表 -->
  <el-table :data="fullData" style="width: 100%" @row-click="handleRowClick">
    <el-table-column label="付款ID" prop="paymentId">
      <template #default="{ row }">
        <el-tooltip class="item" effect="dark" :content="row.paymentId" placement="top">
          <span class="ellipsis" @click="showDetails(row)">{{ row.paymentId }}</span>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column label="订单ID" prop="orderId">
      <template #default="{ row }">
        <el-tooltip class="item" effect="dark" :content="row.orderId" placement="top">
          <span class="ellipsis" @click="showDetails(row)">{{ row.orderId }}</span>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column label="联系方式" prop="phoneNumber" />
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
          {{ row.isCompleted ? '已付' : '未付' }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="right">
      <template #header>
        <el-input v-model="search" placeholder="搜索......" @input="fetchData" />
      </template>
    </el-table-column>
  </el-table>

  <!-- 分页 -->
  <el-pagination v-model:current-page="currentPage4" v-model:page-size="pageSize4" :page-sizes="[5, 10, 20]" layout="total, sizes, prev, pager, next, jumper" :total="totalData" @size-change="fetchData" @current-change="fetchData" />

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
      <el-form-item label="联系方式">
        <el-input v-model="selectedPaymentDetail.phoneNumber" disabled />
      </el-form-item>
      <el-form-item label="商品列表">
        <el-input v-model="selectedPaymentDetail.productsList" disabled />
      </el-form-item>
      <el-form-item label="商品数量">
        <el-input v-model="selectedPaymentDetail.productsAmount" disabled />
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
import { ref, computed, watch, onMounted } from 'vue';
import axios from 'axios';
import { paymentPageList, getPaymenInfo } from "@/api/customerPayment.js";
import { ElMessage } from 'element-plus';
// 数据和状态管理
const search = ref('');
const currentPage4 = ref(1);
const pageSize4 = ref(5);
const totalData = ref(0);
const fullData = ref([]);
// 存储选择的付款详情
const selectedPaymentDetail = ref({
  paymentId: '',
  orderId: '',
  customerName: '',
  phoneNumber: '',
  productsList: "",
  paymentMethod: '',
  productsAmount: 0,
  paymentDate: '',
  amountDue: 0,
  amountPaid: 0,
  isCompleted: false
});
// 调用接口获取列表分页数据
const fetchData = async () => {
  try {
    const params = {
      page: currentPage4.value,
      size: pageSize4.value,
      search: search.value.trim(),
    }
    const res = await paymentPageList(params);
    fullData.value = res.data.records; // 后端返回的当前页数据
    totalData.value = res.data.total;  // 后端返回的总条目数
  } catch (err) {
    ElMessage.error('加载数据失败');
  }
};

fetchData();
// 分页监视器
watch([search, currentPage4, pageSize4], async () => {
  fetchData();
}, { immediate: true });
// 获取详情数据的函数
const fetchDetailData = async (paymentId) => {
  try {
    const response = await getPaymenInfo(paymentId);
    // 按照Result结构解析详情接口返回数据，判断状态是否为success
    if (response.status === 'success') {
      return response.data;
    } else {
      console.error('获取支付详情数据出错，消息：', response.message);
      return {};
    }
  } catch (error) {
    console.error('获取支付详情数据出错', error);
    return {};
  }
};
const paymentStatus = computed(() => {
  return selectedPaymentDetail.value.isCompleted ? '已完成' : '未完成';
});

// 显示弹窗
const showDetailsDialog = ref(false);

// 格式化日期
const formatDate = (date) => {
  return date ? new Date(date).toLocaleString() : '';
};

// 选择行时显示详情
const handleRowClick = async (row) => {
  const detail = await fetchDetailData(row.paymentId);
  selectedPaymentDetail.value = { ...detail };
  showDetailsDialog.value = true;
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
