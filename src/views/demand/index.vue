<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
  getDemandPageList,
  createDemand,
  updateDemand,
  updateDemandVersionInfo,
  deleteDemand
} from "@/api/demand";

defineOptions({
  // name 作为一种规范最好必须写上并且和路由的name保持一致
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

const list = ref([]);

function handleFilter() {
  getDemandPageList(listQuery.value).then(response => {
    list.value = response.Body.Items.map(item => {
      return item;
    });
  });
}

function handleReset() {
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
}

// 点击展示bug列表窗口
function showBugClick() {
  // 处理bug的逻辑
}
function handleUpdate() {
  // 编辑需求
}
</script>

<template>
  <div>
    <div>
      <el-input
        v-model="listQuery.GroupId"
        placeholder="选择分组"
        style="width: 90px; margin-right: 10px"
      />
      <el-input
        v-model="listQuery.ModuleName"
        placeholder="选择模块"
        style="width: 90px; margin-right: 10px"
      />
      <el-input
        v-model="listQuery.DemandType"
        placeholder="需求类型"
        style="width: 90px; margin-right: 10px"
      />
      <el-input
        v-model="listQuery.DemandName"
        placeholder="需求名称"
        style="width: 90px; margin-right: 10px"
      />
      <el-input
        v-model="listQuery.ProposerName"
        placeholder="提出人"
        style="width: 90px; margin-right: 10px"
      />
      <el-input
        v-model="listQuery.ProposeTimeStart"
        placeholder="提出时间"
        style="width: 90px; margin-right: 10px"
      />
      <el-input
        v-model="listQuery.DemandPriority"
        placeholder="优先级"
        style="width: 90px; margin-right: 10px"
      />
      <el-input
        v-model="listQuery.DeveloperId"
        placeholder="开发"
        style="width: 90px; margin-right: 10px"
      />
      <el-input
        v-model="listQuery.TesterId"
        placeholder="测试"
        style="width: 90px; margin-right: 10px"
      />
      <el-input
        v-model="listQuery.DemandState"
        placeholder="需求状态"
        style="width: 90px; margin-right: 10px"
      />
      <el-input
        v-model="listQuery.PlanOnlineTimeStart"
        placeholder="预计上线"
        style="width: 90px; margin-right: 10px"
      />
      <el-input
        v-model="listQuery.ActualOnlineTimeStart"
        placeholder="实际上线"
        style="width: 90px; margin-right: 10px"
      />
      <el-input
        v-model="listQuery.VersionNo"
        placeholder="版本号"
        style="width: 90px; margin-right: 10px"
      />
      <el-input
        v-model="listQuery.CreateBy"
        placeholder="创建人"
        style="width: 90px; margin-right: 10px"
      />
      <el-input
        v-model="listQuery.CreateTimeStart"
        placeholder="创建时间"
        style="width: 90px; margin-right: 10px"
      />
      <el-input
        v-model="listQuery.UpdateBy"
        placeholder="最后修改人"
        style="width: 90px; margin-right: 10px"
      />
      <el-input
        v-model="listQuery.UpdateTimeStart"
        placeholder="最后修改时间"
        style="width: 90px; margin-right: 10px"
      />
      <el-button type="primary" style="margin-left: 10px" @click="handleFilter"
        >查询</el-button
      >
      <el-button style="margin-left: 10px" @click="handleReset">重置</el-button>
    </div>
    <div>
      <el-table :data="list" border style="width: 100%">
        <el-table-column prop="Id" label="序号" width="60" />
        <el-table-column prop="GroupId" label="所属分组" width="90" />
        <el-table-column prop="ModuleName" label="一级模块" width="90" />
        <el-table-column prop="ModuleName" label="二级模块" width="90" />
        <el-table-column prop="DemandType" label="需求类型" width="90" />
        <el-table-column prop="DemandName" label="需求名称" width="90" />
        <el-table-column prop="DemandDescription" label="需求描述" width="90" />
        <el-table-column prop="Attachment" label="附件" width="90" />
        <el-table-column prop="Remark" label="备注" width="90" />
        <el-table-column prop="ProposerName" label="提出人" width="90" />
        <el-table-column prop="ProposeTime" label="提出时间" width="90" />
        <el-table-column prop="DemandPriority" label="优先级" width="90" />
        <el-table-column prop="DeveloperId" label="开发" width="90" />
        <el-table-column prop="TesterId" label="测试" width="90" />
        <el-table-column prop="DemandState" label="需求状态" width="90" />
        <el-table-column prop="EstimatedHours" label="预计工时" width="90" />
        <el-table-column prop="PlanOnlineTime" label="预计上线" width="90" />
        <el-table-column prop="ActualOnlineTime" label="实际上线" width="90" />
        <el-table-column prop="VersionNo" label="版本号" width="90" />
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
              @click="showBugClick(row)"
              >BUG待处理</el-button
            >
            <el-button
              link
              type="primary"
              size="small"
              @click="handleUpdate(row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
