<template>
  <div>
    <div style="margin-top: 20px">
      <el-button type="primary" @click="operationDialog(2,'')">添加<i class="el-icon-plus el-icon--right"></i></el-button>
      <el-button type="primary" icon="el-icon-edit" circle @click="operationDialog(1,multipleSelection)"></el-button>
      <el-button type="danger" icon="el-icon-delete" circle @click="operationDialog(3,multipleSelection)"></el-button>
      <el-button @click="toggleSelection()">取消选择</el-button>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        v-for="(col,index) in tableCol"
        :prop="col.prop"
        :label="col.label"
        :key="index">
      </el-table-column>

    </el-table>
    <!--    添加-->

    <el-dialog title="添加" :visible.sync="addFormVisible">
      <el-form :model="form">
        <el-form-item label="元素标题：" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="查找方式：" :label-width="formLabelWidth">
          <el-input v-model="form.type" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="元素位置：" :label-width="formLabelWidth">
          <el-input v-model="form.loc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAction">确 定</el-button>
      </div>
    </el-dialog>

    <!--    编辑-->

    <el-dialog :title="'编辑ID-' + form.id" :visible.sync="editFormVisible">
      <el-form :model="form">
        <el-form-item label="元素标题：" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="查找方式：" :label-width="formLabelWidth">
          <el-input v-model="form.type" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="元素位置：" :label-width="formLabelWidth">
          <el-input v-model="form.loc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editElement">确 定</el-button>
      </div>
    </el-dialog>

    <!--      删除-->

    <el-dialog
      title="删除"
      :visible.sync="deleteDialogVisible"
      width="30%"
      center>
      <span>{{eleTitle}}</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="deleteDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="delActions">确 定</el-button>
  </span>
    </el-dialog>
  </div>

</template>

<script>
  import {getActionList} from "@/api/api";

  export default {
    name: 'pageTable',
    props: ['tableCol', 'tableData'],
    data() {
      return {
        eleTitle: '',
        actsData: [],
        multipleId: [],
        addFormVisible: false,
        editFormVisible: false,
        deleteDialogVisible: false,
        dialogTitle: '',
        form: {
          id: '',
          title: '',
          type: '',
          loc: '',
        },
        formLabelWidth: '120px'
      }
    },

    methods: {

      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(this.multipleSelection)
      },
      operationDialog(ope, multipleSelection) {
        switch (ope) {
          case 1:
            // 编辑
            if (multipleSelection.length == 1) {
              this.editFormVisible = true
              this.form.id = multipleSelection[0].id
              this.form.title = multipleSelection[0].title
              this.form.type = multipleSelection[0].type
              this.form.loc = multipleSelection[0].loc
            } else {
              this.$alert("请选择一条数据")
            }

            break
          case 2:
            // 添加
            this.addFormVisible = true
            this.form.id = ''
            this.form.title = ''
            this.form.type = ''
            this.form.loc = ''
            break
          case 3:
            // 删除
            this.deleteDialogVisible = true
            let eleTitles = '确定删除：'
            console.log(multipleSelection.length)
            for (let i = 0; i < multipleSelection.length; i++) {
              eleTitles += multipleSelection[i].id + '-' +multipleSelection[i].title + ','
            }
            this.eleTitle = eleTitles
            break
        }
      },
      getActionData() {
        let project_id = this.$route.params.id
        let pa_id = this.$route.params.page_id
        getActionList(project_id, pa_id).then(
          res => {
            this.actsData = res.data.data_list;
          },
          err => {
            console.log(err);
          }
        )
      }
    },
    mounted() {
      if (this.$route.params.page_id) {
        this.getActionData()

      }
    },
    watch: {
      '$route'(to, from) { //监听路由是否变化
        if (to.params.page_id) {// 判断条件1  判断传递值的变化
          this.getActionData()
        }
      }
    }
  }
</script>

<style>
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }

  .el-dropdown-menu__item {
    padding: 0
  }

  .pg {
    padding: 0 20px
  }
</style>
