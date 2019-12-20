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

</style>
