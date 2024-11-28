<template>
    <div class="table-front-end-pag">
      <slot name="table"></slot>
      <div class="el-pagination-box">
        <el-pagination
          :total="paginator.total"
          :current-page="paginator.currentPage"
          :page-size="paginator.pageSize"
          :page-sizes="paginator.pageSizes"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </template>
  
  
  <script setup>
    defineOptions({name: "TableFEP"})
    import { watch, reactive, defineProps } from 'vue';
    
    const props = defineProps({
      allTableData: {
        type: Array,
        required: true
      },
      pageSize: {
        type: Number,
        default: 15
      },
      pageSizes: {
        type: Array,
        default: () => [15, 30, 50, 100]
      }
    });
  
    // 列表全部数据
    watch(
      () => props.allTableData,
      (value) => {
        paginator.total = value.length
        setTableList(paginator.currentPage, paginator.pageSize)
      }
    )
  
    watch(
      () => props.pageSize,
      (value) => {
        paginator.pageSize = value
      }
    )
  
    watch(
      () => props.pageSizes,
      (value) => {
        paginator.pageSizes = value
      }
    )
  
    // 分页数据
    let paginator = reactive(
      {
        currentPage: 1,
        pageSize: props.pageSize,
        pageSizes: props.pageSizes,
        total: 0
      }
    )
  
  
    const emits = defineEmits(['updateTableData']);
    
    // 分页处理
    function setTableList( cur, size) {
      // 前端分页
      let tableData = props.allTableData.filter((item, index) => {
        return (index < (cur * size)) && (index >= ((cur - 1) * size))
      })
      emits('updateTableData', tableData)
    }
  
    function handleSizeChange(value) {
      paginator.pageSize = value
      setTableList(paginator.currentPage, paginator.pageSize)
    }
  
    function handleCurrentChange(value) {
      paginator.currentPage = value
      setTableList(paginator.currentPage, paginator.pageSize)
    }
  </script>
  
  
  <style scoped>
    .el-pagination-box {
      display: flex;
      align-items: flex-end;
      height: 50px;
    }
  </style>
  