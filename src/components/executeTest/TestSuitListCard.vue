<template>
  <div>
    <div align="center">
      <h5>选择执行设备</h5>
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
      <el-menu-item v-for="item in $store.state.tableData.equipmentData" :index="'1-'+proId+'-1-'+item.id" :key="item.id" @click="selectEquipment(item)">
        <span slot="title">{{item.title}}</span>
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
  import {getPageList, postPage, putPage, deletePage} from "@/api/api";

  export default {
    name: 'TestSuitListCard',
    data() {
      return {
        search: '',
        currentPage: '',
        pageList: [],
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
      getData() {
        this.$store.dispatch('tableData/getEquipmentData')
      },

      addPage() {
        postPage(this.proId, this.form).then(res => {
          if (res.status == 1) {
            this.addForm = false
            this.getData()
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.$router.push({name: 'page'})
          } else {
            this.$alert(res.msg)
          }
        })
      },
      editPage() {
        let page_id = this.$route.params.page_id
        putPage(this.proId, page_id, this.form).then(res => {
          if (res.status == 1) {
            this.editFormVisible = false
            this.$alert(res.msg)
            this.getData()
            this.$router.push({name: 'page'})
          } else {
            this.$alert(res.msg)
          }
        })
      },
      delPage() {
        let page_id = this.$route.params.page_id
        deletePage(this.proId, page_id).then(res => {
          if (res.status == 1) {
            this.deleteDialogVisible = false
            this.$alert(res.msg)
            this.getData()
            this.$router.push({name: 'page'})
          } else {
            this.$alert(res.msg)
          }
        })
      },
      selectEquipment(data) {
        this.currentPage = data.title
        this.$router.push({name: 'executeTest', params: {e_id: data.id}})
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
    mounted() {
      this.getData()
    },
    computed: {
      proId() {
        return this.$store.state.tableData.curreentPro.id
      }
    },
    watch: {
      proId() {
        this.getData()
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
