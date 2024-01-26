<script setup lang="ts">
defineOptions({
  name: "AutoTestLog"
});
</script>

<template>
  <div>
    <h1>自动化测试日志</h1>
    <p style="color: red">设计方案:</p>
    <ol style="color: red">
      <li>1）测试或相关人员维护代码到自动化测试仓库</li>
      <li>2）开发或运维合并/发布版本到测试环境</li>
      <li>
        3）hook触发CI工具，从自动化测试仓库，拉取最新自动化测试脚本(或定时触发)，并运行自动化测试脚本
      </li>
      <li>4）运行前，回调TTMS接口创建自动化测试报告，状态为测试中</li>
      <li>5）运行完成后，回调TTMS接口上传测试结果/报告，状态为测试完成</li>
      <li>6）通过TTMS面板（当前页面）查看自动化测试日志</li>
      <li>
        7）工具:Playwright，模板参考：<a
          href="https://github.com/chdxia/TTMS.AutoTestCase"
          target="_blank"
          style="text-decoration: underline; color: blue"
          >https://github.com/chdxia/TTMS.AutoTestCase</a
        >
      </li>
    </ol>
  </div>
</template>
