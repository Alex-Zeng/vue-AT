<template>
  <el-menu
    class="el-menu-demo"
    mode="horizontal"
  >
    <el-menu-item index="1">欢迎：{{name}}</el-menu-item>

  </el-menu>
</template>

<script>
  import {getProjectList} from "../../api/api";

  export default {
    name: "Head",
    data() {
      return {
        name:""
      }
    },
    methods: {
      showMyselfs(params) {
        this.$emit('on-show', params);
      }
    },
    mounted() {
      this.name = sessionStorage.getItem('username')
    },
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
