<template>
  <div class="view-text">
    <p>交收详情</p>
  </div>

  <!-- 顾客列表 -->
  <el-table :data="fullData" style="width: 100%">
    <el-table-column label="交收方式" prop="deliveryMethod">
      <template #default="{ row }">
        <span class="ellipsis" @click="showDetails(row)">
          {{ deliveryMethodMap[row.deliveryMethod] || row.deliveryMethod }}
        </span>
      </template>
    </el-table-column>
    <el-table-column label="交收日期" prop="deliveryDate">
      <template #default="{ row }">
        <span>{{ formatDate(row.deliveryDate) }}</span>
      </template>
    </el-table-column>
    <el-table-column label="顾客" prop="customerName">
      <template #default="{ row }">
        <span class="ellipsis" @click="showDetails(row)">{{ row.customerName }}</span>
      </template>
    </el-table-column>
    <el-table-column label="联系方式" prop="phoneNumber" />
    <el-table-column label="商品" prop="productIds" />
    <el-table-column label="交收地址" prop="deliveryAddress" >
    <template #default="{ row }">
          <el-tooltip class="item" effect="dark" :content="row.deliveryAddress" placement="top">
            <span class="ellipsis" @click="showDetails(row)">{{ row.deliveryAddress.slice(-10) }}</span>
          </el-tooltip>
        </template>
        </el-table-column>
    <el-table-column label="备注" prop="description" />
    <el-table-column label="交收人员" prop="deliveryPerson" />
    <el-table-column label="交收状态" prop="isCompleted">
      <template #default="{ row }">
        <el-tag :type="row.isCompleted ? 'success' : 'danger'" size="small">{{ row.isCompleted ? '✔️ 完成' : '⚠️ 待办' }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="right">
      <template #header>
        <el-input v-model="search" placeholder="搜索......" @input="fetchData" />
      </template>
      <template #default="scope">
        <el-button type="primary" :icon="EditIcon" circle @click="handleEdit(scope.row)" />
      </template>
    </el-table-column>
  </el-table>

  <!-- 分页 -->
  <el-pagination v-model:current-page="currentPage4" v-model:page-size="pageSize4" :page-sizes="[5, 10, 20]" layout="total, sizes, prev, pager, next, jumper" :total="totalData" @size-change="fetchData" @current-change="fetchData" />

  <!-- 商品详情弹窗 -->
  <el-dialog v-model="showDetailsDialog" title="交收详情" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="selectedDelivery" label-width="100px">
      <el-form-item label="交收ID">
        <el-input v-model="selectedDelivery.deliveryId" disabled />
      </el-form-item>
      <el-form-item label="交收方式">
        <el-select v-model="selectedDelivery.deliveryMethod" placeholder="请选择交收方式" disabled>
          <el-option v-for="(label, value) in deliveryMethodMap" :key="value" :label="label" :value="value" />
        </el-select>
      </el-form-item>
      <el-form-item label="交收日期">
        <el-input v-model="selectedDelivery.deliveryDate" disabled />
      </el-form-item>
      <el-form-item label="顾客名称">
        <el-input v-model="selectedDelivery.customerName" disabled />
      </el-form-item>
      <el-form-item label="联系方式">
        <el-input v-model="selectedDelivery.phoneNumber" disabled />
      </el-form-item>
      <el-form-item label="商品">
        <el-input v-model="selectedDelivery.productIds" disabled />
      </el-form-item>
      <el-form-item label="交收地址">
        <el-input v-model="selectedDelivery.deliveryAddress" disabled />
      </el-form-item>
      <el-form-item label="交收人员">
        <el-input v-model="selectedDelivery.deliveryPerson" disabled />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="selectedDelivery.description" disabled />
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
      <el-form-item label="交收ID" prop="deliveryId">
        <el-input v-model="editForm.deliveryId" disabled />
      </el-form-item>
      <el-form-item label="交收方式" prop="deliveryMethod">
        <el-select v-model="editForm.deliveryMethod" placeholder="请选择交收方式">
          <el-option v-for="(label, value) in deliveryMethodMap" :key="value" :label="label" :value="value" />
        </el-select>
      </el-form-item>
      <el-form-item label="交收日期" prop="deliveryDate">
        <el-input v-model="editForm.deliveryDate" />
      </el-form-item>
      <el-form-item label="顾客名称" prop="customerName">
        <el-input v-model="editForm.customerName" readonly />
      </el-form-item>
      <el-form-item label="联系方式" prop="phoneNumber">
        <el-input v-model="editForm.phoneNumber" readonly />
      </el-form-item>
      <el-form-item label="商品" prop="productIds">
        <el-input v-model="editForm.productIds" readonly />
      </el-form-item>
      <el-form-item label="交收地址" prop="deliveryAddress">
        <el-input v-model="editForm.deliveryAddress" />
      </el-form-item>
      <el-form-item label="交收人员" prop="deliveryPerson">
        <el-input v-model="editForm.deliveryPerson" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="editForm.description" />
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
import { Edit as EditIcon } from '@element-plus/icons-vue';
import { deliveryPageList, getDelivery, editDelivery } from "@/api/delivery.js";

// 控制弹窗显示
const showDetailsDialog = ref(false);
const showEditDialog = ref(false);
// 分页、搜索和数据模型
const totalData = ref(0);
const currentPage4 = ref(1);
const pageSize4 = ref(5);
const search = ref('');
const fullData = ref([]);
const editFormRef = ref(null);

// 数据模型
const selectedDelivery = ref({
  deliveryId: "",
  deliveryMethod: "",
  deliveryDate: "",
  customerName: "",
  phoneNumber: "",
  productIds: [],
  deliveryAddress: "",
  deliveryPerson: "",
  description: "",
  isCompleted: false,
});

const editForm = ref({
  deliveryId: "",
  deliveryMethod: "",
  deliveryDate: "",
  customerName: "",
  phoneNumber: "",
  productIds: [],
  deliveryAddress: "",
  deliveryPerson: "",
  description: "",
  isCompleted: false,
});




const fetchData = async () => {
  try {
    const params = {
      page: currentPage4.value,
      size: pageSize4.value,
      search: search.value.trim(),
    }
    const res = await deliveryPageList(params);
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
// 格式化日期
const formatDate = (date) => {
  return date ? new Date(date).toLocaleString() : '';
};


const deliveryMethodMap = {
  sender_pays: "顺丰（寄付）",
  receiver_pays: "顺丰（到付）",
  express_locker: "快递柜",
  offline_delivery: "线下交付",
  undetermined: "待定",
};
const rules = {
  deliveryMethod: [{ required: true, message: "交收方式不能为空", trigger: "blur" }],
  deliveryDate: [{ required: true, message: "请选择交收日期", trigger: "change" }],
  customerName: [{ required: true, message: "顾客名称不能为空", trigger: "blur" }],
  deliveryAddress: [{ required: true, message: "交收地址不能为空", trigger: "blur" }],
  deliveryPerson: [{ required: true, message: "交收人员不能为空", trigger: "blur" }],
};


// 显示详情
const showDetails = async (row) => {
  try {
    const response = await getDelivery(row.deliveryId);
    selectedDelivery.value = response.data;
    showDetailsDialog.value = true;
  } catch (error) {
    ElMessage.error('获取详情失败');
  }
};

// 编辑数据
const handleEdit = (row) => {
  getDelivery(row.deliveryId).then(res => {
    if (res.status === 'success') {
      editForm.value = {
        ...res.data,
      };
      showEditDialog.value = true;
    } else {
      ElMessage.error('获取信息失败！')
    }
  }).catch(err => {
    ElMessage.error(`获取详情时发生错误: ${err.message}`);
  })

};

// 编辑提交
const onEditSubmit = () => {
  editFormRef.value.validate(async (valid) => {
    if (valid) {
      editDelivery(editForm.value).then(res => {
        if (res.status === 'success') {
          ElMessage.success('订单更新成功');
          showEditDialog.value = false;
          fetchData();
        } else {
          ElMessage.error(`更新失败: ${res.message || '未知错误'}`);
        }
      }).catch(error => {
        ElMessage.error(`请求失败: ${error.message || '未知错误'}`);
      });
    }
  });
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
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>