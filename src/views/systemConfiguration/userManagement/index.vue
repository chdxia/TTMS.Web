<script setup lang="ts">
import { ref, computed, onMounted, reactive } from "vue";
import { ElMessage, FormRules, FormInstance } from "element-plus";
import { RoleType } from "@/enums/UserEnums";
import { getGroupList } from "@/api/group";
import {
  getUserPageList,
  getUserList,
  createUser,
  updateUser,
  deleteUser
} from "@/api/user";

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
const list = ref([]);
const totalCount = ref(0);
const groupList = ref([]);
const multipleSelection = ref([]);
const listLoading = ref(false);
const dialogFormVisible = ref(false);
const dialogStatus = ref("");
const formRef = ref<FormInstance>();
const form = ref({
  Id: undefined,
  Account: undefined,
  UserName: undefined,
  Email: undefined,
  GroupId: undefined,
  PassWord: undefined,
  RoleId: undefined,
  State: undefined
});

const userStateOptions = [
  { id: 1, value: true, text: "已启用" },
  { id: 2, value: false, text: "已禁用" }
];

const roleTypeOptions = computed(() => {
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

const userRule = reactive<FormRules<typeof form>>({
  Account: [{ required: true, message: "请输入账号", trigger: "blur" }],
  Email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
  PassWord: [{ required: true, message: "请输入密码", trigger: "blur" }],
  RoleId: [{ required: true, message: "请选择角色", trigger: "blur" }],
  State: [{ required: true, message: "请选择状态", trigger: "blur" }]
});

function handleFilter() {
  listLoading.value = true;
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
      list.value = res.Data.Items.map(item => {
        const group = groupList.value.find(group => group.Id === item.GroupId);
        return {
          ...item,
          GroupName:
            item.GroupId === 0 ? "" : group ? group.GroupName : item.GroupId
        };
      });
      totalCount.value = res.Data.TotalCount;
      setTimeout(() => {
        listLoading.value = false;
      }, 0.3 * 1000);
    } else {
      ElMessage.error(res.Msg);
      listLoading.value = false;
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
  getGroupList({}).then(res => {
    groupList.value = res.Data.map(item => item);
  });
}

function getStateText(state) {
  const option = userStateOptions.find(option => option.value === state);
  return option ? option.text : "";
}

function getStateClass(state) {
  return state ? "state-enabled" : "state-disabled";
}

function handleResetForm() {
  Object.keys(form.value).forEach(key => {
    form.value[key] = undefined;
  });
}

function closeDialogForm() {
  dialogFormVisible.value = false;
  handleResetForm();
}

function handleCreateUser() {
  handleResetForm();
  dialogStatus.value = "新建用户";
  userRule.PassWord[0].required = true;
  userRule.State[0].required = false;
  dialogFormVisible.value = true;
}

function runCreateUser() {
  formRef.value.validate(valid => {
    if (valid) {
      createUser(form.value).then(res => {
        if (res.IsSuccess) {
          dialogFormVisible.value = false;
          const query = { Account: this.userForm.Account };
          getUserList(query).then(res => {
            if (res.IsSuccess) {
              const user = res.Data[0];
              list.value.unshift(user);
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
  form.value = Object.assign({}, row);
  if (form.value.GroupId == 0) {
    form.value.GroupId = undefined;
  }
  dialogStatus.value = "编辑用户";
  userRule.PassWord[0].required = false;
  userRule.State[0].required = true;
  dialogFormVisible.value = true;
}

function runUpdateUser() {
  formRef.value.validate(valid => {
    if (valid) {
      updateUser(form.value).then(res => {
        if (res.IsSuccess) {
          dialogFormVisible.value = false;
          const index = list.value.findIndex(v => v.Id === form.value.Id);
          list.value.splice(index, 1, form.value);
          ElMessage.success("操作成功");
        } else {
          ElMessage.error(res.Msg);
        }
      });
    }
  });
}

function handleBatchDeleteUser() {
  const selectedUsers = multipleSelection.value;
  if (selectedUsers.length === 0) {
    ElMessage.warning("请选择要删除的用户");
    return;
  }
  const userIds = selectedUsers.map(user => user.Id);
  deleteUser(userIds).then(res => {
    if (res.IsSuccess) {
      list.value = list.value.filter(user => !userIds.includes(user.Id));
      ElMessage.success("操作成功");
    } else {
      ElMessage.error(res.Msg);
    }
  });
}

function handleClearListQueryToUndefined(field: keyof typeof listQuery.value) {
  listQuery.value[field] = undefined;
}

function handleClearFormToUndefined(field: keyof typeof form.value) {
  form.value[field] = undefined;
}

onMounted(() => {
  setGroupList();
  handleFilter();
});
</script>

<template>
  <div>
    <el-form :inline="true" class="query-form-inline">
      <el-form-item label="账户名:">
        <el-input
          v-model="listQuery.Account"
          @keyup.enter="handleFilter"
          clearable
        />
      </el-form-item>
      <el-form-item label="用户名:">
        <el-input
          v-model="listQuery.UserName"
          @keyup.enter="handleFilter"
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
          clearable
          @clear="handleClearListQueryToUndefined('GroupId')"
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
          clearable
          @clear="handleClearListQueryToUndefined('RoleId')"
        >
          <el-option
            v-for="option in roleTypeOptions"
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
          clearable
          @clear="handleClearListQueryToUndefined('State')"
        >
          <el-option
            v-for="option in userStateOptions"
            :key="option.id"
            :label="option.text"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建人:">
        <el-input v-model="listQuery.CreateBy" placeholder="请选择" clearable />
      </el-form-item>
      <el-form-item label="创建时间:">
        <el-date-picker
          v-model="createTimeQuery"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          style="width: 220px"
          clearable
        />
      </el-form-item>
      <el-form-item label="最后修改人:">
        <el-input v-model="listQuery.UpdateBy" placeholder="请选择" clearable />
      </el-form-item>
      <el-form-item label="最后修改时间:">
        <el-date-picker
          v-model="updateTimeQuery"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD"
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
        :total="totalCount"
        @size-change="handleFilter()"
        @current-change="handleFilter()"
      />
    </div>
    <div>
      <el-table
        :data="list"
        v-loading="listLoading"
        border
        style="width: 100%"
        v-model:selected-keys="multipleSelection"
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
          ref="formRef"
          :model="form"
          :rules="userRule"
          label-width="140px"
          style="max-width: 460px"
        >
          <el-form-item label="账户名:" prop="Account">
            <el-input v-model="form.Account" clearable />
          </el-form-item>
          <el-form-item label="用户名:" prop="UserName">
            <el-input v-model="form.UserName" clearable />
          </el-form-item>
          <el-form-item label="邮箱:" prop="Email">
            <el-input v-model="form.Email" clearable />
          </el-form-item>
          <el-form-item label="密码:" prop="PassWord">
            <el-input v-model="form.PassWord" type="password" show-password />
          </el-form-item>
          <el-form-item label="选择分组:" prop="GroupId">
            <el-select
              v-model="form.GroupId"
              placeholder="请选择"
              clearable
              @clear="handleClearFormToUndefined('GroupId')"
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
              v-model="form.RoleId"
              placeholder="请选择"
              clearable
              @clear="handleClearFormToUndefined('RoleId')"
            >
              <el-option
                v-for="option in roleTypeOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="选择状态:" prop="State">
            <el-select
              v-model="form.State"
              placeholder="请选择"
              clearable
              @clear="handleClearFormToUndefined('State')"
            >
              <el-option
                v-for="option in userStateOptions"
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
                dialogStatus === '新建用户' ? runCreateUser() : runUpdateUser()
              "
              >确定</el-button
            >
          </div>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<style>
.query-form-inline .el-input {
  width: 120px;
}

.query-form-inline .el-select {
  width: 120px;
}

.state-enabled {
  color: green;
}

.state-disabled {
  color: red;
}
</style>
