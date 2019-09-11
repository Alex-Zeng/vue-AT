<template>
  <el-row>
    <el-col :span="4">
      <div class="grid-content bg-purple">
        <list-card :listData="page_list" @toPath="toPath"></list-card>
      </div>
    </el-col>
    <el-col :span="20">
      <div>
        <el-tabs type="border-card">

          <!--    ----------------------------element面板开始----------------------------- -->
          <el-tab-pane label="元素信息">


            <element-table></element-table>
          </el-tab-pane>
          <!--    ----------------------------element面板结束----------------------------- -->

          <!--    ----------------------------action面板开始----------------------------- -->
          <el-tab-pane label="元素操作">
            <action-table></action-table>
          </el-tab-pane>
          <!--    ----------------------------action面板结束----------------------------- -->
        </el-tabs>

      </div>
    </el-col>
  </el-row>


</template>

<script>
  import elementTable from "./page/elementTable";
  import actionTable from "./page/actionTable";
  import listCard from "./page/listCard";
  import {getPageList, postPage, putPage, deletePage} from "@/api/api";

  export default {
    name: 'Pages',
    components: {listCard, elementTable, actionTable},
    data() {
      return {
        to_path_name:'page',
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
      toPath(id){
        this.$router.push({name: 'page',params:{page_id: id}})
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
      operationDialog(ope, pagetitle) {
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
      this.getPageData();
    },
    watch: {
      '$route'(to, from) { //监听路由是否变化
        if (to.params.id) {
          this.getPageData();
        }
      }
    }

  }
</script>

<style>


</style>
