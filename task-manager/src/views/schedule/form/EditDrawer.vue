<template>
  <el-drawer 
    v-model="visible" 
    :direction="direction" 
    :title="title"
    :size="size"
    :disabled="disabled"
    :before-close="handleBeforeClose"
  >
<slot></slot>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="handleCancel">{{ cancelText }}</el-button>
        <el-button type="primary" @click="handleConfirm">{{ confirmText }}</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>

import { ref,watch} from 'vue'
// ====================组件属性代码 ============================================
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: true
  },
  direction: {
    type: String,
    default: 'ltr',
    validator: (value) => ['ltr', 'rtl', 'ttb', 'btt'].includes(value)
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: [String, Number],
    default: '35%'
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  confirmText: {
    type: String,
    default: '确认'
  },
  beforeClose: {
    type: Function,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel', 'close'])

const visible = ref(props.modelValue)
// 监听外部modelValue变化
watch(() => props.modelValue, (newVal) => {
  visible.value = newVal
})

// 监听内部visible变化
watch(visible, (newVal) => {
  emit('update:modelValue', newVal)
})

const handleBeforeClose = (done) => {
  if (props.beforeClose) {
    props.beforeClose(done)
  } else {
    done()
  }
  emit('close')
}

const handleConfirm = () => {
  emit('confirm')
  visible.value = false
}

const handleCancel = () => {
  emit('cancel')
  visible.value = false
}
// ====================组件属性代码 END============================================

</script>