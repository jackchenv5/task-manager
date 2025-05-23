<template>
      <div class="header">
        <div class="group-info">
          <el-avatar :size="50" fit="full" style="font-size: 1.2rem;background-color: rgb(16, 136, 116);" shape="square">陈</el-avatar>
          <div style="display: flex;flex-direction:column;justify-content: space-around">
            <div style="font-size: 1.125rem;font-weight: 500;color: black;"> 陈成</div>
            <div style="color:#00000073">最近很忙</div>
          </div>

        </div>
        <div style="display:flex;width: 30vw;justify-content: space-around;">
          <div class="group-info-item">
            <div class="group-info-item-title">任务</div>
            <div class="group-info-item-content">20/50</div>
          </div>
          <div class="group-info-item">
            <div class="group-info-item-title">工作量</div>
            <div class="group-info-item-content">20人</div>
          </div>
          <div class="group-info-item">
            <div class="group-info-item-title">饱和度</div>
            <div class="group-info-item-content">20人</div>
          </div>
          <div class="group-info-item">
            <div class="group-info-item-title">项目</div>
            <div class="group-info-item-content">20个</div>
          </div>
          <div class="group-info-item">
            <div class="group-info-item-title">待办</div>
            <div class="group-info-item-content">12/20</div>
          </div>
        </div>
      </div>

</template>


<script setup>

</script>


<style scoped>

.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* border: 1px solid #fafcff; */
  border-left:2px solid black;
  height: 10vh;
  background-color: white;
  color: rgba(0, 0, 0, 0.88);
  font-size: 14px;
  line-height: 1.5714285714285714;
  list-style: none;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
}


.group-info {
  width: 10vw;
  display: flex;
  height: 5vh;
  align-items: center;
  justify-content: space-around;
}

.group-info-item{
  display: flex;
  flex-direction: column;
  height: 5vh;
  justify-content: space-between;
  align-items: center;
}
.group-info-item-title{ 
  font-size: 0.8rem;
  color: #00000073;
}
.group-info-item-content{ 
  font-size: 1.2rem;
  color: black;
}
</style>