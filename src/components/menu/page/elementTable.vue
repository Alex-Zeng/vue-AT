<template>
  <div>
    <el-table
      ref="multipleTable"
      :data="elesData.filter(data => !search || data.title.toLowerCase().includes(search.toLowerCase()))"
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
        label="元素名称">
      </el-table-column>
      <el-table-column
        prop="type"
        label="查找方式">
      </el-table-column>
            <el-table-column
        prop="loc"
        label="元素位置">
      </el-table-column>
      <el-table-column
        prop="update_datetime"
        label="更新时间">
      </el-table-column>

      <el-table-column
        align="right">
        <template slot="header" slot-scope="scope">
          <el-button type="primary" @click="operationDialog(2,'')">新增<i class="el-icon-plus el-icon--right"></i></el-button>
          <el-input
            v-model="search"
            size="mini"
            placeholder="输入元素名称搜索"/>
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
        <el-button type="primary" @click="addElement">确 定</el-button>
      </div>
    </el-dialog>

    <!--    编辑-->

    <el-dialog title="'编辑" :visible.sync="editFormVisible">
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
    <el-button type="primary" @click="delElements">确 定</el-button>
  </span>
    </el-dialog>
  </div>

</template>

<script>
  import {getElementList, postElement, editElement, deleteElement} from "@/api/api";

  export default {
    name: 'elementTable',
    data() {
      return {
        search: '',
        eleTitle: '',
        elesData: [],
        currentElementId: '',
        addFormVisible: false,
        editFormVisible: false,
        deleteDialogVisible: false,
        dialogTitle: '',
        form: {
          title: '',
          type: '',
          loc: '',
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
            this.currentElementId = row.id
            this.form.title = row.title
            this.form.type = row.type
            this.form.loc = row.loc


            break
          case 2:
            // 添加
            this.addFormVisible = true
            this.form.title = ''
            this.form.type = ''
            this.form.loc = ''
            break
          case 3:
            // 删除
            this.deleteDialogVisible = true
            this.currentElementId = row.id
            this.eleTitle = '确定删除：' + row.title
            break
        }
      },
      addElement() {

        postElement(this.$route.params.id, this.$route.params.page_id, this.form).then(res => {
          if (res.status == 1) {
            this.addFormVisible = false
            this.$alert(res.msg)
            this.getElementData()
            this.search = ''
          } else {
            this.$alert(res.msg)
          }
        })
      },
      editElement() {
        editElement(this.$route.params.id, this.$route.params.page_id, this.currentElementId, this.form).then(res => {
          if (res.status == 1) {
            this.editFormVisible = false
            this.$alert(res.msg)
            this.getElementData()
            this.search = ''
          } else {
            this.$alert(res.msg)
          }
        })
      },
      delElements() {
        deleteElement(this.$route.params.id, this.$route.params.page_id, this.currentElementId).then(res => {
          if (res.status == 1) {
            this.deleteDialogVisible = false
            this.$alert(res.msg)
            this.getElementData()
            this.search = ''
          } else {
            this.$alert(res.msg)
          }
        })
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
    },
    mounted() {
      if (this.$route.params.page_id) {
        this.getElementData()

      }
    },
    watch: {
      '$route'(to, from) { //监听路由是否变化
        if (to.params.page_id) {// 判断条件1  判断传递值的变化
          this.getElementData()
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
