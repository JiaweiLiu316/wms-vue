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
  <el-table :data="paginatedData" style="width: 100%" @row-click="handleRowClick">
    <el-table-column label="用戶姓名" prop="customerName" />
    <el-table-column label="电话号码" prop="phoneNumber" />
    <el-table-column label="常用地址" prop="address">
      <template #default="scope">
        <div>
          <div v-for="(address, index) in scope.row.address" :key="index">
            <p>{{ address.slice(-15) }}</p> <!-- 每个地址占一行 -->
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="复购金额" prop="repurchaseAmount" />
    <el-table-column label="历史购物" prop="productIdAndNameVOS">
      <template #default="scope">
        <div>
          <div v-for="(product, index) in scope.row.productIdAndNameVOS" :key="index" style="margin-bottom: 5px;">
            <el-tag size="small">{{ product.name.slice(-15) }}</el-tag>
          </div>
        </div>
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

  <!-- 查看列表 -->
  <el-descriptions v-if="selectedCustomer" title="User Info" column="2">
    <el-descriptions-item label="Username">{{ selectedCustomer.customerName }}</el-descriptions-item>
    <el-descriptions-item label="Telephone">{{ selectedCustomer.phoneNumber }}</el-descriptions-item>
    <el-descriptions-item label="Address">
      <div v-for="(address, index) in selectedCustomer.address" :key="index">
        <p class="addressItems">{{ address }}</p> <!-- 每个地址占一行 -->
      </div>
    </el-descriptions-item>
    <el-descriptions-item class="custom-bold-label" label="Products">
      <div v-for="(product, index) in selectedCustomer.productIdAndNameVOS" :key="index" style="margin-bottom: 5px;">
        <el-tag size="small" class="productItems">{{ product.name }}</el-tag>
      </div>
    </el-descriptions-item>
  </el-descriptions>

  <!-- 分页 -->
  <el-pagination v-model:current-page="currentPage4" v-model:page-size="pageSize4" :page-sizes="[5, 10, 20]" layout="total, sizes, prev, pager, next, jumper" :total="totalData" />
</template>


<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import AddButton from '../components/AddButton/index.vue';
import { Delete as DeleteIcon, Edit as EditIcon } from '@element-plus/icons-vue';
import axios from 'axios';

// 分页
const search = ref('');
const currentPage4 = ref(1);
const pageSize4 = ref(5);
const totalData = ref(0);

let showAddDialog = ref(false);
let showEditDialog = ref(false);

// 新增结构体
const addForm = ref({
  customerName: '',
  phoneNumber: '',
  shippingAddress: '',
});

const editForm = ref({
  customerName: '',
  phoneNumber: '',
  shippingAddress: '',
});

const addRules = {
  customerName: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
  phoneNumber: [{ required: true, message: '电话不能为空', trigger: 'blur' }],
};
const addFormRef = ref(null);
const editFormRef = ref(null);

// 模拟接口数据
const fullData = ref([
  { customerName: 'Alice', phoneNumber: '1234567890', address: ['Address 1', 'aaaaaqqqqqaaaaaaaaaaaaaaaqqq'], repurchaseAmount: 100, productIdAndNameVOS: [{ name: 'Product 1' }, { name: 'Product 1' }] },
  { customerName: 'Bob', phoneNumber: '4561234567', address: ['Address 2', '33333'], repurchaseAmount: 200, productIdAndNameVOS: [{ name: 'Product 2' }, { name: 'Product 1' }] },
]);

// 总数 分业用
totalData.value = fullData.value.length;

// 总数据 供过滤使用
const filteredData = computed(() => {
  const query = search.value.toLowerCase();
  return fullData.value.filter(
    (data) =>
      !search.value ||
      data.customerName.toLowerCase().includes(query) ||
      data.phoneNumber.includes(query) ||
      (data.address && data.address.join(' ').toLowerCase().includes(query))
  );
});

// 分页数据 过滤分页
const paginatedData = computed(() => {
  const start = (currentPage4.value - 1) * pageSize4.value;
  const end = currentPage4.value * pageSize4.value;
  return filteredData.value.slice(start, end);
});

// 更新总数
const updateTotalData = () => {
  totalData.value = filteredData.value.length;
};

// 分页监视器
watch([search, currentPage4, pageSize4], updateTotalData);

// 新增提交按钮
const onSubmit = () => {
  addFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const response = await axios.post('http://localhost:8100/api/customerInfo/add', addForm.value);
        if (response.data.success) {
          ElMessage.success('用户新增成功');
          showAddDialog.value = false;
          handleFormSubmitted(addForm.value);
        } else {
          ElMessage.error('新增失败');
        }
      } catch (error) {
        ElMessage.error('请求失败');
        console.error(error);
      }
    }
  });
};

// 处理添加后的数据刷新列表
const handleFormSubmitted = (newCustomer) => {
  fullData.value.push(newCustomer);
  updateTotalData();
};

// 创建取消
const handleClose = () => {
  showAddDialog.value = false;
  addFormRef.value.resetFields();
};

// 编辑按钮
const handleEdit = (index, row) => {
  editForm.value = { ...row }; // 将选中的顾客数据复制到编辑表单
  showEditDialog.value = true;
};

// 编辑保存
const onSubmitEdit = () => {
  axios.post('http://localhost:8100/api/customerInfo/edit', editForm.value)
    .then(response => {
      if (response.data.success) {
        ElMessage.success('用户信息更新成功');
        showEditDialog.value = false;
        const index = fullData.value.findIndex(item => item.phoneNumber === editForm.value.phoneNumber);
        if (index !== -1) {
          fullData.value[index] = { ...editForm.value };
          updateTotalData();
        }
      } else {
        ElMessage.error('更新失败');
      }
    })
    .catch(error => {
      ElMessage.error('请求失败');
      console.error(error);
    });
};

// 编辑取消
const handleCloseEdit = () => {
  showEditDialog.value = false;
  editFormRef.value.resetFields();
};

// 点击行显示
const handleRowClick = (row) => {
  selectedCustomer.value = row;
};

const selectedCustomer = ref(null);

// 点击其他地方时清空 selectedCustomer
document.addEventListener('click', (event) => {
  const tableElement = document.querySelector('.el-table');
  if (tableElement && !tableElement.contains(event.target)) {
    selectedCustomer.value = null;
  }
});

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
