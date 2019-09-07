<template>
  <div> <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <router-link :to="{ name: 'pages', params: {}}">PageObject</router-link>
            </template>
            <div class="add-btn">
              <el-button type="primary" @click="operationDialog(2,'')">添加页面</el-button>
            </div>
            <el-divider></el-divider>
            <el-menu-item v-for="page in page_list" :key="page.id" :index="'1-'+page.id" @click="selectPage(page.id)">
              <div>
                <span>
                  {{page.title}}
                </span>
                <span class="pg_i">                <i class="el-icon-edit" @click="operationDialog(1,page.title)">
                </i>
                <i class="el-icon-delete" @click="operationDialog(3,page.title)">
                </i></span>
              </div>
            </el-menu-item>
          </el-submenu>
    <!--    添加-->

    <el-dialog title="添加" :visible.sync="addFormVisible">
      <el-form :model="form">
        <el-form-item label="页面名称：" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addPage">确 定</el-button>
      </div>
    </el-dialog>

    <!--    编辑-->

    <el-dialog title="编辑" :visible.sync="editFormVisible">
      <el-form :model="form">
        <el-form-item label="页面名称：" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPage">确 定</el-button>
      </div>
    </el-dialog>

    <!--      删除-->

    <el-dialog
      title="确认删除"
      :visible.sync="deleteDialogVisible"
      width="30%"
      center>
      <span>删除此页面的同时，也会删除element和action，确定删除吗？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="deleteDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="delPage">确 定</el-button>
  </span>
    </el-dialog></div>

</template>

<script>
  import {getPageList, postPage, putPage, deletePage} from "@/api/api";

  export default {
    name: 'pageOperation',
    data() {
      return {
        project_id: '',
        page_list: [],
        addFormVisible: false,
        editFormVisible: false,
        deleteDialogVisible: false,
        dialogTitle: '',
        form: {
          title: '',
        },
        formLabelWidth: '120px'

      }
    },
    methods: {
      addPage() {
        postPage(this.project_id, this.form).then(res => {
          if (res.status == 1) {
            this.addFormVisible = false
            this.$alert(res.msg)
            this.getPageData()
            this.$router.push({name: 'pages'})
          } else {
            this.$alert(res.msg)
          }
        })
      },
      editPage() {
        let page_id = this.$route.params.page_id
        putPage(this.project_id, page_id, this.form).then(res => {
          if (res.status == 1) {
            this.editFormVisible = false
            this.$alert(res.msg)
            this.getPageData()
            this.$router.push({name: 'pages'})
          } else {
            this.$alert(res.msg)
          }
        })
      },
      delPage() {
        let page_id = this.$route.params.page_id
        deletePage(this.project_id, page_id).then(res => {
          if (res.status == 1) {
            this.deleteDialogVisible = false
            this.$alert(res.msg)
            this.getPageData()
            this.$router.push({name: 'pages'})
          } else {
            this.$alert(res.msg)
          }
        })
      },
      selectPage(page_id) {
        this.$router.push({name: 'page', params: {page_id: page_id}})
      },
      operationDialog(ope,pagetitle) {
        switch (ope) {
          case 1:
            this.editFormVisible = true
            this.form.title = pagetitle
            break
          case 2:
            this.addFormVisible = true
            this.dialogTitle = '添加Page'
            this.form.title = ''
            break
          case 3:
            this.deleteDialogVisible = true
            break
        }
      },
      getPageData() {
        this.project_id = this.$route.params.id
        getPageList(this.project_id).then(
          res => {
            this.page_list = res.data.page_list;
            console.log(this.page_list)
          },
          err => {
            console.log(err)
          }
        )
      },
    },
    mounted() {
      this.getPageData();
    },
    watch: {
      '$route'(to, from) { //监听路由是否变化
        if (to.params.id != from.params.id) {
          this.getPageData();
        }
      }
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
