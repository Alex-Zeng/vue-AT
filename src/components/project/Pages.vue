<template>
  <div>
    <el-tabs type="border-card">

      <!--    ----------------------------element面板开始----------------------------- -->
      <el-tab-pane label="元素信息">


        <element-table></element-table>
      </el-tab-pane>
      <!--    ----------------------------element面板结束----------------------------- -->

      <!--    ----------------------------action面板开始----------------------------- -->
      <el-tab-pane label="元素操作">
      <action-table></action-table>
      </el-tab-pane>
      <!--    ----------------------------action面板结束----------------------------- -->
    </el-tabs>

  </div>


</template>

<script>
  import elementTable from "./page/elementTable";
  import actionTable from "./page/actionTable";

  export default {
    name: 'Pages',
    components: {elementTable, actionTable},
    methods: {},

  }
</script>

<style>


</style>
