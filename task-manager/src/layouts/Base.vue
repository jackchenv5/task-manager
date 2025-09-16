<template>
  <div class="main-layout">
    <!-- 固定头部 -->
    <div class="head">
      <el-row>
        <el-col :span="20">
          <el-header class="nav-container">
          <template v-for="item in navStore.navItems">
            <router-link  v-if="hasPerm(item)" :key="item.path" :to="item.path" class="router-link"
              :class="{ active: $route.path.startsWith(item.path) }">
              {{ item.title }}
            </router-link>
          </template>
          </el-header>
        </el-col>
        <el-col :span="4">
          <div class="user-info-container">
            <el-dropdown trigger="click" placement="bottom-end">
              <div class="user-info">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="#052360" d="M12 1.25C6.063 1.25 1.25 6.063 1.25 12S6.063 22.75 12 22.75S22.75 17.937 22.75 12S17.937 1.25 12 1.25M2.75 12a9.25 9.25 0 1 1 16.282 6.01a4.84 4.84 0 0 0-1.17-2.034c-.782-.813-1.76-1.286-2.608-1.55c-.626-.195-1.216.03-1.604.293c-.36.242-.94.531-1.65.531s-1.29-.29-1.65-.531c-.388-.262-.978-.488-1.604-.293c-.849.264-1.826.737-2.608 1.55a4.84 4.84 0 0 0-1.17 2.033A9.2 9.2 0 0 1 2.75 12m3.513 7.256c.076-1.011.46-1.724.957-2.241c.553-.576 1.28-.941 1.972-1.157a.2.2 0 0 1 .103.003a.7.7 0 0 1 .216.101c.501.338 1.374.788 2.489.788s1.988-.45 2.489-.788a.7.7 0 0 1 .216-.1a.2.2 0 0 1 .103-.004c.692.216 1.419.581 1.972 1.157c.497.517.88 1.23.957 2.241A9.2 9.2 0 0 1 12 21.25a9.2 9.2 0 0 1-5.737-1.994M9.75 10c0-1.25.97-2.25 2.25-2.25s2.25 1 2.25 2.25s-.97 2.25-2.25 2.25s-2.25-1-2.25-2.25M12 6.25A3.72 3.72 0 0 0 8.25 10A3.72 3.72 0 0 0 12 13.75A3.72 3.72 0 0 0 15.75 10A3.72 3.72 0 0 0 12 6.25"/></svg>
                <div class="user-details">
                  <span class="username">{{ loginUser.username }}</span>
                  <span class="role">{{ loginUser.role_name }}  {{ loginUser.group_name ? `|${loginUser.group_name}` : ''}}</span>
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
import {ElRow,ElCol,ElIcon,ElDropdownItem,ElDropdown} from "element-plus";
import { ref } from 'vue'
import { useNavStore } from '@/stores/nav'
const navStore = useNavStore()
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import {getUserGroupApi} from "@/api/data/data.js";
const userStore = useUserStore()
const { loginUser } = storeToRefs(userStore)
// 登陆信息

const hasPerm = (router) => {
  return loginUser.value.perm[router.name]
}
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
