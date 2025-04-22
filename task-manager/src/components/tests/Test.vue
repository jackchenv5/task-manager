<!-- MyButton.vue -->
<template>
    <button 
      :class="['my-button', type]"
      @click="$emit('click')"
    >
      <slot></slot>
    </button>
  </template>
  
  <script setup>
  defineProps({
    type: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary'].includes(value)
    }
  })
  
  defineEmits(['click'])
  </script>
  
  <style scoped>
  .my-button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin: 4px;
  }
  
  .primary {
    background-color: #2196f3;
    color: white;
  }
  
  .secondary {
    background-color: #e0e0e0;
    color: #333;
  }
  </style>