<template>
  <div>
    <el-table
      ref="multipleTable"
      :data="pageList.filter(data => !search || data.title.toLowerCase().includes(search.toLowerCase()))"
      fit highlight-current-row
      style="width: 100%"
      max-height="600"
      size="mini"
      border
      @current-change="selectPage"
    >
      <el-table-column align="center" label="页面">
        <template slot="header" slot-scope="scope">
          <div slot="header" class="clearfix">
            <el-button size="mini" type="primary" icon="el-icon-plus" circle @click="operationDialog(2,'')"></el-button>
            <el-button size="mini" type="primary" icon="el-icon-edit" circle
                       @click="operationDialog(1,currentPage)"></el-button>
            <el-button size="mini" type="primary" icon="el-icon-delete" circle
                       @click="operationDialog(3,currentPage)"></el-button>
          </div>
          <el-input
            v-model="search"
            size="mini"
            placeholder="输入名称搜索"/>
        </template>
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!--    添加-->

    <el-dialog title="添加" :visible.sync="addForm">
      <el-form :model="form">
        <el-form-item label="页面名称：" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addForm = false">取 消</el-button>
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
      <span>删除此页面的同时，也会删除元素信息和元素操作，确定删除吗？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="deleteDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="delPage">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import {getPageList, postPage, putPage, deletePage} from "@/api/api";

  export default {
    name: 'listCard',
    data() {
      return {
        search: '',
        currentPage: '页面',
        projectId: '',
        pageList:[],
        defaultPageId: '',
        addForm: false,
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
        postPage(this.projectId, this.form).then(res => {
          if (res.status == 1) {
            this.addForm = false
            this.getPageData()
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.$router.push({name: 'pages'})
          } else {
            this.$alert(res.msg)
          }
        })
      },
      editPage() {
        let page_id = this.$route.params.page_id
        putPage(this.projectId, page_id, this.form).then(res => {
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
        deletePage(this.projectId, page_id).then(res => {
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
      selectPage(data) {
        this.currentPage = data.title
        this.$router.push({name: 'page', params: {page_id: data.id}})
      },
      operationDialog(ope, pagetitle) {
        switch (ope) {
          case 1:
            this.editFormVisible = true
            this.form.title = pagetitle
            break
          case 2:
            this.addForm = true
            this.dialogTitle = '添加Page'
            this.form.title = ''
            break
          case 3:
            this.deleteDialogVisible = true
            break
        }
      },
      getPageData() {
        this.projectId = this.$route.params.id
        getPageList(this.projectId).then(
          res => {
            this.pageList = res.data.page_list
            if (res.data.page_list.length > 0){
               this.defaultPageId = res.data.page_list[0].id
            }

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
        if (to.params.id != from.params.id) {// 判断条件1  判断传递值的变化
                  getPageList(to.params.id).then(
          res => {
            this.pageList = res.data.page_list
            if (res.data.page_list.length > 0){

              this.defaultPageId = res.data.page_list[0].id
              this.$router.push({name: 'page', params: {page_id: this.defaultPageId}})
              console.log(this.defaultPageId)
            }

          },
          err => {
            console.log(err)
          }
        )
        }
      }
    }
  }
</script>

<style>


  .clearfix {
    text-align: center;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

</style>
