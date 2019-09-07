<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
  >
    <el-menu-item index="1">欢迎：{{name}}</el-menu-item>
    <el-submenu index="2">
      <template slot="title">{{current_project}}</template>

      <el-menu-item v-for="project in project_list" :key="project.id">
        <div class='pro' style="width: auto " hover @click.prevent="selectProject(project.id)">
          {{project.title}}
        </div>
      </el-menu-item>
    </el-submenu>
    <el-button @click="toFunction">设备操作方法</el-button>
  </el-menu>
</template>

<script>
  import {getProjectList} from "../../api/api";

  export default {
    name: "Head",
    data() {
      return {
        activeIndex: '2',
        project_list: [],
        current_project: '选择项目',
        name: ''
      }
    },
    methods: {
      showMyselfs(params) {
        this.$emit('on-show', params);
      },
      selectProject(project_id,) {
        this.$router.push({name: 'pages', params: {id: project_id}})
      },
      toFunction(){
        this.$router.push({name: 'function'})
      }
    },
    mounted() {
      this.name = sessionStorage.getItem('username')
      getProjectList().then((res) => {
        this.project_list = res.data.project_list
        for (let i = 0; i < this.project_list.length; i++) {
          if (this.project_list[i].id == this.$route.params.id) {
            this.current_project = this.project_list[i].title
          }

        }
      })
    },
    watch: {
      '$route'(to, from) { //监听路由是否变化
        if (to.params.id) {// 判断条件1  判断传递值的变化
          for (let i = 0; i < this.project_list.length; i++) {
            if (this.project_list[i].id == this.$route.params.id) {
              this.current_project = this.project_list[i].title
            }

          }
        }
      }
    }


  }
</script>

<style scoped lang="less">
  .head_container {
    min-width: 1200px;
    background-color: #fff;
    height: 60px;
  }

  .head_icon {
    color: red;
    text-align: right;
  }

  .el-icon-bell {
    font-size: 20px;
  }

  .item {
    margin-top: 10px;
    /*margin-right: 40px;*/
  }

  .el-badge__content.is-fixed {
    top: 10px;
  }

  .pro:hover {
    color: red;
  }

  .clear:after {
    content: "";
    height: 0;
    line-height: 0;
    display: block;
    visibility: hidden;
    clear: both;
  }

  .head_right {
    float: right;
  }

  .info_icon {
    margin: 10px;
    /*float:left;*/
    display: inline-block;
    cursor: pointer;
  }

  .head_userInfo {
    /*float: left;*/
    display: inline-block;
    vertical-align: middle;
    padding-top: 10px;
  }
</style>
