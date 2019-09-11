<template>
<el-card class="box-card">
  <div slot="header" class="clearfix" >
    <el-button  size="mini" type="primary" icon="el-icon-plus" circle @click="operationDialog(2,'')"></el-button>
    <el-button  size="mini" type="primary" icon="el-icon-edit" circle @click="operationDialog(1,current_page)"></el-button>
    <el-button  size="mini" type="primary" icon="el-icon-delete" circle @click="operationDialog(3,current_page)"></el-button>
  </div>
  <div v-for="data in listData" :key="data.id" class="text item">
<!--    <el-link :underline="false" @click="router_to(data.id);current_page=data.title;" >{{data.title}}</el-link>-->
    <el-button round size="mini" :underline="false" @click="router_to(data.id);current_page=data.title;" >{{data.title}}</el-button>
  </div>

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
    </el-dialog>
</el-card>


</template>

<script>
  import {getPageList, postPage, putPage, deletePage} from "@/api/api";

  export default {
    name: 'listCard',
    props: ['listData','to_name','to_params'],
    data() {
      return {
        current_page:'页面',
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
      router_to(id){

        this.$emit('toPath',id)
      },

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
          },
          err => {
            console.log(err)
          }
        )
      },
    },
    mounted() {
      if (this.$route.params.page_id) {
         this.getPageData();

      }
    },
    watch: {
      '$route'(to, from) { //监听路由是否变化
        if (to.params.page_id) {// 判断条件1  判断传递值的变化
          this.getPageData()
        }
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
  .clearfix{
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

  .box-card {
    width: 180px;
    text-align: left;
  }
</style>
