<template>
  <div>
    <div align="center">
      <h5>页面对象PO</h5>
      <el-button-group>
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="operationDialog(2,'')"></el-button>
        <el-button size="mini" type="primary" icon="el-icon-edit"
                   @click="operationDialog(1,currentPage)"></el-button>
        <el-button size="mini" type="primary" icon="el-icon-delete"
                   @click="operationDialog(3,currentPage)"></el-button>
      </el-button-group>
    </div>
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo">
      <el-menu-item v-for="page in pageList" :index="'1-'+proId+'-1-'+page.id" :key="page.id" @click="selectPage(page)">
        <span slot="title">{{page.title}}</span>
      </el-menu-item>
    </el-menu>
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
  import {getPageList, postPage, putPage, deletePage} from "@/api/api"
  import {mapState} from "vuex"

  export default {
    name: 'listCard',
    data() {
      return {
        search: '',
        currentPage: '页面',
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
    mounted() {
      this.getPageData()

    },
    watch: {
      proId() {
        this.getPageData()
      }
    },
    computed: {
      ...mapState({  //这里的...不是省略号了,是对象扩展符
        pageList: state => state.tableData.pageData,
        proId: state => state.tableData.curreentPro.id
      })
    },
    methods: {
      getPageData() {
        this.$store.dispatch('tableData/getPage')
      },

      addPage() {
        postPage(this.proId, this.form).then(res => {
          if (res.status == 1) {
            this.addForm = false
            this.getPageData()
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.$router.push({name: 'page'})
          } else {
            this.$alert(res.message)
          }
        })
      },
      editPage() {
        let page_id = this.$route.params.page_id
        putPage(this.proId, page_id, this.form).then(res => {
          if (res.status == 1) {
            this.editFormVisible = false
            this.$alert(res.message)
            this.getPageData()
            this.$router.push({name: 'page'})
          } else {
            this.$alert(res.message)
          }
        })
      },
      delPage() {
        let page_id = this.$route.params.page_id
        deletePage(this.proId, page_id).then(res => {
          if (res.status == 1) {
            this.deleteDialogVisible = false
            this.$alert(res.message)
            this.getPageData()
            this.$router.push({name: 'page'})
          } else {
            this.$alert(res.message)
          }
        })
      },
      selectPage(data) {
        this.currentPage = data.title
        this.$router.push({name: 'page', params: {id: this.proId, page_id: data.id}})
        this.$store.dispatch('tabViews/addView', {"route": this.$route, "title": ': ' + data.title})
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
    },
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
