<script setup lang="ts">
import { ref, computed, onMounted, reactive } from "vue";
import { ElMessage, FormRules, FormInstance } from "element-plus";
import { DefectType, DefectState } from "@/enums/DefectEnums";
import { getGroupList } from "@/api/group";
import { getDefectPageList, updateDefect } from "@/api/defect";
import UserSelect from "@/components/UserSelect/index.vue";

defineOptions({
  name: "Defect"
});

// 查询参数
const listQuery = ref({
  Id: undefined,
  GroupId: undefined,
  ModuleName: undefined,
  DemandName: undefined,
  DeveloperId: undefined,
  TesterId: undefined,
  Title: undefined,
  DefectType: undefined,
  DefectState: undefined,
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
const listLoading = ref(false);
const dialogFormVisible = ref(false);
const formRef = ref<FormInstance>();
const form = ref({
  Id: undefined,
  DemandId: undefined,
  Title: undefined,
  Description: undefined,
  DefectType: undefined,
  DefectState: undefined,
  DefectDetailDescription: undefined
});

const defectTypeOptions = computed(() => {
  const options = [];
  for (const key in DefectType) {
    if (isNaN(Number(key))) {
      options.push({
        label: key,
        value: DefectType[key]
      });
    }
  }
  return options;
});

const defectStateOptions = computed(() => {
  const options = [];
  for (const key in DefectState) {
    if (isNaN(Number(key))) {
      options.push({
        label: key,
        value: DefectState[key]
      });
    }
  }
  return options;
});

const defectRule = reactive<FormRules<typeof form>>({
  DefectType: [{ required: true, message: "请选择严重等级", trigger: "blur" }],
  DefectState: [{ required: true, message: "请选择BUG状态", trigger: "blur" }]
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
  getDefectPageList(listQuery.value).then(res => {
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
    GroupId: undefined,
    ModuleName: undefined,
    DemandName: undefined,
    DeveloperId: undefined,
    TesterId: undefined,
    Title: undefined,
    DefectType: undefined,
    DefectState: undefined,
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

function handleResetForm() {
  Object.keys(form.value).forEach(key => {
    form.value[key] = undefined;
  });
}

function closeDialogForm() {
  dialogFormVisible.value = false;
  handleResetForm();
}

function handleUpdateDefect(row) {
  form.value = Object.assign({}, row);
  dialogFormVisible.value = true;
}

function runUpdateDefect() {
  formRef.value.validate(valid => {
    if (valid) {
      updateDefect(form.value).then(res => {
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
      <el-form-item label="所属分组:">
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
      <el-form-item label="选择模块:">
        <el-input
          v-model="listQuery.ModuleName"
          @keyup.enter="handleFilter"
          clearable
        />
      </el-form-item>
      <el-form-item label="需求名称:">
        <el-input
          v-model="listQuery.DemandName"
          @keyup.enter="handleFilter"
          clearable
        />
      </el-form-item>
      <el-form-item label="开发:">
        <el-input
          v-model="listQuery.DeveloperId"
          @keyup.enter="handleFilter"
          clearable
        />
      </el-form-item>
      <el-form-item label="测试:">
        <el-input
          v-model="listQuery.TesterId"
          @keyup.enter="handleFilter"
          clearable
        />
      </el-form-item>
      <el-form-item label="BUG标题:">
        <el-input
          v-model="listQuery.Title"
          @keyup.enter="handleFilter"
          clearable
        />
      </el-form-item>
      <el-form-item label="严重程度:">
        <el-select
          v-model="listQuery.DefectType"
          placeholder="请选择"
          clearable
          @clear="handleClearListQueryToUndefined('DefectType')"
        >
          <el-option
            v-for="option in defectTypeOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="BUG状态:">
        <el-select
          v-model="listQuery.DefectState"
          placeholder="请选择"
          clearable
          @clear="handleClearListQueryToUndefined('DefectState')"
        >
          <el-option
            v-for="option in defectStateOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建人:">
        <user-select @selected-user-id="listQuery.CreateBy" />
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
    <div style="display: flex; align-items: center; justify-content: flex-end">
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
      <el-table :data="list" v-loading="listLoading" border style="width: 100%">
        <el-table-column prop="Id" label="序号" width="60" />
        <el-table-column prop="GroupName" label="所属分组" width="90" />
        <el-table-column prop="ModuleName" label="一级模块" width="90" />
        <el-table-column prop="ModuleName" label="二级模块" width="90" />
        <el-table-column prop="DemandName" label="需求名称" width="90" />
        <el-table-column prop="DeveloperId" label="开发" width="90" />
        <el-table-column prop="TesterId" label="测试" width="90" />
        <el-table-column prop="Title" label="BUG标题" width="90" />
        <el-table-column prop="Description" label="BUG描述" width="90" />
        <el-table-column prop="Description" label="附件" width="90" />
        <el-table-column prop="DefectType" label="严重程度" width="90">
          <template #default="{ row }">
            {{ DefectType[row.DefectType] }}
          </template>
        </el-table-column>
        <el-table-column prop="DefectState" label="BUG状态" width="90">
          <template #default="{ row }">
            {{ DefectState[row.DefectState] }}
          </template>
        </el-table-column>
        <el-table-column prop="CreateBy" label="创建人" width="90" />
        <el-table-column prop="CreateTime" label="创建时间" width="180" />
        <el-table-column prop="UpdateBy" label="最后修改人" width="120" />
        <el-table-column prop="UpdateTime" label="最后修改时间" width="180" />
        <el-table-column fixed="right" label="操作" width="180">
          <template #default="{ row }">
            <el-button
              link
              type="primary"
              size="small"
              @click="handleUpdateDefect(row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-dialog
        v-model="dialogFormVisible"
        title="编辑缺陷"
        :before-close="closeDialogForm"
        width="600px"
      >
        <el-form
          ref="formRef"
          :model="form"
          :rules="defectRule"
          label-width="140px"
          style="max-width: 460px"
        >
          <el-form-item label="缺陷标题:" prop="Title">
            <el-input v-model="form.Title" clearable />
          </el-form-item>
          <el-form-item label="缺陷描述:" prop="Description">
            <el-input v-model="form.Description" clearable />
          </el-form-item>
          <el-form-item label="严重程度:" prop="DefectType">
            <el-select
              v-model="form.DefectType"
              placeholder="请选择"
              clearable
              @clear="handleClearFormToUndefined('DefectType')"
            >
              <el-option
                v-for="option in defectTypeOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="BUG状态:" prop="DefectState">
            <el-select
              v-model="form.DefectState"
              placeholder="请选择"
              clearable
              @clear="handleClearFormToUndefined('DefectState')"
            >
              <el-option
                v-for="option in defectStateOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
          <div style="text-align: right">
            <el-button @click="closeDialogForm()">取消</el-button>
            <el-button type="primary" @click="runUpdateDefect()"
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
</style>
