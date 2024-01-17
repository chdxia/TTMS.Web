<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
  getUserPageList,
  createUser,
  updateUser,
  deleteUser
} from "@/api/user";
import { RoleType } from "@/enums/RoleType";

defineOptions({
  name: "UserManagement"
});

// 查询参数
const listQuery = ref({
  Id: undefined,
  Account: undefined,
  UserName: undefined,
  Email: undefined,
  GroupId: undefined,
  RoleId: undefined,
  State: undefined,
  CreateBy: undefined,
  CreateTimeStart: undefined,
  CreateTimeEnd: undefined,
  UpdateBy: undefined,
  UpdateTimeStart: undefined,
  UpdateTimeEnd: undefined,
  PageIndex: 1,
  PageSize: 20
});

const userList = ref([]);
const totalCountUser = ref(0);

const roleOptions = computed(() => {
  const options = [];
  for (const key in RoleType) {
    if (isNaN(Number(key))) {
      options.push({
        label: key,
        value: RoleType[key]
      });
    }
  }
  return options;
});

const stateOptions = [
  { value: true, text: "已启用" },
  { value: false, text: "已禁用" }
];

function handleFilter() {
  getUserPageList(listQuery.value).then(response => {
    userList.value = response.Data.Items.map(item => {
      return item;
    });
    totalCountUser.value = response.Data.TotalCount;
  });
}

function handleReset() {
  listQuery.value = {
    Id: undefined,
    Account: undefined,
    UserName: undefined,
    Email: undefined,
    GroupId: undefined,
    RoleId: undefined,
    State: undefined,
    CreateBy: undefined,
    CreateTimeStart: undefined,
    CreateTimeEnd: undefined,
    UpdateBy: undefined,
    UpdateTimeStart: undefined,
    UpdateTimeEnd: undefined,
    PageIndex: 1,
    PageSize: 20
  };
  handleFilter();
}

function getStateText(state) {
  const option = stateOptions.find(option => option.value === state);
  return option ? option.text : "";
}

function getStateClass(state) {
  return state ? "state-enabled" : "state-disabled";
}

// 悬浮展示bug明细列表
function showBugClick() {
  //
}
function handleUpdate() {
  // 编辑BUG
}
</script>

<template>
  <div>
    <div>
      <el-input
        v-model="listQuery.Account"
        placeholder="请输入账户名"
        style="width: 90px; margin-right: 10px"
      />
      <el-input
        v-model="listQuery.UserName"
        placeholder="请输入用户名"
        style="width: 90px; margin-right: 10px"
      />
      <el-input
        v-model="listQuery.Email"
        placeholder="请输入邮箱"
        style="width: 90px; margin-right: 10px"
      />
      <el-input
        v-model="listQuery.GroupId"
        placeholder="请选择分组"
        style="width: 90px; margin-right: 10px"
      />
      <el-select
        v-model="listQuery.RoleId"
        placeholder="请选择角色"
        style="width: 90px; margin-right: 10px"
      >
        <el-option
          v-for="option in roleOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
      <el-select
        v-model="listQuery.State"
        placeholder="请选择状态"
        style="width: 90px; margin-right: 10px"
      >
        <el-option
          v-for="option in stateOptions"
          :key="option.value"
          :label="option.text"
          :value="option.value"
        />
      </el-select>
      <el-input
        v-model="listQuery.CreateBy"
        placeholder="请选择创建人"
        style="width: 90px; margin-right: 10px"
      />
      <el-input
        v-model="listQuery.CreateTimeStart"
        placeholder="请选择创建时间"
        style="width: 90px; margin-right: 10px"
      />
      <el-input
        v-model="listQuery.UpdateBy"
        placeholder="请选择最后修改人"
        style="width: 90px; margin-right: 10px"
      />
      <el-input
        v-model="listQuery.UpdateTimeStart"
        placeholder="请选择最后修改时间"
        style="width: 90px; margin-right: 10px"
      />
      <el-button type="primary" style="margin-left: 10px" @click="handleFilter"
        >查询</el-button
      >
      <el-button style="margin-left: 10px" @click="handleReset">重置</el-button>
    </div>
    <div
      style="display: flex; align-items: center; justify-content: space-between"
    >
      <div style="display: flex; align-items: center">
        <el-button type="primary" @click="handleFilter">新增</el-button>
        <el-button type="danger" @click="handleFilter">批量删除</el-button>
      </div>
      <el-pagination
        v-model:current-page="listQuery.PageIndex"
        v-model:page-size="listQuery.PageSize"
        :page-sizes="[20, 50, 100, 500]"
        :small="small"
        :disabled="disabled"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCountUser"
        @size-change="handleFilter"
        @current-change="handleFilter"
      />
    </div>
    <div>
      <el-table :data="userList" border style="width: 100%">
        <el-table-column prop="Id" label="序号" width="60" />
        <el-table-column prop="Account" label="账户名" width="90" />
        <el-table-column prop="UserName" label="用户名" width="90" />
        <el-table-column prop="Email" label="邮箱" width="180" />
        <el-table-column prop="GroupId" label="分组" width="90" />
        <el-table-column prop="RoleId" label="角色" width="90">
          <template #default="{ row }">
            {{ RoleType[row.RoleId] }}
          </template>
        </el-table-column>
        <el-table-column prop="State" label="账号状态" width="90">
          <template #default="{ row }">
            <span :class="getStateClass(row.State)">{{
              getStateText(row.State)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="CreateBy" label="创建人" width="90" />
        <el-table-column prop="CreateTime" label="创建时间" width="180" />
        <el-table-column prop="UpdateBy" label="最后修改人" width="120" />
        <el-table-column prop="UpdateTime" label="最后修改时间" width="180" />
        <el-table-column fixed="right" label="操作" width="180">
          <template #default="row">
            <el-button
              link
              type="primary"
              size="small"
              @click="handleUpdate(row)"
              >权限配置</el-button
            >
            <el-button
              link
              type="primary"
              size="small"
              @click="handleUpdate(row)"
              >编辑</el-button
            >
            <el-button
              link
              type="primary"
              size="small"
              @click="handleUpdate(row)"
              >禁用</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style scoped>
.state-enabled {
  color: green;
}

.state-disabled {
  color: red;
}
</style>
