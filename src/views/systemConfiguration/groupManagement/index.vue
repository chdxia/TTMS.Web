<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import {
  getGroupPageList,
  createGroup,
  updateGroup,
  deleteGroup
} from "@/api/group";

defineOptions({
  name: "GroupManagement"
});

// 查询参数
const listQuery = ref({
  Id: undefined,
  GroupName: undefined,
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
const multipleSelection = ref([]);
const listLoading = ref(false);
const dialogFormVisible = ref(false);
const dialogStatus = ref("");
const formRef = ref<FormInstance>();
const form = ref({
  GroupName: undefined,
  Id: undefined
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
  getGroupPageList(listQuery.value).then(res => {
    if (res.IsSuccess) {
      list.value = res.Data.Items.map(item => item);
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
    GroupName: undefined,
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

function closeDialogForm() {
  dialogFormVisible.value = false;
  handleResetForm();
}

function handleResetForm() {
  Object.keys(form.value).forEach(key => {
    form.value[key] = undefined;
  });
}

function handleCreateGroup() {
  handleResetForm();
  dialogStatus.value = "新建分组";
  dialogFormVisible.value = true;
}

function runCreateGroup() {
  formRef.value.validate(valid => {
    if (valid) {
      createGroup(form.value).then(res => {
        if (res.IsSuccess) {
          dialogFormVisible.value = false;
          list.value.unshift(form);
          ElMessage.success("操作成功");
        } else {
          ElMessage.error(res.Msg);
        }
      });
    }
  });
}

function handleUpdateGroup(row) {
  form.value = Object.assign({}, row);
  dialogStatus.value = "编辑分组";
  dialogFormVisible.value = true;
}

function runUpdateGroup() {
  formRef.value.validate(valid => {
    if (valid) {
      updateGroup(form.value).then(res => {
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

function handleBatchDeleteGroup() {
  const selectedGroups = multipleSelection.value;
  if (selectedGroups.length === 0) {
    ElMessage.warning("请选择要删除的分组");
    return;
  }
  const groupIds = selectedGroups.map(group => group.Id);
  deleteGroup(groupIds).then(res => {
    if (res.IsSuccess) {
      list.value = list.value.filter(group => !groupIds.includes(group.Id));
      ElMessage.success("操作成功");
    } else {
      ElMessage.error(res.Msg);
    }
  });
}

onMounted(() => {
  handleFilter();
});
</script>

<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="组名:">
        <el-input
          v-model="listQuery.GroupName"
          @keyup.enter="handleFilter"
          style="width: 120px"
          clearable
        />
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
        <el-button type="primary" @click="handleCreateGroup()">新增</el-button>
        <el-popconfirm
          confirm-button-text="确定"
          cancel-button-text="取消"
          title="确定删除所选？"
          @confirm="handleBatchDeleteGroup()"
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
        <el-table-column prop="GroupName" label="组名" width="90" />
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
              @click="handleUpdateGroup(row)"
              >编辑</el-button
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
          label-width="140px"
          style="max-width: 460px"
        >
          <el-form-item label="组名:" prop="GroupName">
            <el-input v-model="form.GroupName" clearable />
          </el-form-item>
          <div style="text-align: right">
            <el-button @click="closeDialogForm()">取消</el-button>
            <el-button
              type="primary"
              @click="
                dialogStatus === '新建分组'
                  ? runCreateGroup()
                  : runUpdateGroup()
              "
              >确定</el-button
            >
          </div>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
