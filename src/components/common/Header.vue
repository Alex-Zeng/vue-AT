<template>
  <div>
    <el-menu class="el-menu-demo" mode="horizontal">
      <el-menu-item index="1">
        <div class="us">
          <i class="el-icon-user"></i>
          <span>{{username}}</span>
        </div>
      </el-menu-item>
      <el-submenu index="1">
        <template slot="title">
          <h6>
            <i class="el-icon-location"></i>
            <span slot="title">项目:{{$store.state.tableData.curreentPro.title}}</span>
          </h6>
        </template>

        <el-menu-item v-for="item in $store.state.tableData.projectData" :index="'1-'+item.id" :key="item.id"
                      @click="toProject(item)">
          <h5 slot="title">{{item.title}}</h5>
        </el-menu-item>
      </el-submenu>

      <el-menu-item index="2" @click="showNav('page')">
        <h6>
          <i class="el-icon-s-platform"></i>
          <span>页面对象PO</span>
        </h6>
      </el-menu-item>
      <el-menu-item index="3" @click="showNav('case')">
        <h6>
          <i class="el-icon-s-platform"></i>
          <span>用例</span>
        </h6>
      </el-menu-item>
      <el-menu-item index="4" @click="showNav('suit')">
        <h6>
          <i class="el-icon-s-platform"></i>
          <span>用例集</span>
        </h6>
      </el-menu-item>
      <el-menu-item index="5" @click="toFunction()">
        <h6>
          <i class="el-icon-star-on"></i>
          <span>操作方法</span>
        </h6>
      </el-menu-item>
      <el-menu-item index="6" @click="toEquipment()">
        <h6>
          <i class="el-icon-s-platform"></i>
          <span>设备列表</span>
        </h6>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>

  export default {
    name: 'Header',
    data() {
      return {
        username: '',
      }
    },
    methods: {
      toProject(proObject) {
        this.$store.dispatch('tableData/changeProjects', proObject)
      },
      showNav(nav) {
        this.$store.dispatch('asideNav/setNavVisible', nav)
      },
      toFunction() {
        this.$router.push({name: 'function'})
        this.$store.dispatch('tabViews/addView', {"route": this.$route, "title": ''})

      },
      toEquipment() {
        this.$router.push({name: 'equipment'})
        this.$store.dispatch('tabViews/addView', {"route": this.$route, "title": ''})
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
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
  }

  .xiang {
    height: 40px;
  }
</style>
