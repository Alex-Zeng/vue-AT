<template>
  <el-row class="ta">
    <el-col :span="24">
      <div>
        <suit-step-table></suit-step-table>
      </div>
    </el-col>
  </el-row>
</template>

<script>

  import suitStepTable from "./caseSuit/suitStepTable";

  export default {
    name: 'Cases',
    components: { suitStepTable},

  }
</script>

<style>
  @media screen and (max-height: 900px) {
    /*屏幕宽度小于640px时显示红色字体*/
    .ta {
      background-color: #fff;
      min-height: 700px;
      max-height: 860px;
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
