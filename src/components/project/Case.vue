<template>
  <el-row class="ta">
        <el-col :span="4">
      <div>
        <aside-nav-tree></aside-nav-tree>
      </div>
    </el-col>
    <el-col :span="20">
      <div>
        <step-table></step-table>
      </div>
    </el-col>
  </el-row>
</template>

<script>

  import stepTable from "./case/stepTable";
  import asideNavTree from '@/components/common/asideNavTree'

  export default {
    name: 'Cases',
    components: { stepTable,asideNavTree},

  }
</script>

<style>

</style>
