<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
  getDefectPageList,
  createDefect,
  updateDefect,
  deleteDefect
} from "@/api/defect";

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

const list = ref([]);

function handleFilter() {
  getDefectPageList(listQuery.value).then(response => {
    list.value = response.Data.Items.map(item => {
      return item;
    });
  });
}

function handleReset() {
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
        v-model="listQuery.DemandName"
        placeholder="需求名称"
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
        v-model="listQuery.Title"
        placeholder="BUG标题"
        style="width: 90px; margin-right: 10px"
      />
      <el-input
        v-model="listQuery.DefectType"
        placeholder="严重程度"
        style="width: 90px; margin-right: 10px"
      />
      <el-input
        v-model="listQuery.DefectState"
        placeholder="BUG状态"
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
        <el-table-column prop="DemandName" label="需求名称" width="90" />
        <el-table-column prop="DeveloperId" label="开发" width="90" />
        <el-table-column prop="TesterId" label="测试" width="90" />
        <el-table-column prop="Title" label="BUG标题" width="90" />
        <el-table-column prop="Description" label="BUG描述" width="90" />
        <el-table-column prop="DefectType" label="附件" width="90" />
        <el-table-column prop="DefectType" label="严重程度" width="90" />
        <el-table-column prop="DefectState" label="BUG状态" width="90" />
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
              @click="handleUpdate(row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
