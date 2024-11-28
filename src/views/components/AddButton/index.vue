<template>
  <el-button :type="type" :round="round" :style="{ display: 'flex', alignItems: 'center',fontSize: fonSize + 'px', justifyContent: 'center', ...buttonStyle }" @click="onClick">
    <el-icon :style="{ color: iconColor, marginRight: iconSpacing + 'px' }" :size="iconSize">
      <Plus />
    </el-icon>
    <span>{{ label }}</span>
  </el-button>
</template>

<script>
export default {
  name: 'AddButton',
  props: {
    label: {
      type: String,
      default: '新  增', // 默认按钮文字
    },

    type: {
      type: String,
      default: 'primary', // 默认按钮类型
    },
    round: {
      type: Boolean,
      default: true, // 是否为圆角按钮
    },
    iconColor: {
      type: String,
      default: 'white', // 图标颜色
    },
    iconSize: {
      type: Number,
      default: 20, // 图标大小
    },
    iconSpacing: {
      type: Number,
      default: 3, // 图标与文字间距
    },
    buttonStyle: {
      type: Object,
      default: () => ({}), // 自定义按钮样式
    },
    fonSize: {
      type: Number,
      default: 16, // 默认字体大小
    },
  },
  emits: ['click'],
  methods: {
    onClick (event) {
      this.$emit('click', event); // 触发点击事件
    },
  },
};
</script>
