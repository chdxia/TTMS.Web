<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
  getVersionInfoPageList,
  createVersionInfo,
  updateVersionInfo,
  deleteVersionInfo
} from "@/api/versionInfo";

defineOptions({
  name: "VersionInfo"
});

// 查询参数
const listQuery = ref({
  Id: undefined,
  VertionTime: undefined,
  VersionNo: undefined,
  GroupId: undefined,
  VersionState: undefined,
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
  getVersionInfoPageList(listQuery.value).then(response => {
    list.value = response.Data.Items.map(item => {
      return item;
    });
  });
}

function handleReset() {
  listQuery.value = {
    Id: undefined,
    VertionTime: undefined,
    VersionNo: undefined,
    GroupId: undefined,
    VersionState: undefined,
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
</script>

<template>
  <div>
    <div>
      <el-input
        v-model="listQuery.VertionTime"
        placeholder="发版时间"
        style="width: 90px; margin-right: 10px"
      />
      <el-input
        v-model="listQuery.VersionNo"
        placeholder="版本号"
        style="width: 90px; margin-right: 10px"
      />
      <el-input
        v-model="listQuery.GroupId"
        placeholder="分组"
        style="width: 90px; margin-right: 10px"
      />
      <el-input
        v-model="listQuery.VersionState"
        placeholder="版本状态"
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
        <el-table-column prop="VersionTimeStart" label="版本时间" width="90" />
        <el-table-column prop="VersionNo" label="版本号" width="90" />
        <el-table-column prop="GroupId" label="分组" width="90" />
        <el-table-column prop="VersionState" label="版本状态" width="90" />
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
