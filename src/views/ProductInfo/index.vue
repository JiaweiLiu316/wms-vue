<template>
  <div class="view-text">
    <p>商品详情</p>
  </div>
  <!-- 新增按钮 -->
  <AddButton @click="showAddDialog = true" />
  <!-- 新增弹窗 -->
  <el-dialog v-model="showAddDialog" title="新增商品" @close="handleClose">
    <el-form :model="addForm" ref="addFormRef" :rules="addRules" label-width="auto">
      <el-form-item label="标识" prop="id">
        <el-input v-model="addForm.id" />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="addForm.name" />
      </el-form-item>
      <el-form-item label="单价" prop="price">
        <el-input v-model="addForm.price" />
      </el-form-item>
      <el-form-item label="库存" prop="stock">
        <el-input v-model="addForm.stock" />
      </el-form-item>
      <el-form-item label="类别" prop="category">
        <el-input v-model="addForm.category" />
      </el-form-item>
      <el-form-item label="出厂地区" prop="region">
        <el-input v-model="addForm.region" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="addForm.description" />
      </el-form-item>
      <el-form-item>
        <el-button style="margin-left: 40%;" type="primary" @click="onSubmit">创建</el-button>
        <el-button @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <!-- 商品列表 -->
  <el-table :data="fullData" style="width: 100%" @row-click="handleRowClick">
    <el-table-column label="标识 " prop="id" />
    <el-table-column label="名称" prop="name">
      <template #default="{ row }">
        <el-tooltip class="item" effect="dark" :content="row.name" placement="top">
          <span class="ellipsis" @click="showDetails(row)">{{ row.name }}</span>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column label="单价" prop="price" />
    <el-table-column label="库存数量" prop="stock" />
    <el-table-column label="类别" prop="category" />
    <el-table-column label="出厂地区" prop="region" />
    <el-table-column label="描述" prop="description">
      <template #default="{ row }">
        <el-tooltip class="item" effect="dark" :content="row.description" placement="top">
          <span class="ellipsis">{{ row.description }}</span>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="right">
      <template #header>
        <el-input v-model="search" placeholder="搜索......" @input="fetchData" />
      </template>
      <template #default="scope">
        <el-button type="primary" :icon="EditIcon" circle @click="handleEdit(scope.$index, scope.row)" />
        <el-button type="danger" :icon="DeleteIcon" circle @click="handleDelete(scope.$index, scope.row)" />
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <el-pagination v-model:current-page="currentPage4" v-model:page-size="pageSize4" :page-sizes="[5, 10, 20]" layout="total, sizes, prev, pager, next, jumper" :total="totalData" @size-change="fetchData" @current-change="fetchData" />

  <!-- 商品详情弹窗 -->
  <el-dialog v-model="showDetailsDialog" title="商品详情" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="selectedProduct" label-width="100px">
      <el-form-item label="标识">
        <el-input v-model="selectedProduct.id" disabled />
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="selectedProduct.name" disabled />
      </el-form-item>
      <el-form-item label="单价">
        <el-input v-model="selectedProduct.price" disabled />
      </el-form-item>
      <el-form-item label="库存数量">
        <el-input v-model="selectedProduct.stock" disabled />
      </el-form-item>
      <el-form-item label="类别">
        <el-input v-model="selectedProduct.category" disabled />
      </el-form-item>
      <el-form-item label="出厂地区">
        <el-input v-model="selectedProduct.region" disabled />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="selectedProduct.description" disabled />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-input v-model="selectedProduct.createdTime" disabled />
      </el-form-item>
      <el-form-item label="更新时间">
        <el-input v-model="selectedProduct.updatedTime" disabled />
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="showDetailsDialog = false">关闭</el-button>
  </el-dialog>

  <!-- 编辑弹窗 -->
  <el-dialog v-model="showEditDialog" title="编辑商品" @close="handleCloseEdit">
    <el-form :model="editForm" ref="editFormRef" :rules="addRules" label-width="auto">
      <el-form-item label="标识" prop="id">
        <el-input v-model="editForm.id" disabled />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="editForm.name" disabled />
      </el-form-item>
      <el-form-item label="单价" prop="price">
        <el-input v-model="editForm.price" :formatter="formatPrice" :parser="parsePrice" />
      </el-form-item>
      <el-form-item label="库存" prop="stock">
        <el-input v-model="editForm.stock" />
      </el-form-item>
      <el-form-item label="类别" prop="category">
        <el-input v-model="editForm.category" />
      </el-form-item>
      <el-form-item label="出厂地区" prop="region">
        <el-input v-model="editForm.region" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="editForm.description" />
      </el-form-item>
      <el-form-item>
        <el-button style="margin-left: 40%;" type="primary" @click="onEditSubmit">更新</el-button>
        <el-button @click="handleCloseEdit">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import AddButton from '../components/AddButton/index.vue';
import { Delete as DeleteIcon, Edit as EditIcon } from '@element-plus/icons-vue';
import axios from 'axios';
import { getProductList, addProduct, getProduct, editProduct, delProduct } from "@/api/productInfo.js";

// Setup for product data and dialogs
const search = ref('');
const currentPage4 = ref(1);
const pageSize4 = ref(5);
const totalData = ref(0);
const fullData = ref([]);
const addFormRef = ref(null);
const editFormRef = ref(null);

const selectedProduct = ref({
  id: '',
  name: '',
  price: '',
  stock: '',
  category: '',
  region: '',
  description: '',
  createdTime: '',
  updatedTime: ''
});
let showAddDialog = ref(false);
let showEditDialog = ref(false);
let showDetailsDialog = ref(false); // Flag for showing the details dialog
const addForm = ref({
  id: "",
  name: "",
  category: "",
  region: "",
  price: null,
  stock: null,
  description: ""
});
const editForm = ref({
  id: "",
  name: "",
  category: "",
  region: "",
  price: null,
  stock: null,
  description: ""
});
const addRules = {
  id: [
    {
      required: true,
      message: "标识不能为空",
      trigger: "blur"
    },
    {
      pattern: /^[a-zA-Z0-9]+-[a-zA-Z0-9]+-\d+$/,
      message: "标识格式不正确，必须是 产品类型（字符串）-品牌（字符串）-数字编号（数字串）",
      trigger: "blur"
    }
  ],
  name: [{ required: true, message: "商品名称不能为空", trigger: "blur" }],
  price: [
    { required: true, message: "商品单价不能为空", trigger: "blur" },
    {
      pattern: /^\d+(\.\d{1,2})?$/,  // 限制最多2位小数的价格
      message: "单价必须为数字,且最多两位小数",
      trigger: "blur"
    },
    {
      validator: (rule, value, callback) => {
        if (value && (parseFloat(value) < 0.1 || parseFloat(value) > 10000)) {
          callback(new Error("单价必须在 0.1 到 10000 之间"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  stock: [
    { required: true, message: "库存数量不能为空", trigger: "blur" },
    {
      pattern: /^[0-9]+$/,  // 确保库存是整数
      message: "库存数量必须是整数",
      trigger: "blur"
    },
    {
      validator: (rule, value, callback) => {
        if (value && (parseInt(value, 10) < 0 || parseInt(value, 10) > 10000)) {
          callback(new Error("库存数量必须在 0 到 10000 之间"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
};

// 格式化日期
const formatDate = (date) => {
  return date ? new Date(date).toLocaleString() : '';
};
const fetchData = async () => {
  try {
    const params = {
      page: currentPage4.value,
      size: pageSize4.value,
      search: search.value.trim(),
    }
    const res = await getProductList(params);
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

const onSubmit = () => {
  addFormRef.value.validate(async (valid) => {
    if (valid) {
      addProduct(addForm.value).then(res => {
        if (res.status === 'success') {
          ElMessage.success('商品新增成功');
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


const onEditSubmit = () => {
  editFormRef.value.validate(async (valid) => {
    if (valid) {
      editProduct(editForm.value).then(res => {
        if (res.status === 'success') {
          ElMessage.success('商品更新成功');
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


const handleEdit = (index, row) => {
  editForm.value = { ...row };
  showEditDialog.value = true;
};

const handleDelete = (index, row) => {
  ElMessageBox.confirm('此操作将永久删除该商品, 是否继续?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    delProduct(row.id).then(res => {
      if (res.status === 'success') {
        ElMessage.success('商品删除成功');

        fetchData();
      } else {
        ElMessage.error(`删除失败: ${res.message || '未知错误'}`); // 提示后端返回的 message
      }
    }).catch(error => {
      ElMessage.error(`请求失败: ${error.message || '未知错误'}`); // 捕获网络错误
    });
  });
};

// Method to show product details
const showDetails = (product) => {
  // 先检查传入的 product 是否有 id
  if (!product || !product.id) {
    ElMessage.error('商品ID无效');
    return;
  }

  getProduct(product.id).then(res => {
    if (res.status === 'success') {  // 修改为检查 res.status
      selectedProduct.value = {
        ...res.data,  // 将详细数据赋给 selectedProduct
        createdTime: res.data.createdTime,
        updatedTime: res.data.updatedTime
      };
      showDetailsDialog.value = true; // 显示详情弹窗
    } else {
      ElMessage.error(`获取商品详情失败: ${res.message || '未知错误'}`);
      console.error('获取商品详情失败', res);
    }
  }).catch(error => {
    // 捕获网络错误或其他异常
    ElMessage.error(`获取商品详情时发生错误: ${error.message}`);
    console.error('获取商品详情时发生错误', error);
  });
};
// 编辑取消
const handleCloseEdit = () => {
  showEditDialog.value = false;
  editFormRef.value.resetFields();
};
// 创建取消
const handleClose = () => {
  showAddDialog.value = false;
  addFormRef.value.resetFields();
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
  max-width: 150px; /* 设置合适的最大宽度 */
}
</style>
