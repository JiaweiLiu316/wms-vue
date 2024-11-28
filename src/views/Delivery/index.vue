<template>
  <div class="view-text">
    <p>交收详情</p>
  </div>

  <!-- 顾客列表 -->
  <el-table :data="paginatedData" style="width: 100%">
    <el-table-column label="交收方式" prop="deliveryMethod">
      <template #default="{ row }">

        <span class="ellipsis" @click="showDetails(row)">{{ row.deliveryMethod }}</span>

      </template>
    </el-table-column>
    <el-table-column label="交收日期" prop="deliveryDate" />
    <el-table-column label="顾客" prop="customerName">
      <template #default="{ row }">

        <span class="ellipsis" @click="showDetails(row)">{{ row.customerName }}</span>

      </template>
    </el-table-column>
    <el-table-column label="联系方式" prop="customerPhone" />
    <el-table-column label="商品" prop="productsName" />
    <el-table-column label="交收地址" prop="deliveryAddress" />
    <el-table-column label="交收人员" prop="deliveryPerson" />
    <el-table-column label="交收状态" prop="isCompleted" >
      <template #default="{ row }">
          <el-tag :type="row.isCompleted ? 'success' : 'danger'" size="small">{{ row.isCompleted ? '✔️ 完成' : '⚠️ 待办' }}</el-tag>
        </template>
    </el-table-column>
    <el-table-column label="操作" align="right">
      <template #header>
        <el-input v-model="search" placeholder="搜索......" />
      </template>
      <template #default="scope">
        <el-button type="primary" :icon="EditIcon" circle @click="handleEdit(scope.$index, scope.row)" />
      </template>
    </el-table-column>
  </el-table>

  <!-- 分页 -->
  <el-pagination v-model:current-page="currentPage4" v-model:page-size="pageSize4" :page-sizes="[5, 10, 20]" layout="total, sizes, prev, pager, next, jumper" :total="totalData" />

  <!-- 商品详情弹窗 -->
  <el-dialog v-model="showDetailsDialog" title="交收详情" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="selectedDelivery" label-width="100px">
      <el-form-item label="交收ID">
        <el-input v-model="selectedDelivery.deliveryId" disabled />
      </el-form-item>
      <el-form-item label="订单ID">
        <el-input v-model="selectedDelivery.orderId" disabled />
      </el-form-item>
      <el-form-item label="交收方式">
        <el-input v-model="selectedDelivery.deliveryMethod" disabled />
      </el-form-item>
      <el-form-item label="交收日期">
        <el-input v-model="selectedDelivery.deliveryDate" disabled />
      </el-form-item>
      <el-form-item label="顾客名称">
        <el-input v-model="selectedDelivery.customerName" disabled />
      </el-form-item>
      <el-form-item label="联系方式">
        <el-input v-model="selectedDelivery.customerPhone" disabled />
      </el-form-item>
      <el-form-item label="商品">
        <el-input v-model="selectedDelivery.productsName" disabled />
      </el-form-item>
      <el-form-item label="交收地址">
        <el-input v-model="selectedDelivery.deliveryAddress" disabled />
      </el-form-item>
      <el-form-item label="交收人员">
        <el-input v-model="selectedDelivery.deliveryPerson" disabled />
      </el-form-item>
      <el-form-item label="交收状态">
        <el-switch v-model="selectedDelivery.isCompleted" disabled />
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="showDetailsDialog = false">关闭</el-button>
  </el-dialog>

  <!-- 编辑弹窗 -->
  <el-dialog v-model="showEditDialog" title="编辑交收" @close="handleCloseEdit">
    <el-form :model="editForm" ref="editFormRef" :rules="addRules" label-width="auto">
      <!-- 不显示在列表中的字段 -->
      <el-form-item label="交收ID" prop="deliveryId">
        <el-input v-model="editForm.deliveryId" disabled />
      </el-form-item>
      <el-form-item label="订单ID" prop="orderId">
        <el-input v-model="editForm.orderId" disabled />
      </el-form-item>
      <el-form-item label="交收日期" prop="deliveryDate">
        <el-input v-model="editForm.deliveryDate" />
      </el-form-item>
      <el-form-item label="交收方式" prop="deliveryMethod">
        <el-input v-model="editForm.deliveryMethod" />
      </el-form-item>
      <el-form-item label="顾客" prop="customerName">
        <el-input v-model="editForm.customerName" />
      </el-form-item>
      <el-form-item label="联系方式" prop="customerPhone">
        <el-input v-model="editForm.customerPhone" />
      </el-form-item>
      <el-form-item label="商品" prop="productsName">
        <el-input v-model="editForm.productsName" />
      </el-form-item>
      <el-form-item label="交收地址" prop="deliveryAddress">
        <el-input v-model="editForm.deliveryAddress" />
      </el-form-item>
      <el-form-item label="交收人员" prop="deliveryPerson">
        <el-input v-model="editForm.deliveryPerson" />
      </el-form-item>
      <el-form-item label="交收状态" prop="isCompleted">
        <el-switch v-model="editForm.isCompleted" />
      </el-form-item>
      <el-form-item>
        <el-button style="margin-left: 40%;" type="primary" @click="onEditSubmit">保存</el-button>
        <el-button @click="handleCloseEdit">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Delete as DeleteIcon, Edit as EditIcon } from '@element-plus/icons-vue';
import axios from 'axios';

// 控制弹窗显示
const showDetailsDialog = ref(false);
const showEditDialog = ref(false);
// 数据模型
const selectedDelivery = ref({
  deliveryId: "",
  orderId: "",
  deliveryMethod: "",
  deliveryDate: "",
  customerName: "",
  customerPhone: "",
  productsName: [],
  deliveryAddress: "",
  deliveryPerson: "",
  isCompleted: false,
});

const editForm = ref({
  deliveryId: "",
  orderId: "",
  deliveryMethod: "",
  deliveryDate: "",
  customerName: "",
  customerPhone: "",
  productsName: [],
  deliveryAddress: "",
  deliveryPerson: "",
  isCompleted: false,
});

// 分页、搜索和数据模型
const totalData = ref(0);
const currentPage4 = ref(1);
const pageSize4 = ref(10);
const search = ref('');
const fullData = ref([
  // 模拟数据
  { deliveryId: "D001", orderId: "O1001", deliveryMethod: "快递", deliveryDate: "2024-11-01 14:00", customerName: "张三", customerPhone: "13812345678", productsName: ["产品1", "产品2"], deliveryAddress: "北京市朝阳区XX路XX号", deliveryPerson: "李四", isCompleted: true },
  { deliveryId: "D002", orderId: "O1002", deliveryMethod: "自提", deliveryDate: "2024-11-02 10:30", customerName: "李四", customerPhone: "13987654321", productsName: ["产品3"], deliveryAddress: "上海市浦东新区XX路XX号", deliveryPerson: "王五", isCompleted: false },
  { deliveryId: "D003", orderId: "O1003", deliveryMethod: "快递", deliveryDate: "2024-11-03 09:00", customerName: "王五", customerPhone: "13765432109", productsName: ["产品4", "产品5", "产品6"], deliveryAddress: "广州市天河区XX路XX号", deliveryPerson: "赵六", isCompleted: true },
  // ... 更多数据
]);

// 过滤数据
const filteredData = computed(() => {
  const query = search.value.toLowerCase();
  return fullData.value.filter(
    (data) =>
      !search.value || // 如果没有搜索内容，显示所有数据
      data.customerName.toLowerCase().includes(query) || // 顾客名称
      data.customerPhone.includes(query) || // 顾客电话
      data.deliveryAddress.toLowerCase().includes(query) || // 交收地址
      data.deliveryMethod.toLowerCase().includes(query) || // 交收方式
      data.productsName.some(product => product.toLowerCase().includes(query)) || // 商品
      data.deliveryPerson.toLowerCase().includes(query) || // 交收人员
      String(data.isCompleted).includes(query) // 交收状态（布尔值转换为字符串进行匹配）
  );
});


// 更新分页数据
const loadData = () => {
  const filtered = filteredData.value.slice(
    (currentPage4.value - 1) * pageSize4.value,
    currentPage4.value * pageSize4.value
  );
  paginatedData.value = filtered;
  totalData.value = filteredData.value.length; // 更新总数据量
};

// 分页和搜索变化时重新加载数据
watch([currentPage4, pageSize4, search], loadData);

// 更新列表数据
const paginatedData = ref([]);
loadData();  // 初始化分页数据


// 显示详情
const showDetails = (row) => {
  selectedDelivery.value = { ...row };
  showDetailsDialog.value = true;
  showEditDialog.value = false;  // 确保在查看详情时不显示编辑弹窗
};

// 编辑数据
const handleEdit = (index, row) => {
  editForm.value = { ...row };
  showDetailsDialog.value = false;
  showEditDialog.value = true;
  // 确保在编辑时不显示详情弹窗
};

// 编辑提交
const onEditSubmit = async () => {
  // 保存数据
  const index = fullData.value.findIndex(item => item.deliveryId === editForm.value.deliveryId);
  if (index !== -1) {
    fullData.value[index] = { ...editForm.value };  // 更新数据
  }
  showEditDialog.value = false;  // 关闭编辑弹窗
};

// 关闭编辑弹窗
const handleCloseEdit = () => {
  showEditDialog.value = false;
};

</script>

<style scoped>
.view-text {
  padding: 10px;
  font-size: 16px;
}
</style>
