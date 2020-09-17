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
      <el-menu-item index="1" >
        <el-popover
          width="480"
          trigger="click">
          <project-list></project-list>
          <el-button slot="reference" size="mini">项目:{{curPro.title}}</el-button>
        </el-popover>

      </el-menu-item>

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
      <el-menu-item index="8" @click="toMinicap()">
        <i class="el-icon-s-data"></i>
        <span>Minicap</span>
      </el-menu-item>

    </el-menu>

  </div>
</template>

<script>
  import projectList from "@/components/project/projectList"
  import {mapState} from "vuex"


  export default {
    name: 'Header',
    components: {projectList},
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

      // toProject(proObject) {
      //   this.$store.dispatch('tableData/changeProjects', proObject)
      //
      //   this.showNav('home')
      // },
      addProject() {
        addNewProject
      },
      showNav(nav) {
        switch (nav) {
          case 'page':
            this.$router.push({name: 'page', params: {id: this.curPro.id, page_id: "1"}})
            break;
          case 'case':
            this.$router.push({name: 'case', params: {id: this.curPro.id, case_id: "1"}})
            break;
          case 'suit':
            this.$router.push({name: 'suit', params: {id: this.curPro.id, suit_id: "1"}})
            break;
        }
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
      toMinicap() {

        this.$router.push({name: 'minicap'})
        this.$store.dispatch('tabViews/addView', {"route": this.$route, "title": ''})
        this.showNav('minicap')

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
