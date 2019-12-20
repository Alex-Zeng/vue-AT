<template>
  <el-row class="ta">
    <el-col :span="24">
      <div>
        <step-table></step-table>
      </div>
    </el-col>
  </el-row>
</template>

<script>

  import stepTable from "./case/stepTable";

  export default {
    name: 'Cases',
    components: { stepTable},

  }
</script>

<style>

</style>
