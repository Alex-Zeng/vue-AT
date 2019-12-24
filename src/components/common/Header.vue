<template>
  <div>
    <el-menu class="el-menu-demo" mode="horizontal"
             text-color="#000"
             active-text-color="#409EFF">
      <el-menu-item index="0">
        <div>
          <i class="el-icon-user"></i>
          <span>{{username}}</span>
        </div>
      </el-menu-item>
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-picture-outline-round"></i>
          <span slot="title" >项目:{{curPro.title}}</span>
        </template>
        <el-menu-item v-for="item in proData" :index="'1-'+item.id" :key="item.id"
                      @click="toProject(item)">
          <h6 slot="title">{{item.title}}</h6>
        </el-menu-item>
      </el-submenu>

      <el-menu-item index="2" @click="showNav('page')">
        <i class="el-icon-s-help"></i>
        <span>页面对象PO</span>
      </el-menu-item>
      <el-menu-item index="3" @click="showNav('case')">
        <i class="el-icon-s-order"></i>
        <span>用例</span>
      </el-menu-item>
      <el-menu-item index="4" @click="showNav('suit')">
        <i class="el-icon-s-cooperation"></i>
        <span>用例集</span>
      </el-menu-item>
      <el-menu-item index="5" @click="toFunction()">
        <i class="el-icon-star-on"></i>
        <span>操作方法</span>
      </el-menu-item>
      <el-menu-item index="6" @click="toEquipment()">
        <i class="el-icon-s-platform"></i>
        <span>执行测试</span>
      </el-menu-item>
      <el-menu-item index="7" @click="toReport()">
        <i class="el-icon-s-data"></i>
        <span>测试报告</span>
      </el-menu-item>

    </el-menu>
  </div>
</template>

<script>
  import {mapState} from "vuex"
  export default {
    name: 'Header',
    data() {
      return {
        username: '',
      }
    },
    computed: {
      ...mapState({  //这里的...不是省略号了,是对象扩展符
        curPro: state => state.tableData.curreentPro,
        proData: state => state.tableData.projectData,
      })
    },
    methods: {

      toProject(proObject) {
        this.$store.dispatch('tableData/changeProjects', proObject)
        this.showNav('home')
      },
      showNav(nav) {
        this.$store.dispatch('tableData/setNavVisible', nav)
      },
      toFunction() {
        this.$router.push({name: 'function'})
        this.$store.dispatch('tabViews/addView', {"route": this.$route, "title": ''})
        this.showNav('function')

      },
      toEquipment() {
        this.$router.push({name: 'equipment'})
        this.$store.dispatch('tabViews/addView', {"route": this.$route, "title": ''})
        this.showNav('equipment')

      },
      toReport() {
        this.$router.push({name: 'report'})
        this.$store.dispatch('tabViews/addView', {"route": this.$route, "title": ''})
        this.showNav('report')

      },
    },
    created() {
      this.username = sessionStorage.getItem('username')
      this.$store.dispatch('tableData/getProjects')
    },

  }
</script>
<style>

</style>
