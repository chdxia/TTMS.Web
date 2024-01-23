<script setup lang="ts">
import { ref, computed, onMounted, reactive } from "vue";
import { ElMessage, FormRules, FormInstance } from "element-plus";
import { DemandType, DemandState, DemandPriority } from "@/enums/DemandEnums";
import { getGroupList } from "@/api/group";
import {
  getDemandPageList,
  createDemand,
  updateDemand,
  //updateDemandVersionInfo,
  deleteDemand
} from "@/api/demand";

defineOptions({
  name: "Demand"
});

// 查询参数
const listQuery = ref({
  Id: undefined,
  GroupId: undefined,
  ModuleName: undefined,
  DemandType: undefined,
  DemandName: undefined,
  ProposerName: undefined,
  ProposeTimeStart: undefined,
  ProposeTimeEnd: undefined,
  DemandPriority: undefined,
  DeveloperId: undefined,
  TesterId: undefined,
  DemandState: undefined,
  PlanOnlineTimeStart: undefined,
  PlanOnlineTimeEnd: undefined,
  ActualOnlineTimeStart: undefined,
  ActualOnlineTimeEnd: undefined,
  VersionNo: undefined,
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
const planOnlineTimeQuery = ref(null);
const actualOnlineTimeQuery = ref(null);
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
  GroupId: undefined,
  ModuleName: undefined,
  DemandType: undefined,
  DemandName: undefined,
  Description: undefined,
  Remark: undefined,
  ProposerName: undefined,
  ProposeTime: undefined,
  DemandPriority: undefined,
  Developer: undefined,
  Tester: undefined,
  WorkHours: undefined,
  PlanOnlineTime: undefined,
  ActualOnlineTime: undefined,
  VersionInfoIds: undefined,
  DemandState: undefined
});

const demandTypeOptions = computed(() => {
  const options = [];
  for (const key in DemandType) {
    if (isNaN(Number(key))) {
      options.push({
        label: key,
        value: DemandType[key]
      });
    }
  }
  return options;
});

const demandPriorityOptions = computed(() => {
  const options = [];
  for (const key in DemandPriority) {
    if (isNaN(Number(key))) {
      options.push({
        label: key,
        value: DemandPriority[key]
      });
    }
  }
  return options;
});

const demandStateOptions = computed(() => {
  const options = [];
  for (const key in DemandState) {
    if (isNaN(Number(key))) {
      options.push({
        label: key,
        value: DemandState[key]
      });
    }
  }
  return options;
});

const demandRule = reactive<FormRules<typeof form>>({
  GroupId: [{ required: true, message: "请选择分组", trigger: "blur" }],
  DemandType: [{ required: true, message: "请选择需求类型", trigger: "blur" }],
  ProposeTime: [
    { required: true, message: "请选择需求提出时间", trigger: "blur" }
  ]
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
  if (planOnlineTimeQuery.value == null) {
    listQuery.value.PlanOnlineTimeStart = undefined;
    listQuery.value.PlanOnlineTimeEnd = undefined;
  } else {
    listQuery.value.PlanOnlineTimeStart = planOnlineTimeQuery.value[0];
    listQuery.value.PlanOnlineTimeEnd = planOnlineTimeQuery.value[1];
  }
  if (actualOnlineTimeQuery.value == null) {
    listQuery.value.ActualOnlineTimeStart = undefined;
    listQuery.value.ActualOnlineTimeEnd = undefined;
  } else {
    listQuery.value.ActualOnlineTimeStart = actualOnlineTimeQuery.value[0];
    listQuery.value.ActualOnlineTimeEnd = actualOnlineTimeQuery.value[1];
  }
  getDemandPageList(listQuery.value).then(res => {
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
    DemandType: undefined,
    DemandName: undefined,
    ProposerName: undefined,
    ProposeTimeStart: undefined,
    ProposeTimeEnd: undefined,
    DemandPriority: undefined,
    DeveloperId: undefined,
    TesterId: undefined,
    DemandState: undefined,
    PlanOnlineTimeStart: undefined,
    PlanOnlineTimeEnd: undefined,
    ActualOnlineTimeStart: undefined,
    ActualOnlineTimeEnd: undefined,
    VersionNo: undefined,
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

function handleCreateDemand() {
  handleResetForm();
  dialogStatus.value = "新建需求";
  dialogFormVisible.value = true;
}

function runCreateDemand() {
  formRef.value.validate(valid => {
    if (valid) {
      createDemand(form.value).then(res => {
        if (res.IsSuccess) {
          dialogFormVisible.value = false;
          ElMessage.success("操作成功");
        } else {
          ElMessage.error(res.Msg);
        }
      });
    }
  });
}

function handleUpdateDemand(row) {
  form.value = Object.assign({}, row);
  if (form.value.GroupId == 0) {
    form.value.GroupId = undefined;
  }
  dialogStatus.value = "编辑需求";
  dialogFormVisible.value = true;
}

function runUpdateDemand() {
  formRef.value.validate(valid => {
    if (valid) {
      updateDemand(form.value).then(res => {
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

function handleBatchDeleteDemand() {
  const selectedDemands = multipleSelection.value;
  if (selectedDemands.length === 0) {
    ElMessage.warning("请选择要删除的用户");
    return;
  }
  const demandIds = selectedDemands.map(demand => demand.Id);
  deleteDemand(demandIds).then(res => {
    if (res.IsSuccess) {
      list.value = list.value.filter(demand => !demandIds.includes(demand.Id));
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
    <el-form :inline="true">
      <el-form-item label="所属分组:">
        <el-select
          v-model="listQuery.GroupId"
          placeholder="请选择"
          style="width: 120px"
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
          style="width: 120px"
          clearable
        />
      </el-form-item>
      <el-form-item label="需求类型:">
        <el-select
          v-model="listQuery.DemandType"
          placeholder="请选择"
          style="width: 120px"
          clearable
          @clear="handleClearListQueryToUndefined('DemandType')"
        >
          <el-option
            v-for="option in demandTypeOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="需求名称:">
        <el-input
          v-model="listQuery.DemandName"
          @keyup.enter="handleFilter"
          style="width: 180px"
          clearable
        />
      </el-form-item>
      <el-form-item label="提出人:">
        <el-input
          v-model="listQuery.ProposerName"
          @keyup.enter="handleFilter"
          style="width: 180px"
          clearable
        />
      </el-form-item>
      <el-form-item label="提出时间:">
        <el-date-picker
          v-model="listQuery.ProposeTimeStart"
          placeholder="请选择"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
          style="width: 220px"
          clearable
        />
      </el-form-item>
      <el-form-item label="优先级:">
        <el-select
          v-model="listQuery.DemandPriority"
          placeholder="请选择"
          style="width: 120px"
          clearable
          @clear="handleClearListQueryToUndefined('DemandPriority')"
        >
          <el-option
            v-for="option in demandPriorityOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="开发:">
        <el-input
          v-model="listQuery.DeveloperId"
          @keyup.enter="handleFilter"
          style="width: 180px"
          clearable
        />
      </el-form-item>
      <el-form-item label="测试:">
        <el-input
          v-model="listQuery.TesterId"
          @keyup.enter="handleFilter"
          style="width: 180px"
          clearable
        />
      </el-form-item>
      <el-form-item label="需求状态:">
        <el-select
          v-model="listQuery.DemandState"
          placeholder="请选择"
          style="width: 120px"
          clearable
          @clear="handleClearListQueryToUndefined('DemandState')"
        >
          <el-option
            v-for="option in demandStateOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="预计上线时间:">
        <el-date-picker
          v-model="planOnlineTimeQuery"
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
      <el-form-item label="实际上线时间:">
        <el-date-picker
          v-model="actualOnlineTimeQuery"
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
      <el-form-item label="版本号:">
        <el-input
          v-model="listQuery.VersionNo"
          placeholder="请选择"
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
        <el-button type="primary" @click="handleCreateDemand()">新增</el-button>
        <el-button type="primary">关联版本</el-button>
        <el-popconfirm
          confirm-button-text="确定"
          cancel-button-text="取消"
          title="确定删除所选？"
          @confirm="handleBatchDeleteDemand()"
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
        <el-table-column prop="VersionNo" label="版本号" width="90" />
        <el-table-column prop="GroupName" label="所属分组" width="90" />
        <el-table-column prop="ModuleName" label="一级模块" width="90" />
        <el-table-column prop="ModuleName" label="二级模块" width="90" />
        <el-table-column prop="DemandType" label="需求类型" width="90">
          <template #default="{ row }">
            {{ DemandType[row.DemandType] }}
          </template>
        </el-table-column>
        <el-table-column prop="DemandName" label="需求名称" width="90" />
        <el-table-column prop="DemandDescription" label="需求描述" width="90" />
        <el-table-column prop="Attachment" label="附件" width="90" />
        <el-table-column prop="Remark" label="备注" width="90" />
        <el-table-column prop="ProposerName" label="提出人" width="90" />
        <el-table-column prop="ProposeTime" label="提出时间" width="90" />
        <el-table-column prop="DemandPriority" label="优先级" width="90">
          <template #default="{ row }">
            {{ DemandPriority[row.DemandPriority] }}
          </template>
        </el-table-column>
        <el-table-column prop="DeveloperId" label="开发" width="90" />
        <el-table-column prop="TesterId" label="测试" width="90" />
        <el-table-column prop="DemandState" label="需求状态" width="90">
          <template #default="{ row }">
            {{ DemandState[row.DemandState] }}
          </template>
        </el-table-column>
        <el-table-column prop="EstimatedHours" label="预计工时" width="90" />
        <el-table-column prop="PlanOnlineTime" label="预计上线" width="90" />
        <el-table-column prop="ActualOnlineTime" label="实际上线" width="90" />
        <el-table-column prop="CreateBy" label="创建人" width="90" />
        <el-table-column prop="CreateTime" label="创建时间" width="90" />
        <el-table-column prop="UpdateBy" label="最后修改人" width="120" />
        <el-table-column prop="UpdateTime" label="最后修改时间" width="120" />
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="row">
            <el-button
              link
              type="primary"
              size="small"
              @click="handleUpdateDemand(row)"
              >BUG待处理</el-button
            >
            <el-button
              link
              type="primary"
              size="small"
              @click="handleUpdateDemand(row)"
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
          :rules="demandRule"
          label-width="140px"
          style="max-width: 460px"
        >
          <el-form-item label="所属分组:" prop="GroupId">
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
          <el-form-item label="模块名称:" prop="ModuleName">
            <el-input v-model="form.ModuleName" clearable />
          </el-form-item>
          <el-form-item label="需求类型:" prop="DemandType">
            <el-select
              v-model="form.DemandType"
              placeholder="请选择"
              clearable
              @clear="handleClearFormToUndefined('DemandType')"
            >
              <el-option
                v-for="option in demandTypeOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="需求名称:" prop="DemandName">
            <el-input v-model="form.DemandName" clearable />
          </el-form-item>
          <el-form-item label="描述:" prop="Description">
            <el-input v-model="form.Description" clearable />
          </el-form-item>
          <el-form-item label="备注:" prop="Remark">
            <el-input v-model="form.Remark" clearable />
          </el-form-item>
          <el-form-item label="提出人:" prop="ProposerName">
            <el-input v-model="form.ProposerName" clearable />
          </el-form-item>
          <el-form-item label="提出时间:" prop="ProposeTime">
            <el-input v-model="form.ProposeTime" clearable />
          </el-form-item>
          <el-form-item label="优先级:" prop="DemandPriority">
            <el-select
              v-model="form.DemandPriority"
              placeholder="请选择"
              clearable
              @clear="handleClearFormToUndefined('DemandPriority')"
            >
              <el-option
                v-for="option in demandPriorityOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="开发:" prop="Developer">
            <el-input v-model="form.Developer" clearable />
          </el-form-item>
          <el-form-item label="测试:" prop="Tester">
            <el-input v-model="form.Tester" clearable />
          </el-form-item>

          <el-form-item label="工时:" prop="WorkHours">
            <el-input v-model="form.WorkHours" clearable />
          </el-form-item>

          <el-form-item label="预计上线时间:" prop="PlanOnlineTime">
            <el-input v-model="form.PlanOnlineTime" clearable />
          </el-form-item>

          <el-form-item label="实际上线时间:" prop="ActualOnlineTime">
            <el-input v-model="form.PlanOnlineTime" clearable />
          </el-form-item>

          <el-form-item label="版本号:" prop="VersionInfoIds">
            <el-input v-model="form.PlanOnlineTime" clearable />
          </el-form-item>
          <div style="text-align: right">
            <el-button @click="closeDialogForm()">取消</el-button>
            <el-button
              type="primary"
              @click="
                dialogStatus === '新建需求'
                  ? runCreateDemand()
                  : runUpdateDemand()
              "
              >确定</el-button
            >
          </div>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
