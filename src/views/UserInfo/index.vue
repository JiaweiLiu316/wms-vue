<template>
  <div class="view-text">
    <p>顾客详情</p>
  </div>

  <!-- 新增按钮 -->
  <AddButton @click="showAddDialog = true" />

  <!-- 新增弹窗 -->
  <el-dialog v-model="showAddDialog" title="新增顾客" @close="handleClose">
    <el-form :model="addForm" ref="addFormRef" :rules="addRules" label-width="auto">
      <el-form-item label="姓名" prop="customerName">
        <el-input v-model="addForm.customerName" />
      </el-form-item>
      <el-form-item label="电话号码" prop="phoneNumber">
        <el-input v-model="addForm.phoneNumber" />
      </el-form-item>
      <el-form-item label="地址" prop="shippingAddress">
        <el-input v-model="addForm.shippingAddress" />
      </el-form-item>
      <el-form-item>
        <el-button style="margin-left: 40%;" type="primary" @click="onSubmit">创建</el-button>
        <el-button @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <!-- 编辑弹窗 -->
  <el-dialog v-model="showEditDialog" title="编辑顾客" @close="handleCloseEdit">
    <el-form :model="editForm" ref="editFormRef" label-width="auto">
      <el-form-item label="姓名" prop="customerName">
        <el-input v-model="editForm.customerName" disabled />
      </el-form-item>
      <el-form-item label="电话号码" prop="phoneNumber">
        <el-input v-model="editForm.phoneNumber" />
      </el-form-item>
      <el-form-item>
        <el-button style="margin-left: 40%;" type="primary" @click="onSubmitEdit">保存</el-button>
        <el-button @click="handleCloseEdit">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <!-- 顾客列表 -->
  <el-table :data="fullData" style="width: 100%" @row-click="handleRowClick">
    <el-table-column label="用戶姓名" prop="customerName">
      <template #default="{ row }">
        <span class="ellipsis" @click="showDetails(row)">
          {{ row.customerName }}
        </span>
      </template>
    </el-table-column>
    <el-table-column label="电话号码" prop="phoneNumber">
      <template #default="{ row }">
        <span class="ellipsis" @click="showDetails(row)">
          {{ row.phoneNumber }}
        </span>
      </template>
    </el-table-column>
    <el-table-column label="常用地址" prop="address">
      <template #default="scope">

        <div v-for="(addressItem, index) in scope.row.address" :key="index">
          <p v-if="typeof addressItem === 'string'">{{ addressItem.slice(-15) }}</p>
          <p v-else>无有效地址信息</p>
        </div>

      </template>
    </el-table-column>
    <el-table-column label="复购金额" prop="repurchaseAmount" />
    <el-table-column label="历史购物" prop="productIdAndNameVOS">
      <template #default="scope">
        <div v-for="(product, index) in scope.row.productIdAndNameVOS" :key="index" style="margin-bottom: 5px;">
          <el-tag size="small" v-if="typeof product.productName === 'string'">{{ product.productName.slice(-15) }}</el-tag>
          <el-tag size="small" v-else>无效名称</el-tag>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="right">
      <template #header>
        <el-input v-model="search" placeholder="搜索......" @input="fetchData" />
      </template>
      <template #default="scope">
        <el-button type="primary" :icon="EditIcon" circle @click="handleEdit(scope.$index, scope.row)" />
      </template>
    </el-table-column>
  </el-table>

  <!-- 查看顾客详情弹窗 -->
  <el-dialog v-model="showDetailsDialog" title="顾客详情" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form label-width="100px">
      <el-form-item label="用户名" prop="customerName">
        <el-input v-model="selectedCustomer.customerName" readonly />
      </el-form-item>
      <el-form-item label="联系方式" prop="phoneNumber">
        <el-input v-model="selectedCustomer.phoneNumber" readonly />
      </el-form-item>
      <el-form-item label="地址">
        <div v-for="(addressItems, index) in selectedCustomer.address" :key="index">
          <p class="addressItems">{{ addressItems }}</p> <!-- 每个地址占一行 -->
        </div>
      </el-form-item>
      <el-form-item label="复购金额" prop="repurchaseAmount">
        <el-input v-model="selectedCustomer.repurchaseAmount" readonly />
      </el-form-item>
      <el-form-item label="历史购物">
        <div>
          <div v-for="(product, index) in selectedCustomer.productIdAndNameVOS" :key="index" style="margin-bottom: 5px;">
            <el-tag size="small" class="productItems">{{ product.productName }}</el-tag>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <el-button @click="showDetailsDialog = false">关闭</el-button>
  </el-dialog>

  <!-- 分页 -->
  <el-pagination v-model:current-page="currentPage4" v-model:page-size="pageSize4" :page-sizes="[5, 10, 20]" layout="total, sizes, prev, pager, next, jumper" :total="totalData" @size-change="fetchData" @current-change="fetchData" />
</template>


<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import AddButton from '../components/AddButton/index.vue';
import { Delete as DeleteIcon, Edit as EditIcon } from '@element-plus/icons-vue';
import axios from 'axios';
import { customerInfoPageList, addCustomerInfo, getCustomerInfo, editCustomerInfo } from "@/api/userinfo.js";

// 分页
const search = ref('');
const currentPage4 = ref(1);
const pageSize4 = ref(5);
const totalData = ref(0);
const addFormRef = ref(null);
const editFormRef = ref(null);
let showAddDialog = ref(false);
let showEditDialog = ref(false);
const fullData = ref([]);
// 新增结构体
const addForm = ref({
  customerId: "",
  customerName: '',
  phoneNumber: '',
  shippingAddress: '',
});

const editForm = ref({
  customerId: "",
  customerName: '',
  phoneNumber: '',
  shippingAddress: '',
});

const selectedCustomer = ref({
  customerId: "",
  customerName: '',
  phoneNumber: '',
  repurchaseAmount: '',
  address: [],
  productIdAndNameVOS: []
})

const fetchData = async () => {
  try {
    const params = {
      page: currentPage4.value,
      size: pageSize4.value,
      search: search.value.trim(),
    }
    const res = await customerInfoPageList(params);
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
const addRules = {
  customerName: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
  phoneNumber: [{ required: true, message: '电话不能为空', trigger: 'blur' }],
};

// 新增提交按钮
const onSubmit = () => {
  addFormRef.value.validate(async (valid) => {
    if (valid) {
      addCustomerInfo(addForm.value).then(res => {
        if (res.status === 'success') {
          ElMessage.success('订单新增成功');
          showAddDialog.value = false;
          fetchData();
        } else {
          ElMessage.error(`新增失败: ${res.message || '未知错误'}`);
        }
      }).catch(error => {
        ElMessage.error(`请求失败: ${error.message || '未知错误'}`);
      });
    }
  });
};
const showDetailsDialog = ref(false);
// 显示详情
const showDetails = async (row) => {
  try {
    const response = await getCustomerInfo(row.customerId);
    selectedCustomer.value = response.data;
    showDetailsDialog.value = true;
  } catch (error) {
    ElMessage.error('获取详情失败');
  }
};

// 创建取消
const handleClose = () => {
  showAddDialog.value = false;
  addFormRef.value.resetFields();
};

// 编辑按钮
const handleEdit = (index, row) => {
  getCustomerInfo(row.customerId).then(res => {
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

// 编辑保存
const onSubmitEdit = () => {
  editFormRef.value.validate(async (valid) => {
    if (valid) {
      editCustomerInfo(editForm.value).then(res => {
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

// 编辑取消
const handleCloseEdit = () => {
  showEditDialog.value = false;
  editFormRef.value.resetFields();
};

</script>
<style scoped>
::v-deep(.el-descriptions__label) {
  font-weight: bold; /* 加粗 */
}
.addressItems {
  margin: auto;
}
.productItems {
  margin: auto;
}
</style>
