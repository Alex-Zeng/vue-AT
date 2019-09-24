<template>
  <div>

    <el-table
      ref="multipleTable"
      :data="$store.state.tableData.actionData.filter(data => !search || data.title.toLowerCase().includes(search.toLowerCase()))"
      fit highlight-current-row
      size="small"
      border
    >
      <el-table-column
        label="ID"
        width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" label="操作名">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.title" class="edit-input" size="mini"/>
          </template>
          <span v-else>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" label="操作方法">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <!--            <el-input v-model="row.fun_title" class="edit-input" size="mini"/>-->
            <el-select v-model="row.fun_id" placeholder="请选择方法" size="mini">
              <el-option v-for="fun in $store.state.tableData.functionData" :label="fun.title" :value="fun.id"
                         :key="fun.id"></el-option>
            </el-select>
          </template>
          <span v-else>{{ row.fun_title }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" label="操作元素">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-select v-model="row.ele_id" placeholder="请选择元素" size="mini">
              <el-option v-for="ele in $store.state.tableData.elementData" :label="ele.title" :value="ele.id"
                         :key="ele.id"></el-option>
            </el-select>
          </template>
          <span v-else>{{ row.ele_title }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="update_datetime"
        label="更新时间">
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot="header" slot-scope="scope">
          <el-button type="primary" @click="addForm=true;getElementData;getFunctionData">新增<i
            class="el-icon-plus el-icon--right"></i>
          </el-button>
          <el-input
            v-model="search"
            size="mini"
            placeholder="输入操作搜索"/>
        </template>
        <template slot-scope="{row}">
          <div v-if="row.edit">
            <el-button
              type="success"
              size="mini"
              @click="confirmEdit(row)"
            >
              确定
            </el-button>
            <el-button
              size="mini"
              type="warning"
              @click="cancelEdit(row)"
            >
              取消
            </el-button>
          </div>

          <div v-else>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="row.edit=!row.edit"
            >
              编辑
            </el-button>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="deleteRow(row.id)"
            >
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!--    添加-->

    <el-dialog title="添加" :visible.sync="addForm">
      <el-form :model="form">
        <el-form-item label="标题：" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="操作方法：" :label-width="formLabelWidth">
          <el-select v-model="form.fun_id" placeholder="请选择方法">
            <el-option v-for="fun in $store.state.tableData.functionData" :label="fun.title" :value="fun.id"
                       :key="fun.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作元素：" :label-width="formLabelWidth">
          <el-select v-model="form.ele_id" placeholder="请选择元素">
            <el-option v-for="ele in $store.state.tableData.elementData" :label="ele.title" :value="ele.id"
                       :key="ele.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addForm = false;">取 消</el-button>
        <el-button type="primary" @click="addData">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import {postAction, editAction, deleteAction} from '@/api/api'

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
        addForm: false,
        form: {
          title: '',
          fun_id: '',
          functionTitle: '',
          ele_id: '',
          elementTitle: '',
        },
        formLabelWidth: '120px'
      }
    },

    methods: {

      addData() {

        postAction(this.$route.params.id, this.$route.params.page_id, this.form).then(res => {
          if (res.status == 1) {
            this.addForm = false
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.getData()
            this.search = ''
          } else {
            this.$alert(res.msg)
          }
        })
      },
      confirmEdit(row) {
        row.edit = false
        row.originalTitle = row.title
        row.originalElementTitle = row.elementTitle
        row.originalFunctionTitle = row.functionTitle
        editAction(this.$route.params.id, this.$route.params.page_id, row.id, row).then(res => {
          if (res.status == 1) {
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
            this.getData()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      },
      cancelEdit(row) {
        row.title = row.originalTitle
        row.elementTitle = row.originalElementTitle
        row.functionTitle = row.originalFunctionTitle
        row.edit = false

        this.$message({
          message: '放弃编辑',
          type: 'warning'
        })
      },
      deleteRow(rowId) {
        this.$confirm('确定删除?', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
            deleteAction(this.$route.params.id, this.$route.params.page_id, rowId).then(res => {
              if (res.status == 1) {
                this.getData()
                this.search = ''
                this.$message({
                  type: 'info',
                  message: res.msg
                });
              } else {
                this.$alert(res.msg)
              }
            })
          }
        ).catch(() => {
        })
      },
      getData() {
        this.$store.dispatch('tableData/getData', {
          "projectId": this.$route.params.id,
          "pageId": this.$route.params.page_id
        })
      },
      getElementData() {

        this.$store.dispatch('tableData/getElementData', {
          "projectId": this.$route.params.id,
          "pageId": this.$route.params.page_id
        })
      },
      getFunctionData() {
        this.$store.dispatch('tableData/getFunctionData')
      },
    },
    mounted() {
      if (this.$route.params.page_id) {
        this.getData()
        this.getFunctionData()
        this.getElementData()
      }
    },
    watch: {
      '$route'(to, from) { //监听路由是否变化
        if (to.params.page_id) {// 判断条件1  判断传递值的变化
          this.getData()
          this.getElementData()
        }
      }
    }
  }
</script>

<style>

</style>
