<template>
  <el-row class="ta">
    <el-col :span="4">
      <div>
        <aside-nav-tree></aside-nav-tree>
      </div>
    </el-col>
    <el-col :span="20">
      <div>
        <suit-step-table></suit-step-table>
      </div>
    </el-col>
  </el-row>
</template>

<script>

  import suitStepTable from "./caseSuit/suitStepTable";
  import asideNavTree from '@/components/common/asideNavTree'


  export default {
    name: 'Cases',
    components: {suitStepTable, asideNavTree},

  }
</script>

<style>

</style>
