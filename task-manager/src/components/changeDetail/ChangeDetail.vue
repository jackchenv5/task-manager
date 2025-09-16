<template>
  <div class="field-changes-container">
    <el-card shadow="hover" v-if="hasChanges">
      <template #header>
        <div class="card-header">
          <span>字段变更记录</span>
          <el-tag type="warning" size="small">{{ changeCount }} 处变更</el-tag>
        </div>
      </template>

      <el-table :data="filteredChanges" size="small" border>
        <el-table-column prop="field" label="字段" width="180">
          <template #default="{ row }">
            <span class="field-name">{{ formatFieldName(row.field) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="oldValue" label="原值">
          <template #default="{ row }">
            <div class="value-cell old-value">
              <pre>{{ formatValue(row.oldValue) }}</pre>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="→" width="50" align="center">
          <template #default>
            <el-icon><ArrowRight /></el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="newValue" label="新值">
          <template #default="{ row }">
            <div class="value-cell new-value">
              <pre>{{ formatValue(row.newValue) }}</pre>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-empty description="无字段变更" v-else />
  </div>
</template>

<script setup>
import {ElTable,ElCard,ElTableColumn,ElTag,ElIcon} from 'element-plus'
import { computed } from 'vue';
import { ArrowRight } from '@element-plus/icons-vue';

const props = defineProps({
  changedFields: {
    type: [String, Object],
    required: true
  }
});

// 判断值是否为空或未定义
const isEmptyValue = (value) => {
  return value === null ||
      value === undefined ||
      (typeof value === 'string' && value.trim() === '') ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'object' && Object.keys(value).length === 0);
};

// 解析变更字段并过滤无效变更
const filteredChanges = computed(() => {
  try {
    const changes = typeof props.changedFields === 'string' ? JSON.parse(props.changedFields) : props.changedFields;
    if(changes.comment){
      return [{field:'comment',oldValue:'',newValue:changes.comment},{field:'score',oldValue:'',newValue:changes.score}]
    }
    return Object.entries(changes)
        .map(([field, values]) => ({
          field,
          oldValue: values?.old,
          newValue: values?.new
        }))
        .filter(item => {
          // 过滤掉新旧值都为空的情况
          return !(isEmptyValue(item.oldValue) && isEmptyValue(item.newValue));
        });
  } catch (e) {
    console.error('解析变更字段失败:', e);
    return [];
  }
});
// 是否有变更
const hasChanges = computed(() => filteredChanges.value.length > 0);

// 变更数量
const changeCount = computed(() => filteredChanges.value.length);

// 格式化字段名称（可根据需要自定义）
const formatFieldName = (field) => {
  const fieldNames = {
    'name':'任务名',
    'project':'项目名',
    'username': '用户名',
    'start_time': '开始时间',
    'deadline_time': '截止时间',
    'content': '任务内容',
    'status': '状态',
    'feedback': '任务反馈',
    'feedback_time': '反馈时间',
    'workload': '工作量',
    'act_workload': '实际工作量',
    'progress': '进度',
    'receiver': '执行人',
    // 添加更多字段映射...
  };
  return fieldNames[field] || field;
};

// 格式化字段值（可根据需要自定义）
const formatValue = (value) => {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'boolean') return value ? '是' : '否';
  return value;
};
</script>

<style scoped>
.field-changes-container {
  margin: 20px 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.field-name {
  font-weight: 500;
  color: var(--el-color-primary);
}

.value-cell {
  padding: 5px;
  border-radius: 4px;
  overflow-x: auto;
}

.old-value {
  background-color: var(--el-color-danger-light-9);
  /*text-decoration: line-through;*/
  color: var(--el-color-danger);
}

.new-value {
  background-color: var(--el-color-success-light-9);
  color: darkblue;
}

:deep(.el-table .cell) {
  word-break: break-word;
}
</style>