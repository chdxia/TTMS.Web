<script setup lang="ts">
defineOptions({
  name: "WorkHours"
});
</script>

<template>
  <div>
    <h1>工时统计</h1>
    <p style="color: red">设计方案:</p>
    <ol style="color: red">
      <li>
        工时按预计工时统计，且开发/测试比例按固定3:1分配，如需求的预计工时为4天，则开发算3天，测试算1天。仅供参考
      </li>
    </ol>
  </div>
</template>
