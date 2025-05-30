<template>
  <div class="main-layout">
    <!-- 固定头部 -->
    <div class="head">
      <el-row>
        <el-col :span="20">
          <el-header class="nav-container">
            <router-link v-for="item in navStore.navItems" :key="item.path" :to="item.path" class="router-link"
              :class="{ active: $route.path.startsWith(item.path) }">
              {{ item.title }}
            </router-link>
          </el-header>
        </el-col>
        <el-col :span="4">
          <div class="user-info-container">
            <el-dropdown trigger="click" placement="bottom-end">
              <div class="user-info">
                <el-avatar :size="36" :src="user.avatar" />
                <div class="user-details">
                  <span class="username">{{ loginUser.username }}</span>
                  <span class="role">{{ loginUser.role_name }} | {{ loginUser.group_name }}</span>
                </div>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleProfile">
                    <el-icon>
                      <User />
                    </el-icon> 个人中心
                  </el-dropdown-item>
                  <el-dropdown-item @click="handleSettings">
                    <el-icon>
                      <Setting />
                    </el-icon> 设置
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="handleLogout">
                    <el-icon>
                      <SwitchButton />
                    </el-icon> 退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-col>
      </el-row>
    </div>



    <!-- 动态内容区域 -->
    <div>
      <router-view v-slot="{ Component }">
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useNavStore } from '@/stores/nav'
const navStore = useNavStore()
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
const userStore = useUserStore()
const { loginUser } = storeToRefs(userStore)
// 登陆信息


const user = ref({
  name: loginUser.value.username,
  role: loginUser.value.role_name,
  avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
})

const handleProfile = () => {
  router.push('/profile')
}

const handleSettings = () => {
  router.push('/settings')
}

const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 实际项目中这里应该是调用退出登录的API
    ElMessage.success('退出成功')
    router.push('/login')
  }).catch(() => {
    // 用户取消退出
  })
}

</script>
<style>

/* 全局防护规则 */
/* * {
  box-sizing: border-box; 
} */


.main-layout{
  background-color: rgba(225, 227, 233, 0.829);
  width: 100%;
  margin: 0 auto;
}
.head {
  /* display: flex;
  justify-content: start; */
  border-bottom: 2px solid #d6dfdf;
  border-top: 1px solid #f5f9f9;
  background: #ffffff;
  width: 100%;
  height: 6vh;
}

.nav-container {
  display: flex;
  justify-content: start;
  width: 100vw;
  height: 6vh;
}

/* router link 相关 */
.router-link {
  font-size: 18px;
  margin-right: 20px;
  font-weight: bold;
  color: black;
  padding: 10px;
  text-decoration: none;
}

.router-link:hover {
  border-bottom: 2px solid #162c5e;
  color: rgb(124, 177, 238);
}

.active {
  color: white;
  background: black !important;
  border-bottom: 2px solid aliceblue;
}

.dhx_month_link {
  display: none !important;
}


/* 登陆信息css */


.user-info-container {
  height: 6vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.user-details {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  line-height: 1.2;
}

.username {
  font-weight: bold;
  font-size: 14px;
}

.role {
  font-size: 12px;
  color: #666;
}

.el-dropdown-menu__item {
  display: flex;
  align-items: center;
}

.el-icon {
  margin-right: 8px;
}
</style>
