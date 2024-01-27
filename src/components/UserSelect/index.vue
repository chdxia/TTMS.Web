<script setup lang="ts">
import { ref, defineEmits } from "vue";
import { ElMessage } from "element-plus";
import { getUserPageList } from "@/api/user";

const emits = defineEmits(["selected-user-id"]);

const listQuery = ref({
  AccountOrUserName: undefined,
  PageIndex: 1,
  PageSize: 5
});
const list = ref([]);
const totalCount = ref(0);
const listLoading = ref(false);
const isInputFocused = ref(false);

function handleFilter() {
  listLoading.value = true;
  getUserPageList(listQuery.value).then(res => {
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
  emits("selected-user-id", undefined);
  isInputFocused.value = true;
  listQuery.value.PageIndex = 1;
  listQuery.value.PageSize = 5;
  handleFilter();
}

function handleRowClick(row) {
  emits("selected-user-id", row.Id);
}
</script>

<template>
  <div>
    <el-input
      v-model="listQuery.AccountOrUserName"
      placeholder="请选择"
      clearable
      @clear="handleQueryReset()"
      @keyup.enter="handleQueryReset()"
      @focus="handleQueryReset()"
      @blur="isInputFocused = false"
      style="position: relative"
    />
    <template v-if="isInputFocused">
      <div class="search-results">
        <el-table
          :data="list"
          v-loading="listLoading"
          border
          style="width: 500px"
          @row-click="handleRowClick"
        >
          <el-table-column prop="Account" label="账号" />
          <el-table-column prop="UserName" label="用户名" />
        </el-table>
        <el-pagination
          v-model:current-page="listQuery.PageIndex"
          v-model:page-size="listQuery.PageSize"
          :small="true"
          :total="totalCount"
          layout="total, prev, pager, next, jumper"
          style="margin-top: 10px"
          @current-change="handleFilter()"
        />
        <div @click.stop />
      </div>
    </template>
  </div>
</template>

<style>
.search-results {
  position: absolute;
  z-index: 999;
  background-color: #fff;
  border: 1px solid #ccc;
  width: 100%;
  top: 100%;
  left: 0;
}
</style>
