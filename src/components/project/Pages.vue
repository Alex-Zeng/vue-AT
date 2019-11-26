<template>
  <el-row class="ta">
    <el-col :span="24">
      <div>
        <el-tabs  type="border-card" >

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
    mounted() {
      this.$store.dispatch('tableData/getPage')
    }

  }
</script>

<style>
    @media screen and (max-height: 900px) {
  /*屏幕宽度小于640px时显示红色字体*/
  .ta{
    min-height: 700px;
    max-height: 860px;
    background-color: #fff;
  }
  }
  @media screen and (min-height: 910px) {
  /*屏幕宽度小于640px时显示红色字体*/
  .ta {
    background-color: #fff;
    min-height: 880px;
    max-height: 1200px;
  }
  }


</style>
