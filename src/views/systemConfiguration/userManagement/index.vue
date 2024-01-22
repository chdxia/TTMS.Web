<script setup lang="ts">
import { ref, computed, onMounted, reactive } from "vue";
import {
  getUserPageList,
  getUserList,
  createUser,
  updateUser,
  deleteUser
} from "@/api/user";
import { getGroupList } from "@/api/group";
import { RoleType } from "@/enums/RoleType";
import { ElMessage, FormRules, FormInstance } from "element-plus";

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
const multipleSelectionUser = ref([]);

const userListLoading = ref(false);

const dialogFormVisible = ref(false);

const dialogStatus = ref("");

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
  { id: 1, value: true, text: "已启用" },
  { id: 2, value: false, text: "已禁用" }
];

const userFormRef = ref<FormInstance>();

const userForm = ref({
  Account: undefined,
  UserName: undefined,
  Email: undefined,
  GroupId: undefined,
  PassWord: undefined,
  RoleId: undefined,
  Id: undefined,
  State: undefined
});

const userRule = reactive<FormRules<typeof userForm>>({
  Account: [{ required: true, message: "请输入账号", trigger: "blur" }],
  Email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
  PassWord: [{ required: true, message: "请输入密码", trigger: "blur" }],
  RoleId: [{ required: true, message: "请选择角色", trigger: "blur" }],
  State: [{ required: true, message: "请选择状态", trigger: "blur" }]
});

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
          GroupName:
            item.GroupId === 0 ? "" : group ? group.GroupName : item.GroupId
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

function handleQueryReset() {
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
    groupList.value = response.Data.map(item => item);
  });
}

function getStateText(state) {
  const option = stateOptions.find(option => option.value === state);
  return option ? option.text : "";
}

function getStateClass(state) {
  return state ? "state-enabled" : "state-disabled";
}

function closeDialogForm() {
  dialogFormVisible.value = false;
  userFormReset();
}

function userFormReset() {
  Object.keys(userForm.value).forEach(key => {
    userForm.value[key] = undefined;
  });
}

function handleCreateUser() {
  userFormReset();
  dialogStatus.value = "新建用户";
  userRule.PassWord[0].required = true;
  userRule.State[0].required = false;
  dialogFormVisible.value = true;
}

function createUserForm() {
  userFormRef.value.validate(valid => {
    if (valid) {
      createUser(userForm.value).then(res => {
        if (res.IsSuccess) {
          dialogFormVisible.value = false;
          const query = { Account: this.userForm.Account };
          getUserList(query).then(res => {
            if (res.IsSuccess) {
              const user = res.Data[0];
              userList.value.unshift(user);
            }
          });
          ElMessage.success("操作成功");
        } else {
          ElMessage.error(res.Msg);
        }
      });
    }
  });
}

function handleUpdateUser(row) {
  userForm.value = Object.assign({}, row);
  if (userForm.value.GroupId == 0) {
    userForm.value.GroupId = undefined;
  }
  dialogStatus.value = "编辑用户";
  userRule.PassWord[0].required = false;
  userRule.State[0].required = true;
  dialogFormVisible.value = true;
}

function updateUserForm() {
  userFormRef.value.validate(valid => {
    if (valid) {
      updateUser(userForm.value).then(res => {
        if (res.IsSuccess) {
          dialogFormVisible.value = false;
          const index = userList.value.findIndex(
            v => v.Id === userForm.value.Id
          );
          userList.value.splice(index, 1, userForm.value);
          ElMessage.success("操作成功");
        } else {
          ElMessage.error(res.Msg);
        }
      });
    }
  });
}

function handleBatchDeleteUser() {
  const selectedUsers = multipleSelectionUser.value;
  if (selectedUsers.length === 0) {
    ElMessage.warning("请选择要删除的用户");
    return;
  }

  const userIds = selectedUsers.map(user => user.Id);
  deleteUser(userIds).then(res => {
    if (res.IsSuccess) {
      // 从 userList 中移除已删除的用户
      userList.value = userList.value.filter(
        user => !userIds.includes(user.Id)
      );
      ElMessage.success("操作成功");
    } else {
      ElMessage.error(res.Msg);
    }
  });
}

function handleListQueryClearUndefined(field: keyof typeof listQuery.value) {
  listQuery.value[field] = undefined;
}

function handleUserFormClearUndefined(field: keyof typeof userForm.value) {
  userForm.value[field] = undefined;
}

onMounted(() => {
  setGroupList();
  handleFilter();
});
</script>

<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="账户名:">
        <el-input
          v-model="listQuery.Account"
          @keyup.enter="handleFilter"
          style="width: 120px"
          clearable
        />
      </el-form-item>
      <el-form-item label="用户名:">
        <el-input
          v-model="listQuery.UserName"
          @keyup.enter="handleFilter"
          style="width: 120px"
          clearable
        />
      </el-form-item>
      <el-form-item label="邮箱:">
        <el-input
          v-model="listQuery.Email"
          @keyup.enter="handleFilter"
          style="width: 180px"
          clearable
        />
      </el-form-item>
      <el-form-item label="选择分组:">
        <el-select
          v-model="listQuery.GroupId"
          placeholder="请选择"
          style="width: 120px"
          clearable
          @clear="handleListQueryClearUndefined('GroupId')"
        >
          <el-option
            v-for="option in groupList"
            :key="option.Id"
            :label="option.GroupName"
            :value="option.Id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="选择角色:">
        <el-select
          v-model="listQuery.RoleId"
          placeholder="请选择"
          style="width: 120px"
          clearable
          @clear="handleListQueryClearUndefined('RoleId')"
        >
          <el-option
            v-for="option in roleOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="选择状态:">
        <el-select
          v-model="listQuery.State"
          placeholder="请选择"
          style="width: 120px"
          clearable
          @clear="handleListQueryClearUndefined('State')"
        >
          <el-option
            v-for="option in stateOptions"
            :key="option.id"
            :label="option.text"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建人:">
        <el-input
          v-model="listQuery.CreateBy"
          placeholder="请选择"
          style="width: 120px"
          clearable
        />
      </el-form-item>
      <el-form-item label="创建时间:">
        <el-date-picker
          v-model="createTimeQuery"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
          style="width: 220px"
          clearable
        />
      </el-form-item>
      <el-form-item label="最后修改人:">
        <el-input
          v-model="listQuery.UpdateBy"
          placeholder="请选择"
          style="width: 120px"
          clearable
        />
      </el-form-item>
      <el-form-item label="最后修改时间:">
        <el-date-picker
          v-model="updateTimeQuery"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
          style="width: 220px"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          style="margin-left: 10px"
          @click="handleFilter()"
          >查询</el-button
        >
        <el-button style="margin-left: 10px" @click="handleQueryReset()"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <div
      style="display: flex; align-items: center; justify-content: space-between"
    >
      <div style="display: flex; align-items: center">
        <el-button type="primary" @click="handleCreateUser()">新增</el-button>
        <el-popconfirm
          confirm-button-text="确定"
          cancel-button-text="取消"
          title="确定删除所选？"
          @confirm="handleBatchDeleteUser()"
        >
          <template #reference>
            <el-button type="danger">批量删除</el-button>
          </template>
        </el-popconfirm>
      </div>
      <el-pagination
        v-model:current-page="listQuery.PageIndex"
        v-model:page-size="listQuery.PageSize"
        :page-sizes="[20, 50, 100, 500]"
        :small="true"
        :disabled="false"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCountUser"
        @size-change="handleFilter()"
        @current-change="handleFilter()"
      />
    </div>
    <div>
      <el-table
        :data="userList"
        v-loading="userListLoading"
        border
        style="width: 100%"
        v-model:selected-keys="multipleSelectionUser"
      >
        <el-table-column type="selection" width="38" />
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
          <template #default="{ row }">
            <el-button
              link
              type="primary"
              size="small"
              @click="dialogFormVisible = true"
              >权限配置</el-button
            >
            <el-button
              link
              type="primary"
              size="small"
              @click="handleUpdateUser(row)"
              >编辑</el-button
            >
            <el-button
              link
              type="primary"
              size="small"
              @click="dialogFormVisible = true"
              >禁用</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-dialog
        v-model="dialogFormVisible"
        :title="dialogStatus"
        :before-close="closeDialogForm"
        width="600px"
      >
        <el-form
          ref="userFormRef"
          :model="userForm"
          :rules="userRule"
          label-width="140px"
          style="max-width: 460px"
        >
          <el-form-item label="账户名:" prop="Account">
            <el-input v-model="userForm.Account" clearable />
          </el-form-item>
          <el-form-item label="用户名:" prop="UserName">
            <el-input v-model="userForm.UserName" clearable />
          </el-form-item>
          <el-form-item label="邮箱:" prop="Email">
            <el-input v-model="userForm.Email" clearable />
          </el-form-item>
          <el-form-item label="密码:" prop="PassWord">
            <el-input
              v-model="userForm.PassWord"
              type="password"
              show-password
            />
          </el-form-item>
          <el-form-item label="选择分组:" prop="GroupId">
            <el-select
              v-model="userForm.GroupId"
              placeholder="请选择"
              clearable
              @clear="handleUserFormClearUndefined('GroupId')"
            >
              <el-option
                v-for="option in groupList"
                :key="option.Id"
                :label="option.GroupName"
                :value="option.Id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="选择角色:" prop="RoleId">
            <el-select
              v-model="userForm.RoleId"
              placeholder="请选择"
              clearable
              @clear="handleUserFormClearUndefined('RoleId')"
            >
              <el-option
                v-for="option in roleOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="选择状态:" prop="State">
            <el-select
              v-model="userForm.State"
              placeholder="请选择"
              clearable
              @clear="handleUserFormClearUndefined('State')"
            >
              <el-option
                v-for="option in stateOptions"
                :key="option.id"
                :label="option.text"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
          <div style="text-align: right">
            <el-button @click="closeDialogForm()">取消</el-button>
            <el-button
              type="primary"
              @click="
                dialogStatus === '新建用户'
                  ? createUserForm()
                  : updateUserForm()
              "
              >确定</el-button
            >
          </div>
        </el-form>
      </el-dialog>
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
