<template>
  <div>
    <div align="center">
      <h5>用例</h5>
      <el-button-group>
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="operationDialog(2,'')"></el-button>
        <el-button size="mini" type="primary" icon="el-icon-edit"
                   @click="operationDialog(1,currentCase)"></el-button>
        <el-button size="mini" type="primary" icon="el-icon-delete"
                   @click="operationDialog(3,currentCase)"></el-button>
      </el-button-group>
    </div>
    <el-input
      placeholder="输入关键字进行过滤"
      v-model="filterText">
    </el-input>
    <el-tree
      class="filter-tree"
      :data="caseList"
      node-key="id"
      default-expand-all
      :filter-node-method="filterNode"
      draggable
      @node-click="selectData"
      @node-drop="handleDrop"
      :expand-on-click-node="false"
      :highlight-current="true"
      ref="tree">
    </el-tree>
    <!--    添加-->

    <el-dialog title="添加" :visible.sync="addForm">
      <el-form :model="form">
        <el-form-item label="用例名称：" :label-width="formLabelWidth">
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
        <el-form-item label="用例名称：" :label-width="formLabelWidth">
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
      <span>确定删除{{currentCase}}用例吗？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="deleteDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="delData">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import {getCaseList, postCase, putCase, deleteCase} from "@/api/api";
  export default {
    name: 'caseList',
    data() {
      return {
        filterText: '',
        search: '',
        currentCase: '用例',
        caseList: [],
        defaultDataId: '',
        addForm: false,
        editFormVisible: false,
        deleteDialogVisible: false,
        defaultCaseId: '',
        dialogTitle: '',
        form: {
          title: '',

        },
        formLabelWidth: '120px'

      }
    },

    methods: {
      handleDrop(draggingNode, dropNode, dropType, ev) {
        let case_id = draggingNode.data.id
        let pId = 0
        if (dropType == 'inner'){
          pId = dropNode.data.id
        }else {
          if(dropNode.parent.data.id){
              pId = dropNode.parent.data.id
            }else {
            pId = 0
          }
        }
        putCase(this.proId, case_id, {"parentId": pId})
      },
      addData() {
        postCase(this.proId, this.form).then(res => {
          if (res.status == 1) {
            this.addForm = false
            this.getCaseData()
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.$router.push({name: 'case'})
          } else {
            this.$alert(res.message)
          }
        })
      },
      editData() {
        let case_id = this.$route.params.case_id
        putCase(this.proId, case_id, this.form).then(res => {
          if (res.status == 1) {
            this.editFormVisible = false
            this.$alert(res.message)
            this.getCaseData()
            this.$router.push({name: 'case'})
          } else {
            this.$alert(res.message)
          }
        })
      },
      delData() {
        let case_id = this.$route.params.case_id
        deleteCase(this.proId, case_id).then(res => {
          if (res.status == 1) {
            this.deleteDialogVisible = false
            this.$alert(res.message)
            this.getCaseData()
            this.$router.push({name: 'case'})
          } else {
            this.$alert(res.message)
          }
        })
      },
      selectData(data) {
        this.currentCase = data.title
        this.$emit('clickNode', data)
        // console.log(data)
        // this.$router.push({name: 'case', params: {id: this.proId, case_id: data.id}})
        // this.$store.dispatch('tabViews/addView', {"route": this.$route, "title": ': ' + data.title})
      },
      operationDialog(ope, casetitle) {
        switch (ope) {
          case 1:
            this.editFormVisible = true
            this.form.title = casetitle
            break
          case 2:
            this.addForm = true
            this.dialogTitle = '添加Case'
            this.form.title = ''
            break
          case 3:
            this.deleteDialogVisible = true
            break
        }
      },
      getCaseData() {
        getCaseList(this.proId).then(
          res => {
            this.caseList = res.data.data_list
            if (res.data.data_list.length > 0) {
              this.defaultCaseId = res.data.data_list[0].id
            }

          },
          err => {
            console.log(err)
          }
        )
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      }
    },
    mounted() {
      this.getCaseData()
    },
    computed: {
      proId() {
        return this.$store.state.tableData.curreentPro.id
      }
    },
    watch: {
      proId() {
        this.getCaseData()
      },
      filterText(val) {
        this.$refs.tree.filter(val);
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
