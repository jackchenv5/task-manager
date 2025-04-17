<template>
  <div style="display: flex;height: 90vh;width: 100%;overflow: hidden;">
    <div class="left">
      <div style="display: flex;width: 100%;height: 20vh; justify-content: space-around;align-items: center;">
        <div
          style="height:18vh;width: 45%;background-color: white;;border: 1px solid white;border-radius: 5px;padding: 5px;display: flex;flex-direction: column;">
          <div style="height: 4vh;">
            <el-row>
              <el-col :span="4">
                <div style="margin-top:5px;color:white;background-color: black;border-radius: 5px;">人员池</div>
              </el-col>
              <el-col :span="10">
                <el-button>添加</el-button>
                <el-button>清空</el-button>
              </el-col>
              <el-col :span="10">
                添加到：
                <el-switch v-model="value" class="ml-2" inline-prompt
                  style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" active-text="执行人"
                  inactive-text="抄送人" />
              </el-col>
            </el-row>
            <div
              style="height: 14vh;display: flex;justify-content: start;flex-wrap: wrap;align-items: center;gap: 6px;">
              <el-tag v-for="tag in tags" :key="tag.name" closable :type="tag.type">
                {{ tag.name }}
              </el-tag>
            </div>
          </div>
        </div>
        <div
          style="height:18vh;width: 50%;background-color: white;border: 1px solid #eee;border-radius: 5px;padding: 5px;display: flex;flex-direction: column;">
          <div style="height: 4vh;">
            <el-row>
              <el-col :span="12">
                <div style="margin-top: 5px;color:white;background-color: black;border-radius: 5px;">项目池</div>
              </el-col>
              <el-col :span="8" :offset="3">
                <el-button>添加</el-button>
                <el-button>清空</el-button>
              </el-col>
            </el-row>
            <el-scrollbar style="height: 14vh;">
              <el-tag v-for="item in 20" :key="item" type="warning" style="width: 95%;margin-bottom: 3px;" closable>{{
                item }}</el-tag>
            </el-scrollbar>
          </div>
        </div>
      </div>
      <div style="height:5vh;width:100%;background-color: white;border: 1px solid #eee;margin: 4px 0;border-radius: 5px;padding: 5px;display: flex;justify-content: start;">
        <div style="background-color: rgb(31, 28, 28);border: 1px solid #eee;border-radius: 5px;padding: 5px;color: white;width: 5vw;">执行人员：</div>
        <el-scrollbar style="width: 35vw;">
          <div style="display: flex;width:fit-content;border: 1px solid rgb(14, 43, 66);border-radius: 5px;padding: 5px;margin-left: 8px;">
            <el-tag v-for="tag in tags" :key="tag.name" closable :type="tag.type" style="margin: 0px 5px;">
              {{ tag.name }}
            </el-tag>
          </div>
        </el-scrollbar>
        <el-button style="margin-left: 20px;">清空</el-button>
      </div>
      <div
        style="height:18vh;width: 98%;border: 1px solid #eee;background-color: white;border-radius: 5px;padding: 5px;display: flex;flex-direction: row;justify-content: space-between;">
        <div style="width: 25%;height:15vh;border:1px solid #f1f3f6;background-color: white;">
          <div style="font-weight:600;font-size:18px">当前用户</div>
          <div style="display:flex;justify-content: space-around;padding: 10px;">
           <div style="display:flex;flex-direction:column;justify-content: space-around;align-items: center;">
            <div>陈成F</div>
            <div>工作强度</div>
          </div>
           <div style="display:flex;flex-direction:column;justify-content: start;align-items: center;">
            <el-progress type="dashboard" :percentage="80" :stroke-width="15" :width="70" striped-flow />
           </div>
          </div>
          
        </div>
        <div style="width: 30%;height:15vh;border:1px solid #f1f3f6;background-color: white;">
          <div>详情：</div>
          <div>时间：2025-04-16~2025-04-24</div>
          <div>任务数：10 个</div>
          <div>任务工时：10 H</div>
          <div>饱和度：80% </div>
        </div>
        <div style="width: 45%;height:15vh;border:1px solid #f1f3f6;background-color: white;">
          <div>参与项目：</div>
          <el-scrollbar style="border:1px solid blue;height: 12vh;">
            <el-tag v-for="item in 20" :key="item" type="warning" style="width: 95%;margin-bottom: 3px;" closable>{{ item
            }}</el-tag>
          </el-scrollbar>
        </div>
      </div>
      <div ref="schedulerContainer" style="width: 100%;height:70vh;"></div>
    </div>
    <div class="right">
      <div style="width: 100%;height:60vh;border:1px solid black">
        <el-form>
          <el-row style="margin-top: 5px;">
            <el-col :span="12">
              <el-form-item label="名称:">
                <el-input></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="项目:">
                <el-input></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="执行人:">
                <el-input></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="抄送:">
                <el-input></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="时间范围:">
                <el-input></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="工作量:">
                <el-input></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-scrollbar style="height: 30vh;">
            <el-row>
              <el-col :span="12">
                <el-form-item label="任务内容:">
                  <el-input type="textarea" :rows="6"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="挑战目标:">
                  <el-input type="textarea" :rows="6"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="任务描述:">
              <el-input type="textarea"></el-input>
            </el-form-item>
          </el-scrollbar>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <el-button>清空</el-button>
          </el-form-item>

        </el-form>
      </div>
      <div style="width: 100%;height:38vh;border:1px solid black"></div>
    </div>
  </div>
</template>
 
<script setup>
import "dhtmlx-scheduler";
import { initSchedulerConfig } from '@/utils/scheduler'
import { onMounted, ref, watch, reactive } from 'vue';
import { Delete, Edit, Search, Share, Upload, Plus, Download } from '@element-plus/icons-vue'
// 定义 props
// 定义 props
const props = defineProps({
  events: {
    type: Array,
    default: () => [],
  },
});

// 获取容器引用
const schedulerContainer = ref(null);
var myEvents0 = [
];
onMounted(() => {
  // 确保 scheduler 对象存在
  if (scheduler) {

    // 初始化 Scheduler
    scheduler = initSchedulerConfig(schedulerContainer, scheduler)
    // 将数据加载到调度器
    scheduler.parse(myEvents0, "json");
    // 获取特定日期范围内的所有事件
    var fromDate = new Date(2025, 1, 12); // 注意：月份是从0开始计数的，即1表示二月
    var toDate = new Date(2025, 1, 15);
    var events = scheduler.getEvents(fromDate, toDate);
    console.log(events); // 输出事件列表

  } else {
    console.error('Scheduler is not properly imported.');
  }
});
const value = ref(true)
const tags = ref([
  { name: '张世伟', type: 'primary' },
  { name: '陈成F', type: 'success' },
  { name: '乔志', type: 'info' },
  { name: '王俊坤', type: 'warning' },
  { name: '乔志', type: 'danger' },
  { name: '张世伟', type: 'primary' },
  { name: '乔志', type: 'success' },
  { name: '陈成F', type: 'success' },


])
</script>

<style>
@import "dhtmlx-scheduler/codebase/dhtmlxscheduler.css";


/* 左侧和右侧 div 的样式 */
.left,
.right {
  flex: 1;
  /* 平均分配剩余空间 */
  display: flex;
  flex-direction: column;
  justify-content: start;
  /* 内容水平居中 */
  align-items: start;
  /* 内容垂直居中 */
  background-color: #f1f3f6;
}
/* 默认事件样式 */
.custom-event {
  border-radius: 3px;
  color: #333;
  font-size: 12px;
  padding: 2px;
  background: #a5dc86;
  width: 50%;
}

/* 根据进度设置背景色 */
.progress-0 {
  background-color: #f0f0f0;
}

.progress-25 {
  background-color: #ffcc99;
}

.progress-50 {
  background-color: #76c7c0;
}

.progress-75 {
  background-color: #f5d4f9;
}

.progress-100 {
  background-color: #a5dc86;
}

/* 默认日期单元格样式 */
.custom-date-cell {
  border-radius: 3px;
}

/* 根据日期设置背景色 */
.highlight-date-1 {
  background-color: #ffcc99;
}

/* 浅橙色 */
.highlight-date-2 {
  background-color: #76c7c0;
}

/* 浅蓝色 */
.highlight-date-3 {
  background-color: #a5dc86;
}

/* 浅绿色 */

.non_working_day {
  background-color: rgb(204, 152, 169) !important;
}
</style>