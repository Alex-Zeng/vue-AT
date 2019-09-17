<template>
  <div>
    <el-menu default-active="1-4-1" class="el-menu-vertical-demo">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span slot="title">项目</span>
        </template>

        <el-submenu v-for="pro in projects" :key="pro.id" :index="pro.id + '-1'">
          <span slot="title">{{pro.title}}</span>
          <el-menu-item :index="'1-' + pro.id + '-1'" @click="handleSelect(pro.id)">
            PageObject
          </el-menu-item>
          <el-menu-item :index="'1-' + pro.id + '-2'">用例</el-menu-item>
          <el-menu-item :index="'1-' + pro.id + '-3'">用例集</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-menu-item index="2" @click="toFunction()">
        <i class="el-icon-menu"></i>
        <span>操作方法</span>
      </el-menu-item>

    </el-menu>
  </div>
</template>
<style>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
</style>

<script>
  export default {
    props: ['projects'],
    data() {
      return {}
    },
    methods: {
      handleSelect(pro_id) {
        this.$router.push({name: 'pages', params: {id: pro_id}})

      },
      toFunction() {
        this.$router.push({name: 'function'})
      }
    }
  }
</script>
