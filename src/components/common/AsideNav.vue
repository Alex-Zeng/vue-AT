<template>
  <div>

    <el-menu class="el-menu-vertical-demo">
      <div class="us">
        <i class="el-icon-user"></i>
        <span>{{username}}</span>
      </div>
      <el-submenu index="1">
        <template slot="title">
          <h6>
            <i class="el-icon-location"></i>
            <span slot="title">项目</span>
          </h6>
        </template>

        <el-submenu v-for="item in $store.state.tableData.projectData" :index="'1-'+item.id" :key="item.id">
          <h5 slot="title">{{item.title}}</h5>
          <el-submenu :index="'1-'+item.id+'-1'">
            <template slot="title"><h5>PageObject</h5></template>
            <list-card :proId="item.id+''"></list-card>
          </el-submenu>
          <el-submenu :index="'1-'+item.id+'-2'">
            <template slot="title"><h5>用例</h5></template>
            <case-list :proId="item.id"></case-list>
          </el-submenu>
          <el-submenu :index="'1-'+item.id+'-3'">
            <template slot="title"><h5>用例集</h5></template>
            <case-suit-list :proId="item.id"></case-suit-list>
          </el-submenu>
        </el-submenu>
      </el-submenu>
      <el-menu-item index="2" @click="toFunction()">
        <h6>
          <i class="el-icon-star-on"></i>
          <span>操作方法</span>
        </h6>
      </el-menu-item>
      <el-menu-item index="3" @click="toEquipment()">
        <h6>
          <i class="el-icon-s-platform"></i>
          <span>设备列表</span>
        </h6>
      </el-menu-item>
    </el-menu>
  </div>
</template>


<script>
  import listCard from "../project/page/listCard";
  import caseList from "../project/case/caseList";
  import caseSuitList from "../project/caseSuit/caseSuitList";

  export default {
    name: 'AsideNav',
    components: {caseSuitList, listCard, caseList},
    data() {
      return {
        username: '',
      }
    },
    methods: {
      toFunction() {
        this.$router.push({name: 'function'})
      },
      toEquipment() {
        this.$router.push({name: 'equipment'})
      }
    },
    created() {
      this.username = sessionStorage.getItem('username')
      this.$store.dispatch('tableData/getProjects')
    }

  }
</script>
<style>
  @media screen and (max-height: 900px) {
    /*屏幕宽度小于640px时显示红色字体*/
    .el-menu-vertical-demo:not(.el-menu--collapse) {
      min-height: 720px;
      max-height: 720px;
    }
  }

  @media screen and (min-height: 910px) {
    /*屏幕宽度小于640px时显示红色字体*/
    .el-menu-vertical-demo:not(.el-menu--collapse) {
      min-height: 940px;
      max-height: 940px;
    }
  }

  .us {
    background-color: #fff;
    height: 60px;
    line-height: 60px;
    padding: 0 20px;
  }
</style>
