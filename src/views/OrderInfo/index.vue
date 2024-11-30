<template>
  <div class="view-text">
    <p>订单详情</p>
  </div>
  <!-- 新增按钮 -->
  <AddButton @click="showAddDialog = true" />
  <!-- 新增弹窗 -->
  <el-dialog v-model="showAddDialog" title="新增订单" @close="handleClose" :width="'80%'">
    <el-scrollbar>
      <el-form :model="addForm" ref="addFormRef" :rules="addRules" label-width="auto">
        <!-- 顾客信息模块 -->
        <div class="section-title">
          <el-tag type="info" class="module-tag">顾客信息</el-tag>
        </div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="顾客姓名" prop="customerInfoVO.customerName">
              <el-input v-model="addForm.customerInfoVO.customerName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="顾客电话" prop="customerInfoVO.phoneNumber">
              <el-input v-model="addForm.customerInfoVO.phoneNumber" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="顾客地址" prop="customerInfoVO.shippingAddress">
              <el-input v-model="addForm.customerInfoVO.shippingAddress" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="顾客ID" prop="customerInfoVO.customerId" v-show="false">
              <el-input v-model="addForm.customerInfoVO.customerId" />
            </el-form-item>
          </el-col>

        </el-row>

        <!-- 交收信息模块 -->
        <div class="section-title">
          <el-tag type="info" class="module-tag">交收信息</el-tag>
        </div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="交收方式" prop="deliveryInfoVO.deliveryMethod">
              <el-select v-model="addForm.deliveryInfoVO.deliveryMethod" placeholder="选择交收方式">
                <el-option label="顺丰（寄付）" value="sender_pays" />
                <el-option label="顺丰（到付）" value="receiver_pays" />
                <el-option label="快递柜" value="express_locker" />
                <el-option label="线下交付" value="offline_delivery" />
                <el-option label="待定" value="undetermined" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="交收地址" prop="deliveryInfoVO.deliveryAddress">
              <el-input v-model="addForm.deliveryInfoVO.deliveryAddress" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="交收日期" prop="deliveryInfoVO.deliveryDate">
              <el-input v-model="addForm.deliveryInfoVO.deliveryDate" type="datetime-local" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="交收人" prop="deliveryInfoVO.deliveryPerson">
              <el-input v-model="addForm.deliveryInfoVO.deliveryPerson" />
            </el-form-item>

          </el-col>
        </el-row>
        <!-- 新增交收人字段 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="备注" prop="deliveryInfoVO.description">
              <el-input v-model="editForm.deliveryInfoVO.description" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="交收状态" prop="deliveryInfoVO.isCompleted">
              <el-radio-group v-model="addForm.deliveryInfoVO.isCompleted">
                <el-radio :label="true">完成</el-radio>
                <el-radio :label="false">未完成</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 支付信息模块 -->
        <div class="section-title">
          <el-tag type="info" class="module-tag">支付信息</el-tag>
        </div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="支付方式" prop="paymentInfoVO.paymentMethod">
              <el-select v-model="addForm.paymentInfoVO.paymentMethod" placeholder="选择支付方式">
                <el-option label="Payme" value="Payme" />
                <el-option label="Alipay" value="Alipay" />
                <el-option label="FPS" value="FPS" />
                <el-option label="Wechat" value="Wechat" />
                <el-option label="Cash" value="Cash" />
                <el-option label="Bank" value="Bank" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="应付金额" prop="paymentInfoVO.amountDue">
              <el-input v-model="addForm.paymentInfoVO.amountDue" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="已付金额" prop="paymentInfoVO.amountPaid">
              <el-input v-model="addForm.paymentInfoVO.amountPaid" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="支付日期" prop="paymentInfoVO.paymentDate">
              <el-input v-model="addForm.paymentInfoVO.paymentDate" type="datetime-local" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="支付状态" prop="paymentInfoVO.isCompleted">
              <el-radio-group v-model="addForm.paymentInfoVO.isCompleted">
                <el-radio :label="true">已付</el-radio>
                <el-radio :label="false">未付</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 订单商品列表模块 -->
        <div>
          <div class="section-title">
            <el-tag type="info" class="module-tag">订单商品</el-tag>
          </div>

          <div v-for="(item, index) in addForm.orderItemVOList" :key="index">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="'商品ID'">
                  <el-input v-model="item.productBasicInfoVO.productId" readonly />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item :label="'商品名称'">
                  <el-select v-model="item.productBasicInfoVO.productName" filterable remote remote-method="searchProducts" :loading="loading" placeholder="请选择商品名称" @change="onProductSelect(item, index)">
                    <el-option v-for="product in productList" :key="product.productId" :label="product.productName" :value="product.productName" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="商品数量">
                  <el-input v-model="item.orderItemQuantity" />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="商品库存">
                  <el-input v-model="item.productBasicInfoVO.productStock" readonly />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row v-if="item.orderItemQuantity > item.productBasicInfoVO.productStock" :gutter="20">
              <el-col :span="24">
                <el-tag type="danger" class="warning-tag">数量超出库存！</el-tag>
              </el-col>
            </el-row>

            <!-- 删除和新增按钮在同一行，调整按钮间距 -->
            <el-row justify="space-between" style="margin-top: 10px; margin-bottom: 20px;">
              <!-- 删除按钮 -->
              <el-col :span="11">
                <el-button @click="removeOrderItem(index)" type="danger" style="width: 20%;">
                  <el-icon>
                    <RemoveFilled />
                  </el-icon> 删除条目
                </el-button>
              </el-col>

              <!-- 新增按钮 -->
              <el-col :span="11">
                <el-button @click="addOrderItem" type="primary" style="width: 20%;">
                  <el-icon>
                    <CirclePlusFilled />
                  </el-icon> 增加条目
                </el-button>
              </el-col>
            </el-row>
            <el-divider border-style="dashed" />
          </div>
        </div>
        <!-- 操作按钮 -->
        <el-form-item>
          <el-button style="margin-left: 40%;" type="primary" @click="onSubmit">创建</el-button>
          <el-button @click="handleClose">取消</el-button>
        </el-form-item>

      </el-form>
    </el-scrollbar>
  </el-dialog>

  <!-- 订单列表 -->
  <el-table :data="fullData" style="width: 100%" @row-click="handleRowClick">
    <el-table-column label="订单ID" prop="orderId">
      <template #default="{ row }">
        <el-tooltip class="item" effect="dark" :content="row.orderId" placement="top">
          <span class="ellipsis" @click="showDetails(row)">{{ row.orderId }}</span>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column label="支付状态" prop="paymentInfoVO.isCompleted">
      <template #default="{ row }">
        <el-tag :type="row.paymentInfoVO.isCompleted ? 'success' : 'danger'" size="small">
          {{ row.paymentInfoVO.isCompleted ? '已付' : '未付' }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="交付方式" prop="deliveryInfoVO.deliveryMethod">
      <template #default="{ row }">
        <el-tooltip class="item" effect="dark" :content="mapDeliveryMethod(row.deliveryInfoVO.deliveryMethod)" placement="top">
          <span class="ellipsis" @click="showDetails(row)">{{ mapDeliveryMethod(row.deliveryInfoVO.deliveryMethod) }}</span>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column label="交付时间" prop="deliveryInfoVO.deliveryDate">
      <template #default="{ row }">
        <span>{{ formatDate(row.deliveryInfoVO.deliveryDate) }}</span>
      </template>
    </el-table-column>

    <el-table-column label="交付地址" prop="deliveryInfoVO.deliveryAddress">
      <template #default="{ row }">
        <el-tooltip class="item" effect="dark" :content="row.deliveryInfoVO.deliveryAddress" placement="top">
          <span class="ellipsis" @click="showDetails(row)">{{ row.deliveryInfoVO.deliveryAddress}}</span>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column label="交付状态" prop="deliveryInfoVO.isCompleted">
      <template #default="{ row }">
        <el-tag :type="row.deliveryInfoVO.isCompleted ? 'success' : 'danger'" size="small">
          {{ row.deliveryInfoVO.isCompleted ? '已完成' : '未完成' }}
        </el-tag>
      </template>
    </el-table-column>

    <el-table-column label="客户" prop="customerInfoVO.customerName" />
    <el-table-column label="联系方式" prop="customerInfoVO.phoneNumber" />
    <el-table-column label="商品">
      <template #default="{ row }">
        <div style="width: 100%;">
          <!-- 使用v-for遍历订单中的商品列表，为每个商品生成一个el-tag -->
          <el-tooltip v-for="(item, index) in row.orderItemVOList" :key="index" :content="item.productBasicInfoVO.productName" placement="top" :popper-class="{'custom-el-tag': true}">
            <el-tag :key="index" :size="'medium'" class="custom-el-tag" :style="{ maxWidth: '20ch', whiteSpace: 'normal', wordWrap: 'break-word' }">
              <!-- 这里只显示item的键 -->
              {{ item.productBasicInfoVO.productName.slice(-10) }}
            </el-tag>
          </el-tooltip>
        </div>
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
  <el-dialog v-model="showDetailsDialog" title="订单详情" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="selectedProduct" label-width="100px">
      <!-- 订单基本信息模块
        <div class="section-title">
          <el-tag type="info" class="module-tag">订单基本信息</el-tag>
        </div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="订单ID" prop="orderId">
              <el-input v-model="addForm.orderId" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订单状态" prop="orderStatus">
              <el-radio-group v-model="addForm.orderStatus">
                <el-radio :label="true">完成</el-radio>
                <el-radio :label="false">未完成</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row> -->
      <!-- 顾客信息模块 -->
      <div class="section-title">
        <el-tag type="info" class="module-tag">顾客信息</el-tag>
      </div>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="顾客姓名" prop="customerInfoVO.customerName">
            <el-input v-model="selectedProduct.customerInfoVO.customerName" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="顾客电话" prop="customerInfoVO.phoneNumber">
            <el-input v-model="selectedProduct.customerInfoVO.phoneNumber" readonly />
          </el-form-item>

        </el-col>

      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="顾客地址" prop="customerInfoVO.shippingAddress">
            <el-input v-model="selectedProduct.customerInfoVO.shippingAddress" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">

          <el-form-item label="顾客ID" prop="customerInfoVO.customerId" v-show="false">
            <el-input v-model="selectedProduct.customerInfoVO.customerId" readonly />
          </el-form-item>
        </el-col>

      </el-row>

      <!-- 交收信息模块 -->
      <div class="section-title">
        <el-tag type="info" class="module-tag">交收信息</el-tag>
      </div>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="交收方式" prop="deliveryInfoVO.deliveryMethod">
            <el-select v-model="selectedProduct.deliveryInfoVO.deliveryMethod" placeholder="选择交收方式" disabled>
              <el-option label="顺丰（寄付）" value="sender_pays" />
              <el-option label="顺丰（到付）" value="receiver_pays" />
              <el-option label="快递柜" value="express_locker" />
              <el-option label="线下交付" value="offline_delivery" />
              <el-option label="待定" value="undetermined" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="交收地址" prop="deliveryInfoVO.deliveryAddress">
            <el-input v-model="selectedProduct.deliveryInfoVO.deliveryAddress" readonly />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="交收日期" prop="deliveryInfoVO.deliveryDate">
            <el-input v-model="selectedProduct.deliveryInfoVO.deliveryDate" type="datetime-local" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="交收人" prop="deliveryInfoVO.deliveryPerson">
            <el-input v-model="selectedProduct.deliveryInfoVO.deliveryPerson" readonly />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 新增交收人字段 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="备注" prop="deliveryInfoVO.description">
            <el-input v-model="editForm.deliveryInfoVO.description" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="交收状态" prop="deliveryInfoVO.isCompleted">
            <el-radio-group v-model="selectedProduct.deliveryInfoVO.isCompleted" disabled>
              <el-radio :label="true">完成</el-radio>
              <el-radio :label="false">未完成</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 支付信息模块 -->
      <div class="section-title">
        <el-tag type="info" class="module-tag">支付信息</el-tag>
      </div>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="支付方式" prop="paymentInfoVO.paymentMethod">
            <el-select v-model="selectedProduct.paymentInfoVO.paymentMethod" placeholder="选择支付方式" disabled>
              <el-option label="Payme" value="Payme" />
              <el-option label="Alipay" value="Alipay" />
              <el-option label="FPS" value="FPS" />
              <el-option label="Wechat" value="Wechat" />
              <el-option label="Cash" value="Cash" />
              <el-option label="Bank" value="Bank" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="应付金额" prop="paymentInfoVO.amountDue">
            <el-input v-model="selectedProduct.paymentInfoVO.amountDue" readonly />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="已付金额" prop="paymentInfoVO.amountPaid">
            <el-input v-model="addForm.paymentInfoVO.amountPaid" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="支付日期" prop="paymentInfoVO.paymentDate">
            <el-input v-model="selectedProduct.paymentInfoVO.paymentDate" type="datetime-local" readonly />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="支付状态" prop="paymentInfoVO.isCompleted">
            <el-radio-group v-model="selectedProduct.paymentInfoVO.isCompleted" disabled>
              <el-radio :label="true">已付</el-radio>
              <el-radio :label="false">未付</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 订单商品列表模块 -->
      <div>
        <div class="section-title">
          <el-tag type="info" class="module-tag">订单商品</el-tag>
        </div>

        <div v-for="(item, index) in selectedProduct.orderItemVOList" :key="index">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="'商品ID'">
                <el-input v-model="item.productBasicInfoVO.productId" readonly />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item :label="'商品名称'">
                <el-select v-model="item.productBasicInfoVO.productName" filterable remote remote-method="searchProducts" :loading="loading" placeholder="请选择商品名称" @change="onProductSelect(item, index)" disabled>
                  <el-option v-for="product in productList" :key="product.productId" :label="product.productName" :value="product.productName" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="商品数量">
                <el-input v-model="item.orderItemQuantity" readonly />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="商品库存">
                <el-input v-model="item.productBasicInfoVO.productStock" readonly />
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider border-style="dashed" />
        </div>
      </div>
    </el-form>
    <el-button type="primary" @click="showDetailsDialog = false">关闭</el-button>
  </el-dialog>

  <!-- 编辑弹窗 -->
  <el-dialog v-model="showEditDialog" title="编辑订单" @close="handleCloseEdit" :width="'80%'">
    <el-scrollbar>
      <el-form :model="editForm" ref="editFormRef" :rules="addRules" label-width="auto">
        <!-- 顾客信息模块 -->
        <div class="section-title">
          <el-tag type="info" class="module-tag">顾客信息</el-tag>
        </div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="顾客姓名" prop="customerInfoVO.customerName">
              <el-input v-model="editForm.customerInfoVO.customerName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="顾客电话" prop="customerInfoVO.phoneNumber">
              <el-input v-model="editForm.customerInfoVO.phoneNumber" />
            </el-form-item>

          </el-col>

        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="顾客地址" prop="customerInfoVO.shippingAddress">
              <el-input v-model="editForm.customerInfoVO.shippingAddress" />
            </el-form-item>
          </el-col>
          <el-col :span="12">

            <el-form-item label="顾客ID" prop="customerInfoVO.customerId" v-show="false">
              <el-input v-model="editForm.customerInfoVO.customerId" />
            </el-form-item>
          </el-col>

        </el-row>

        <!-- 交收信息模块 -->
        <div class="section-title">
          <el-tag type="info" class="module-tag">交收信息</el-tag>
        </div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="交收方式" prop="deliveryInfoVO.deliveryMethod">
              <el-select v-model="editForm.deliveryInfoVO.deliveryMethod" placeholder="选择交收方式">
                <el-option label="顺丰（寄付）" value="sender_pays" />
                <el-option label="顺丰（到付）" value="receiver_pays" />
                <el-option label="快递柜" value="express_locker" />
                <el-option label="线下交付" value="offline_delivery" />
                <el-option label="待定" value="undetermined" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="交收地址" prop="deliveryInfoVO.deliveryAddress">
              <el-input v-model="editForm.deliveryInfoVO.deliveryAddress" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="交收日期" prop="deliveryInfoVO.deliveryDate">
              <el-input v-model="editForm.deliveryInfoVO.deliveryDate" type="datetime-local" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="交收人" prop="deliveryInfoVO.deliveryPerson">
              <el-input v-model="editForm.deliveryInfoVO.deliveryPerson" />
            </el-form-item>

          </el-col>
        </el-row>
        <!-- 新增交收人字段 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="备注" prop="deliveryInfoVO.description">
              <el-input v-model="editForm.deliveryInfoVO.description" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="交收状态" prop="deliveryInfoVO.isCompleted">
              <el-radio-group v-model="editForm.deliveryInfoVO.isCompleted">
                <el-radio :label="true">完成</el-radio>
                <el-radio :label="false">未完成</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 支付信息模块 -->
        <div class="section-title">
          <el-tag type="info" class="module-tag">支付信息</el-tag>
        </div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="支付方式" prop="paymentInfoVO.paymentMethod">
              <el-select v-model="editForm.paymentInfoVO.paymentMethod" placeholder="选择支付方式">
                <el-option label="Payme" value="Payme" />
                <el-option label="Alipay" value="Alipay" />
                <el-option label="FPS" value="FPS" />
                <el-option label="Wechat" value="Wechat" />
                <el-option label="Cash" value="Cash" />
                <el-option label="Bank" value="Bank" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="应付金额" prop="paymentInfoVO.amountDue">
              <el-input v-model="editForm.paymentInfoVO.amountDue" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="已付金额" prop="paymentInfoVO.amountPaid">
              <el-input v-model="editForm.paymentInfoVO.amountPaid" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="支付日期" prop="paymentInfoVO.paymentDate">
              <el-input v-model="editForm.paymentInfoVO.paymentDate" type="datetime-local" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="支付状态" prop="paymentInfoVO.isCompleted">
              <el-radio-group v-model="editForm.paymentInfoVO.isCompleted">
                <el-radio :label="true">已付</el-radio>
                <el-radio :label="false">未付</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 订单商品列表模块 -->
        <div>
          <div class="section-title">
            <el-tag type="info" class="module-tag">订单商品</el-tag>
          </div>

          <div v-for="(item, index) in editForm.orderItemVOList" :key="index">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="'商品ID'">
                  <el-input v-model="item.productBasicInfoVO.productId" readonly />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item :label="'商品名称'">
                  <el-select v-model="item.productBasicInfoVO.productName" filterable remote remote-method="searchProducts" :loading="loading" placeholder="请选择商品名称" @change="onProductSelect(item, index)">
                    <el-option v-for="product in productList" :key="product.productId" :label="product.productName" :value="product.productName" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="商品数量">
                  <el-input v-model="item.orderItemQuantity" />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="商品库存">
                  <el-input v-model="item.productBasicInfoVO.productStock" readonly />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row v-if="item.orderItemQuantity > item.productBasicInfoVO.productStock" :gutter="20">
              <el-col :span="24">
                <el-tag type="danger" class="warning-tag">数量超出库存！</el-tag>
              </el-col>
            </el-row>

            <!-- 删除和新增按钮在同一行，调整按钮间距 -->
            <el-row justify="space-between" style="margin-top: 10px; margin-bottom: 20px;">
              <!-- 删除按钮 -->
              <el-col :span="11">
                <el-button @click="removeEditOrderItem(index)" type="danger" style="width: 20%;">
                  <el-icon>
                    <RemoveFilled />
                  </el-icon> 删除条目
                </el-button>
              </el-col>

              <!-- 新增按钮 -->
              <el-col :span="11">
                <el-button @click="editOrderItem" type="primary" style="width: 20%;">
                  <el-icon>
                    <CirclePlusFilled />
                  </el-icon> 增加条目
                </el-button>
              </el-col>
            </el-row>
          </div>
        </div>
        <!-- 操作按钮 -->
        <el-form-item>
          <el-button style="margin-left: 40%;" type="primary" @click="onEditSubmit">保存</el-button>
          <el-button @click="handleCloseEdit">取消</el-button>
        </el-form-item>
      </el-form>
    </el-scrollbar>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import AddButton from '../components/AddButton/index.vue';
import { Delete as DeleteIcon, Edit as EditIcon } from '@element-plus/icons-vue';
import axios from 'axios';
import { getOrderPageList, addOrder, getOrder, editOrder, delOrder } from "@/api/orderInfo.js";
import { getProductIdAndNameList } from "@/api/productInfo.js";
// 分页
const search = ref('');
const currentPage4 = ref(1);
const pageSize4 = ref(5);
const totalData = ref(0);
const addFormRef = ref(null);
const editFormRef = ref(null);
// 全量数据
const fullData = ref([]);

let showAddDialog = ref(false);
let showEditDialog = ref(false);
let showDetailsDialog = ref(false);
const productList = ref([]);  // 存储商品信息
const loading = ref(false);    // 加载状态
// 获取商品列表
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
    const res = await getOrderPageList(params);
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

const fetchProductList = async () => {
  loading.value = true;
  try {
    const response = await getProductIdAndNameList(); // 调用后端接口
    productList.value = response.data;  // 假设返回数据中包含商品信息
  } catch (error) {
    console.error("获取商品列表失败", error);
  } finally {
    loading.value = false;
  }
};

// 根据选择的商品名称填充其他字段
const onProductSelect = (item, index) => {
  const selectedProduct01 = productList.value.find(product => product.productName === item.productBasicInfoVO.productName);
  if (selectedProduct01) {
    item.productBasicInfoVO.productId = selectedProduct01.productId;
    item.productBasicInfoVO.productStock = selectedProduct01.productStock;
    item.productBasicInfoVO.productCategory = selectedProduct01.productCategory;
    item.productBasicInfoVO.productUnitPrice = selectedProduct01.unitPrice;
  }
};

// 初始化时获取商品列表
onMounted(() => {
  fetchProductList();
});
// 新增结构体
const addForm = ref({
  orderId: '',
  customerInfoVO: {
    customerId: '',
    customerName: '',
    phoneNumber: '',
    shippingAddress: '',
  },
  deliveryInfoVO: {
    deliveryId: '',
    orderId: '',
    deliveryMethod: '',
    deliveryAddress: '',
    deliveryPerson: '',
    description: '',
    deliveryDate: null,
    isCompleted: false,
  },
  paymentInfoVO: {
    paymentId: '',
    orderId: '',
    paymentMethod: '',
    amountDue: 0,
    amountPaid: 0,
    paymentDate: null,
    isCompleted: false,
  },
  orderItemVOList: [{
    orderItemId: '',
    orderId: '',
    productBasicInfoVO: {
      productId: '',
      productName: '',
      productCategory: '',
      region: '',
      productUnitPrice: 0,
      productStock: 1,
      description: '',
    },
    orderItemQuantity: 1,
    orderItemTotalPrice: 0,
  },],
  orderStatus: '',
  orderCreatedTime: null,
});
// 删除商品
const removeOrderItem = (index) => {
  // 使用 splice 删除指定索引的商品
  if (addForm.value.orderItemVOList.length > 1) {
    addForm.value.orderItemVOList.splice(index, 1);
  }
};
const addOrderItem = () => {
  addForm.value.orderItemVOList.push({
    orderItemId: '',
    orderId: '',
    productBasicInfoVO: {
      productId: '',
      productName: '',
      productCategory: '',
      region: '',
      productUnitPrice: 0,
      productStock: 1,
      description: '',
    },
    orderItemQuantity: 1,
    orderItemTotalPrice: 0,
  });
};
const addEditOrderItem = () => {
  editForm.value.orderItemVOList.push({
    orderItemId: '',
    orderId: '',
    productBasicInfoVO: {
      productId: '',
      productName: '',
      productCategory: '',
      region: '',
      productUnitPrice: 0,
      productStock: 1,
      description: '',
    },
    orderItemQuantity: 1,
    orderItemTotalPrice: 0,
  });
};
const selectedProduct = ref({
  orderId: '',
  customerInfoVO: {
    customerId: '',
    customerName: '',
    phoneNumber: '',
    shippingAddress: '',
  },
  deliveryInfoVO: {
    deliveryId: '',
    orderId: '',
    deliveryMethod: '',
    deliveryAddress: '',
    deliveryPerson: '',
    description: '',
    deliveryDate: null,
    isCompleted: false,
  },
  paymentInfoVO: {
    paymentId: '',
    orderId: '',
    paymentMethod: '',
    amountDue: 0,
    amountPaid: 0,
    paymentDate: null,
    isCompleted: false,
  },
  orderItemVOList: [],
  orderStatus: '',
  orderCreatedTime: null,
});

const editForm = ref({
  orderId: '',
  customerInfoVO: {
    customerId: '',
    customerName: '',
    phoneNumber: '',
    shippingAddress: '',
  },
  deliveryInfoVO: {
    deliveryId: '',
    orderId: '',
    deliveryMethod: '',
    deliveryAddress: '',
    deliveryPerson: '',
    description: '',
    deliveryDate: null,
    isCompleted: false,
  },
  paymentInfoVO: {
    paymentId: '',
    orderId: '',
    paymentMethod: '',
    amountDue: 0,
    amountPaid: 0,
    paymentDate: null,
    isCompleted: false,
  },
  orderItemVOList: [],
  orderStatus: '',
  orderCreatedTime: null,
});
// 删除商品
const removeEditOrderItem = (index) => {
  // 使用 splice 删除指定索引的商品
  if (editForm.value.orderItemVOList.length > 1) {
    editForm.value.orderItemVOList.splice(index, 1);
  }
};
const editOrderItem = () => {
  editForm.value.orderItemVOList.push({
    orderItemId: '',
    orderId: '',
    productBasicInfoVO: {
      productId: '',
      productName: '',
      productCategory: '',
      region: '',
      productUnitPrice: 0,
      productStock: 1,
      description: '',
    },
    orderItemQuantity: 1,
    orderItemTotalPrice: 0,
  });
};
// 支付方式映射函数
const paymentMethodMap = {
  Alipay: 'Alipay',
  Wechat: 'Wechat',
  Bank: 'Bank',
  Cash: 'Cash',
  Payme: 'Payme',
  FPS: 'FPS'
};

const mapPaymentMethod = (method) => {
  return paymentMethodMap[method] || method;
};

// 支付状态映射函数
const paymentStatusMap = {
  true: '已付',
  false: '未付'
};

const mapPaymentStatus = (status) => {
  return paymentStatusMap[status] === undefined ? status : paymentStatusMap[status];
};

// 交付方式映射函数
const deliveryMethodMap = {
  sender_pays: "顺丰（寄付）",
  receiver_pays: "顺丰（到付）",
  express_locker: "快递柜",
  offline_delivery: "线下交付",
  undetermined: "待定"
}

const mapDeliveryMethod = (method) => {
  return deliveryMethodMap[method] || method;
};

// 交付状态映射函数
const deliveryStatusMap = {
  true: '已完成',
  false: '未完成'
};

const mapDeliveryStatus = (status) => {
  return deliveryStatusMap[status] === undefined ? status : deliveryStatusMap[status];
};

// 新增规则
const addRules = {
  // 顾客信息模块
  'customerInfoVO.customerName': [
    { required: true, message: '顾客姓名不能为空', trigger: 'blur' }
  ],
  'customerInfoVO.phoneNumber': [
    { required: true, message: '顾客电话不能为空', trigger: 'blur' },
  ],
  'customerInfoVO.shippingAddress': [
    { required: true, message: '顾客地址不能为空', trigger: 'blur' }
  ],

  // 交收信息模块
  'deliveryInfoVO.deliveryMethod': [
    { required: true, message: '请选择交收方式', trigger: 'change' }
  ],
  'deliveryInfoVO.deliveryAddress': [
    { required: true, message: '交收地址不能为空', trigger: 'blur' }
  ],
  'deliveryInfoVO.deliveryDate': [
    { required: true, message: '交收日期不能为空', trigger: 'change' }
  ],
  'deliveryInfoVO.deliveryPerson': [
    { required: true, message: '交收人不能为空', trigger: 'blur' }
  ],
  'deliveryInfoVO.description': [
    { max: 500, message: '备注最多输入500个字符', trigger: 'blur' }
  ],
  'deliveryInfoVO.isCompleted': [
    { required: true, message: '请选择交收状态', trigger: 'change' }
  ],

  // 支付信息模块
  'paymentInfoVO.paymentMethod': [
    { required: true, message: '请选择支付方式', trigger: 'change' }
  ],
  'paymentInfoVO.amountDue': [
    { required: true, message: '应付金额不能为空', trigger: 'blur' },

  ],
  'paymentInfoVO.amountPaid': [
    { required: true, message: '已付金额不能为空', trigger: 'blur' },

  ],
  'paymentInfoVO.paymentDate': [
    { required: true, message: '支付日期不能为空', trigger: 'change' }
  ],
  'paymentInfoVO.isCompleted': [
    { required: true, message: '请选择支付状态', trigger: 'change' }
  ],

  // 订单商品模块
  'orderItemVOList': [
    { required: true, message: '订单商品不能为空', trigger: 'blur' }
  ]
}


const getProductNames = (orderItemVOList) => {
  return orderItemVOList.map(item => item.productBasicInfoVO.productName).join(', ');
};

const tableKey = ref(0);

const onSubmit = () => {
  addFormRef.value.validate(async (valid) => {
    if (valid) {
      addOrder(addForm.value).then(res => {
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

// 提交编辑表单
const onEditSubmit = () => {
  editFormRef.value.validate(async (valid) => {
    if (valid) {
      editOrder(editForm.value).then(res => {
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
// 创建取消
const handleClose = () => {
  showAddDialog.value = false;
  addForm.value = {
    orderId: '',
    customerInfoVO: {
      customerId: '',
      customerName: '',
      phoneNumber: '',
      shippingAddress: '',
    },
    deliveryInfoVO: {
      deliveryId: '',
      orderId: '',
      deliveryMethod: '',
      deliveryAddress: '',
      deliveryPerson: '',
      description: '',
      deliveryDate: null,
      isCompleted: false,
    },
    paymentInfoVO: {
      paymentId: '',
      orderId: '',
      paymentMethod: '',
      amountDue: 0,
      amountPaid: 0,
      paymentDate: null,
      isCompleted: false,
    },
    orderItemVOList: [{
      orderItemId: '',
      orderId: '',
      productBasicInfoVO: {
        productId: '',
        productName: '',
        productCategory: '',
        region: '',
        productUnitPrice: 0,
        productStock: '',
        description: '',
      },
      orderItemQuantity: 1,
      orderItemTotalPrice: 0,
    }],
    orderStatus: '',
    orderCreatedTime: null,
  }; // 手动重置表单内容
  addFormRef.value.resetFields(); // 清除表单验证状态
};
// 创建取消
const handleCloseEdit = () => {
  showEditDialog.value = false;
  editFormRef.value.resetFields();
  // 清空选中的顾客
};


// 编辑按钮点击事件
const handleEdit = (index, row) => {
  console.log(row);
  // 先检查传入的 product 是否有 id
  if (!row || !row.orderId) {
    ElMessage.error('订单ID无效');
    return;
  }

  getOrder(row.orderId).then(res => {
    if (res.status === 'success') {  // 修改为检查 res.status
      editForm.value = {
        ...res.data,  // 将详细数据赋给 selectedProduct
      };
      showEditDialog.value = true; // 显示详情弹窗
    } else {
      ElMessage.error(`获取订单详情失败: ${res.message || '未知错误'}`);
      console.error('获取订单详情失败', res);
    }
  }).catch(error => {
    // 捕获网络错误或其他异常
    ElMessage.error(`获取订单详情时发生错误: ${error.message}`);
    console.error('获取订单详情时发生错误', error);
  });


};

const handleDelete = (index, row) => {
  ElMessageBox.confirm('此操作将永久删除该订单, 是否继续?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    console.log(row.orderId);

    delOrder(row.orderId).then(res => {
      if (res.status === 'success') {
        ElMessage.success('订单删除成功');
        fullData.value.splice(index, 1); // Remove product from list
        fetchData();
      } else {
        ElMessage.error(`删除失败: ${res.message || '未知错误'}`); // 提示后端返回的 message
      }
    }).catch(error => {
      ElMessage.error(`请求失败: ${error.message || '未知错误'}`); // 捕获网络错误
    });
  });
};


const showDetails = (order) => {
  // 先检查传入的 product 是否有 id
  if (!order || !order.orderId) {
    ElMessage.error('订单ID无效');
    return;
  }

  getOrder(order.orderId).then(res => {
    if (res.status === 'success') {  // 修改为检查 res.status
      selectedProduct.value = {
        ...res.data,  // 将详细数据赋给 selectedProduct
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

</script>

<style scoped>
.module-tag {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
}
.custom-el-tag {
  maxwidth: "20ch";
  whitespace: "normal";
  wordwrap: "break-word";
}
.section-title {
  position: relative;
  margin-bottom: 10px;
}

.el-row {
  margin-bottom: 20px;
}

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
.warning-tag {
  font-size: 14px;
  font-weight: bold;
  color: red;
  margin-top: 10px;
}

.el-input[readonly] {
  background-color: #f2f2f2;
}
</style>
