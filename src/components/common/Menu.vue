<template>
  <div class="menu_container">
    <el-row class="tac">
      <el-col :span="24">
        <h5>默认颜色</h5>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
        >
          <page-operation></page-operation>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <router-link :to="{ name: 'pages', params: {}}">用例</router-link>
            </template>
            <el-menu-item index="2-1">添加</el-menu-item>
            <el-menu-item index="2-2">编辑</el-menu-item>
            <el-menu-item index="2-3">删除</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <router-link :to="{ name: 'pages', params: {}}">用例集</router-link>
            </template>
            <el-menu-item index="3-1">添加</el-menu-item>
            <el-menu-item index="3-2">编辑</el-menu-item>
            <el-menu-item index="3-3">删除</el-menu-item>
          </el-submenu>

        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {getPageList, postPage, putPage, deletePage} from "../../api/api";
  import pageOperation from '../menu/page/pageOperation';

  export default {
    name: 'Menu',
    data() {
      return{}
    },
    components: {pageOperation},
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
    }
  }

</script>

<style lang='less' scoped>
  .menu_bg {
    height: 60px;
    background-color: #3899cc;
  }

  .el-submenu {
    text-align: left;

    .add-btn {
      text-align: center;
    }
  }

  .el-menu-item {
    height: 30px;
    line-height: 30px;
    text-align: right;

    .pg_i {
      text-align: right;
      padding-left: 40px;
    }

    i:hover {
      color: red;
    }
  }


  .menu_container {
    background: #fff;
    position: relative;
    left: 0;

    .tac {
      height: 100%;

      .el-menu-vertical-demo {
        border: none;
        min-width: 200px;
      }
    }
  }
</style>
