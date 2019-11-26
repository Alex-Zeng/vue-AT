<template>
  <el-row class="tac">
    <el-col :span="24">
      <list-card v-if="$store.state.asideNav.visible == 1"></list-card>
      <case-list v-if="$store.state.asideNav.visible == 2"></case-list>
      <case-suit-list v-if="$store.state.asideNav.visible == 3"></case-suit-list>
    </el-col>
  </el-row>
</template>

<script>

  import listCard from "../project/page/listCard";
  import caseList from "../project/case/caseList";
  import caseSuitList from "../project/caseSuit/caseSuitList";

  export default {
    name: "asideNav",
    components: {caseSuitList, listCard, caseList},
    data() {
      return {
      }
    },
  }
</script>

<style scoped>

</style>
