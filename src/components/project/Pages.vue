<template>
  <el-row>
    <el-col :span="4">
      <div class="grid-content bg-purple">
        <list-card :listData="pageList" @toPage="toPath"></list-card>
      </div>
    </el-col>
    <el-col :span="20">
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
    </el-col>
  </el-row>


</template>

<script>
  import elementTable from "./page/elementTable";
  import actionTable from "./page/actionTable";
  import listCard from "./page/listCard";

  export default {
    name: 'Pages',
    components: {listCard, elementTable, actionTable},

  }
</script>

<style>


</style>
