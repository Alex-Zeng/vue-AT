<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-input
          placeholder="添加的项目名"
          v-model="form.title"
        >

        </el-input>
        <el-button @click="addProject">添加</el-button>

      </div>
      <div v-for="item in proData" :key="item.id" class="text item">
        <el-link type="primary" :underline="false" @click="toProject(item)"> {{item.title}}</el-link>
        <i class="el-icon-delete" style="float: right" @click="openDelDialog(item.id)"></i>
        <i class="el-icon-edit" style="float: right" @click="openEditDialog(item)"></i>
      </div>

    </el-card>
    <div>
      <el-dialog
        title="修改项目名"
        :visible.sync="centerDialogVisible"
        width="30%"
        :modal="false"
        center>
        <el-input
          placeholder="修改的项目名"
          v-model="editForm.title"
        ></el-input>
        <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editProject">确 定</el-button>
  </span>
      </el-dialog>
    </div>
    <div>
      <el-dialog
        title="确认删除"
        :visible.sync="centerDeleteDialogVisible"
        width="30%"
        :modal="false"
        center>

        <span slot="footer" class="dialog-footer">
    <el-button @click="centerDeleteDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="removeProject">确 定</el-button>
  </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {mapState} from "vuex"
  import {addNewProject, delProject, putProject} from "@/api/api"

  export default {
    name: 'projectList',
    data() {
      return {
        centerDialogVisible: false,
        centerDeleteDialogVisible: false,
        delId:'',
        form: {
          title: '',
        },
        editForm: {
          title: '',
          proId: '',
        }

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
        this.$store.dispatch('tableData/setNavVisible', 'home')
        this.$store.dispatch('tabViews/delAllViews')
      },
      addProject() {
        addNewProject(this.form).then(res => {
          if (res.status == 1) {
            this.form.title = ''
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.$store.dispatch('tableData/getProjects')
          } else {
            this.$alert(res.message)
          }
        })
      },

      removeProject() {
        delProject(this.delId).then(res => {
          if (res.status == 1) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.$store.dispatch('tableData/getProjects')
          } else {
            this.$alert(res.message)
          }
        })
        this.centerDeleteDialogVisible = false
      },
      editProject() {
        putProject(this.editForm.id, this.editForm).then(res => {
          if (res.status == 1) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.$store.dispatch('tableData/getProjects')
            this.centerDialogVisible = false
          } else {
            this.$alert(res.message)
          }
        })
      },
      openEditDialog(project) {
        this.editForm.id = project.id
        this.editForm.title = project.title
        this.centerDialogVisible = true
      },
      openDelDialog(id) {
        this.delId=id
        this.centerDeleteDialogVisible = true
      }
    }
  }
</script>
<style>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
  }

  .el-input {
    width: 230px;
  }

  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
