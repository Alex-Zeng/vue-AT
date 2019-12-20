<template>
  <div>
    <el-row :gutter="10">

      <el-col :span="6">
        <div class="grid-content bg-purple">执行总次数 : <span style="color: #dc47ff">{{data.total}}</span></div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">失败 : <span style="color: red">{{data.false_count}}</span></div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">成功 : <span style="color: chartreuse">{{data.success_count}}</span></div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">最后一次运行时间 : 3</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "test_static",
    props: ['data'],
  }
</script>

<style scoped>

</style>
