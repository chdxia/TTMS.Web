<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
  getUserPageList,
  createUser,
  updateUser,
  deleteUser
} from "@/api/user";
import { getGroupList } from "@/api/group";
import { RoleType } from "@/enums/RoleType";
import { ElMessage } from "element-plus";

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
const createTimeQuery = ref(null);
const updateTimeQuery = ref(null);

const userList = ref([]);
const totalCountUser = ref(0);
const groupList = ref([]);

const userListLoading = ref(false);

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
  userListLoading.value = true;
  if (createTimeQuery.value == null) {
    listQuery.value.CreateTimeStart = undefined;
    listQuery.value.CreateTimeEnd = undefined;
  } else {
    listQuery.value.CreateTimeStart = createTimeQuery.value[0];
    listQuery.value.CreateTimeEnd = createTimeQuery.value[1];
  }
  if (updateTimeQuery.value == null) {
    listQuery.value.UpdateTimeStart = undefined;
    listQuery.value.UpdateTimeEnd = undefined;
  } else {
    listQuery.value.UpdateTimeStart = updateTimeQuery.value[0];
    listQuery.value.UpdateTimeEnd = updateTimeQuery.value[1];
  }
  getUserPageList(listQuery.value).then(res => {
    if (res.IsSuccess) {
      userList.value = res.Data.Items.map(item => {
        const group = groupList.value.find(group => group.Id === item.GroupId);
        return {
          ...item,
          GroupName: group ? group.GroupName : item.GroupId
        };
      });
      totalCountUser.value = res.Data.TotalCount;
      setTimeout(() => {
        userListLoading.value = false;
      }, 0.3 * 1000);
    } else {
      ElMessage.error(res.Msg);
      userListLoading.value = false;
    }
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
  createTimeQuery.value = null;
  updateTimeQuery.value = null;
  handleFilter();
}

function setGroupList() {
  getGroupList({}).then(response => {
    groupList.value = response.Data.map(item => {
      return item;
    });
  });
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

onMounted(() => {
  setGroupList();
  handleFilter();
});
</script>

<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="账户名：">
        <el-input
          v-model="listQuery.Account"
          @keyup.enter="handleFilter"
          style="width: 120px"
        />
      </el-form-item>
      <el-form-item label="用户名：">
        <el-input
          v-model="listQuery.UserName"
          @keyup.enter="handleFilter"
          style="width: 120px"
        />
      </el-form-item>
      <el-form-item label="邮箱：">
        <el-input
          v-model="listQuery.Email"
          @keyup.enter="handleFilter"
          style="width: 180px"
        />
      </el-form-item>
      <el-form-item label="选择分组：">
        <el-select
          v-model="listQuery.GroupId"
          placeholder="请选择"
          style="width: 120px"
        >
          <el-option
            v-for="option in groupList"
            :key="option.Id"
            :label="option.GroupName"
            :value="option.Id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="选择角色：">
        <el-select
          v-model="listQuery.RoleId"
          placeholder="请选择"
          style="width: 120px"
        >
          <el-option
            v-for="option in roleOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="选择状态：">
        <el-select
          v-model="listQuery.State"
          placeholder="请选择"
          style="width: 120px"
        >
          <el-option
            v-for="option in stateOptions"
            :key="option.value"
            :label="option.text"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建人：">
        <el-input
          v-model="listQuery.CreateBy"
          placeholder="请选择"
          style="width: 120px"
        />
      </el-form-item>
      <el-form-item label="创建时间：">
        <el-date-picker
          v-model="createTimeQuery"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
          style="width: 220px"
        />
      </el-form-item>
      <el-form-item label="最后修改人：">
        <el-input
          v-model="listQuery.UpdateBy"
          placeholder="请选择"
          style="width: 120px"
        />
      </el-form-item>
      <el-form-item label="最后修改时间：">
        <el-date-picker
          v-model="updateTimeQuery"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
          style="width: 220px"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          style="margin-left: 10px"
          @click="handleFilter"
          >查询</el-button
        >
        <el-button style="margin-left: 10px" @click="handleReset"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
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
      <el-table
        :data="userList"
        v-loading="userListLoading"
        border
        style="width: 100%"
      >
        <el-table-column prop="Id" label="序号" width="60" />
        <el-table-column prop="Account" label="账户名" width="90" />
        <el-table-column prop="UserName" label="用户名" width="90" />
        <el-table-column prop="Email" label="邮箱" width="180" />
        <el-table-column prop="GroupName" label="分组" width="90" />
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
        <el-table-column fixed="right" label="操作" width="180" align="center">
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
