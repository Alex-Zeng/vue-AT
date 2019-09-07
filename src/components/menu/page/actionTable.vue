<template>
  <div>

    <el-table
      ref="multipleTable"
      :data="actsData.filter(data => !search || data.title.toLowerCase().includes(search.toLowerCase()))"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="ID"
        width="60">
      </el-table-column>
      <el-table-column
        prop="title"
        label="操作">
      </el-table-column>
      <el-table-column
        prop="fun_title"
        label="方法">
      </el-table-column>
      <el-table-column
        prop="ele_title"
        label="元素">
      </el-table-column>
      <el-table-column
        prop="update_datetime"
        label="更新时间">
      </el-table-column>
      <el-table-column
        align="right">
        <template slot="header" slot-scope="scope">
          <el-button type="primary" @click="operationDialog(2,'')">新增<i class="el-icon-plus el-icon--right"></i>
          </el-button>
          <el-input
            v-model="search"
            size="mini"
            placeholder="输入操作搜索"/>
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="operationDialog(1,scope.row)">编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="operationDialog(3,scope.row)">删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>
    <!--    添加-->

    <el-dialog title="添加" :visible.sync="addFormVisible">
      <el-form :model="form">
        <el-form-item label="标题：" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="操作方法：" :label-width="formLabelWidth">
          <el-select v-model="form.functionId" placeholder="请选择方法">
            <el-option v-for="fun in funsData" :label="fun.title" :value="fun.id" :key="fun.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作元素：" :label-width="formLabelWidth">
          <el-select v-model="form.elementId" placeholder="请选择元素">
            <el-option v-for="ele in elesData" :label="ele.title" :value="ele.id" :key="ele.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAction">确 定</el-button>
      </div>
    </el-dialog>

    <!--    编辑-->

    <el-dialog title="编辑" :visible.sync="editFormVisible">
      <el-form :model="form">
        <el-form-item label="标题：" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="操作方法：" :label-width="formLabelWidth">
          <el-select v-model="form.functionId" placeholder="请选择方法">
            <el-option v-for="fun in funsData" :label="fun.title" :value="fun.id" :key="fun.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作元素：" :label-width="formLabelWidth">
          <el-select v-model="form.elementId" placeholder="请选择元素">
            <el-option v-for="ele in elesData" :label="ele.title" :value="ele.id" :key="ele.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAction">确 定</el-button>
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
  import {getActionList, getElementList, getFunctionList, postAction, editAction, deleteAction} from '@/api/api'

  export default {
    name: 'actionTable',
    data() {
      return {
        search: '',
        eleTitle: '',
        actsData: [],
        elesData: [],
        funsData: [],
        currentElementId: '',
        addFormVisible: false,
        editFormVisible: false,
        deleteDialogVisible: false,
        form: {
          title: '',
          functionId: '',
          functionTitle: '',
          elementId: '',
          elementTitle: '',
        },
        formLabelWidth: '120px'
      }
    },

    methods: {
      operationDialog(ope, row) {
        switch (ope) {
          case 1:
            // 编辑

            this.editFormVisible = true
            this.currentActionId = row.id
            this.form.title = row.title
            this.form.elementTitle = row.ele_title
            this.form.elementId = row.ele_id
            this.form.functionTitle = row.fun_title
            this.form.functionId = row.fun_id
            console.log(this.form)
            break
          case 2:
            // 添加
            this.addFormVisible = true
            this.form.title = ''
            this.form.functionId = ''
            this.form.elementId = ''
            break
          case 3:
            // 删除
            this.deleteDialogVisible = true
            this.currentActionId = row.id
            this.eleTitle = '确定删除：' + row.title
            break
        }
      },
      addAction() {

        postAction(this.$route.params.id, this.$route.params.page_id, this.form).then(res => {
          if (res.status == 1) {
            this.addFormVisible = false
            this.$alert(res.msg)
            this.getActionData()
            this.search = ''
          } else {
            this.$alert(res.msg)
          }
        })
      },
      editAction() {
        editAction(this.$route.params.id, this.$route.params.page_id, this.currentActionId, this.form).then(res => {
          if (res.status == 1) {
            this.editFormVisible = false
            this.$alert(res.msg)
            this.getActionData()
            this.search = ''
          } else {
            this.$alert(res.msg)
          }
        })
      },
      delActions() {
        deleteAction(this.$route.params.id, this.$route.params.page_id, this.currentElementId).then(res => {
          if (res.status == 1) {
            this.deleteDialogVisible = false
            this.$alert(res.msg)
            this.getActionData()
            this.search = ''
          } else {
            this.$alert(res.msg)
          }
        })
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
      },
      getElementData() {
        let project_id = this.$route.params.id
        let pa_id = this.$route.params.page_id
        getElementList(project_id, pa_id).then(
          res => {
            this.elesData = res.data.data_list;
          },
          err => {
            console.log(err);
          }
        )
      },
      getFunctionData() {
        getFunctionList().then(
          res => {
            this.funsData = res.data.data_list;
          },
          err => {
            console.log(err);
          }
        )
      },
    },
    mounted() {
      if (this.$route.params.page_id) {
        this.getActionData()
        this.getElementData()
        this.getFunctionData()

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
