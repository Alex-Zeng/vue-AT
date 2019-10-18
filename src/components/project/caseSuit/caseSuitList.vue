<template>
  <div>

    <div align="center">
      <h5>用例集</h5>
      <el-button-group>
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="operationDialog(2,'')"></el-button>
        <el-button size="mini" type="primary" icon="el-icon-edit"
                   @click="operationDialog(1,currentData)"></el-button>
        <el-button size="mini" type="primary" icon="el-icon-delete"
                   @click="operationDialog(3,currentData)"></el-button>
      </el-button-group>
    </div>

    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
    >
      <el-menu-item v-for="item in suitList" :index="'1-' + proId + '-3' + item.id" :key="item.id"
                    @click="selectData(item)">
        <span slot="title">{{item.title}}</span>
      </el-menu-item>

    </el-menu>
    <!--    添加-->

    <el-dialog title="添加" :visible.sync="addForm" style="text-align: left;">
      <el-form :model="form">
        <el-form-item label="用例集名称：" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addForm = false">取 消</el-button>
        <el-button type="primary" @click="addData">确 定</el-button>
      </div>
    </el-dialog>

    <!--    编辑-->

    <el-dialog title="编辑" :visible.sync="editFormVisible">
      <el-form :model="form">
        <el-form-item label="用例集名称：" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editData">确 定</el-button>
      </div>
    </el-dialog>

    <!--      删除-->

    <el-dialog
      title="确认删除"
      :visible.sync="deleteDialogVisible"
      width="30%"
      center>
      <span>确定删除{{currentData}}用例集吗？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="deleteDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="delData">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import {getSuitList, postSuit, putSuit, deleteSuit} from "@/api/api";

  export default {
    name: 'caseSuitList',
    data() {
      return {
        search: '',
        currentData: '用例集',
        suitList: [],
        defaultDataId: '',
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

      addData() {
        postSuit(this.proId, this.form).then(res => {
          if (res.status == 1) {
            this.addForm = false
            this.getSuitData()
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.$router.push({name: 'case'})
          } else {
            this.$alert(res.msg)
          }
        })
      },
      editData() {
        let data_id = this.$route.params.suit_id
        putSuit(this.proId, data_id, this.form).then(res => {
          if (res.status == 1) {
            this.editFormVisible = false
            this.$alert(res.msg)
            this.getSuitData()
            this.$router.push({name: 'suit'})
          } else {
            this.$alert(res.msg)
          }
        })
      },
      delData() {
        let data_id = this.$route.params.suit_id
        deleteSuit(this.proId, data_id).then(res => {
          if (res.status == 1) {
            this.deleteDialogVisible = false
            this.$alert(res.msg)
            this.getSuitData()
            this.$router.push({name: 'suit'})
          } else {
            this.$alert(res.msg)
          }
        })
      },
      selectData(data) {
        this.currentData = data.title
        this.$router.push({name: 'suit', params: {id: this.proId, suit_id: data.id}})
        this.$store.dispatch('tabViews/addView', {"route": this.$route, "title": ': ' + data.title})
      },
      operationDialog(ope, datatitle) {
        switch (ope) {
          case 1:
            this.editFormVisible = true
            this.form.title = datatitle
            break
          case 2:
            this.addForm = true
            this.dialogTitle = '添加用例集'
            this.form.title = ''
            break
          case 3:
            this.deleteDialogVisible = true
            break
        }
      },
      getSuitData() {
        getSuitList(this.proId).then(
          res => {
            this.suitList = res.data.data_list
            if (res.data.data_list.length > 0) {
              this.defaultDataId = res.data.data_list[0].id
            }

          },
          err => {
            console.log(err)
          }
        )
      },
    },
    mounted() {
      this.getSuitData()
    },
    computed: {
      proId() {
        return this.$store.state.tableData.curreentPro.id
      }
    },
    watch: {
      proId() {
        this.getSuitData()
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
