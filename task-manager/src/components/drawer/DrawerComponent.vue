<template>
    <el-drawer 
      v-model="visible" 
      :direction="direction" 
      :title="title"
      :size="size"
      :before-close="handleBeforeClose"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
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
  import { ref, watch } from 'vue'
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
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
      default: '30%'
    },
    cancelText: {
      type: String,
      default: 'Cancel'
    },
    confirmText: {
      type: String,
      default: 'Confirm'
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
    console.log('visible',visible,newVal)
    emit('update:modelValue', newVal)
    console.log('visible END')
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
  </script>