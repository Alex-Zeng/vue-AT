<template>
  <div>

    <el-table
      ref="multipleTable"
      :data="$store.state.tableData.actionData.filter(data => !search || data.title.toLowerCase().includes(search.toLowerCase()))"
      fit highlight-current-row
      size="small"
      :row-class-name="tableRowClassName"
    >
      <el-table-column
        label="所属页面"
        width="180">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-popover
              placement="left"
              title="选择页面"
              width="200"
              trigger="hover"
              content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
              <div>
                <select-tree :dataList="pageData" :row="scope.row" @addNodeClick="editNodeClick"></select-tree>
              </div>
              <el-button slot="reference" size="mini">{{scope.row.page_title?scope.row.page_title:'请选择页面'}}</el-button>
            </el-popover>

          </template>
          <span v-else>{{ scope.row.page_title }}</span>
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
      <el-table-column align="center" label="操作" width="200">
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
              @click="copyData(row)"
            >
              复制
            </el-button>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="row.edit=!row.edit"
            >
            </el-button>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-delete"
              @click="deleteRow(row.id)"
            >
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!--    添加-->

    <el-dialog title="添加" :visible.sync="addForm" style="text-align: left;">
      <el-form :model="form">

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
  import selectTree from '@/components/common/selectTree'
  import {mapState} from "vuex"

  export default {
    name: 'actionTable',
    components: {selectTree},
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
          fun_id: '',
          functionTitle: '',
          ele_id: '',
          elementTitle: '',
        },
        formLabelWidth: '120px'
      }
    },
    computed: {
      ...mapState({  //这里的...不是省略号了,是对象扩展符
        pageData: state => state.tableData.pageData,
      })
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
            this.$alert(res.message)
          }
        })
      }
      ,
      copyData(row) {
        postAction(this.$route.params.id, this.$route.params.page_id, row).then(res => {
          if (res.status == 1) {
            this.addForm = false
            this.$message({
              message: '复制成功',
              type: 'success'
            })
            this.getData()
            this.search = ''
          } else {
            this.$alert(res.message)
          }
        })
      },
      editNodeClick(data) {
        if (data.row) {
          data.row.page_title = data.treeData.title
          data.row.page_id = data.treeData.id
          data.row.action_id = ''
        }
        this.form.page_title = data.treeData.title
        this.form.page_id = data.treeData.id
        this.getActionData(data.treeData.id)
      },
      confirmEdit(row) {
        row.edit = false
        row.originalTitle = row.title
        row.originalElementTitle = row.ele_title
        row.originalFunctionTitle = row.fun_title
        editAction(this.$route.params.id, this.$route.params.page_id, row.id, row).then(res => {
          if (res.status == 1) {
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
            this.getData()
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        })
      }
      ,
      cancelEdit(row) {
        row.title = row.originalTitle
        row.ele_title = row.originalElementTitle
        row.fun_title = row.originalFunctionTitle
        row.edit = false

        this.$message({
          message: '放弃编辑',
          type: 'warning'
        })
      }
      ,
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
                  message: res.message
                });
              } else {
                this.$alert(res.message)
              }
            })
          }
        ).catch(() => {
        })
      }
      ,
      getData() {
        this.$store.dispatch('tableData/getActionData', this.$route.params.page_id)
      }
      ,
      getElementData() {

        this.$store.dispatch('tableData/getElementData', {
          "projectId": this.$route.params.id,
          "pageId": this.$route.params.page_id
        })
      }
      ,
      getFunctionData() {
        this.$store.dispatch('tableData/getFunctionData')
      }
      ,
      tableRowClassName({row, rowIndex}) {
        if (this.$route.query.actionId == row.id) {
          return 'danger-row';
        }
        return '';
      }
      ,
    }
    ,
    mounted() {
      if (this.$route.params.page_id) {
        this.getData()
        this.getFunctionData()
        this.getElementData()
      }
    }
    ,
    watch: {
      $route(to, from) { //监听路由是否变化
        if (to.params.page_id) {// 判断条件1  判断传递值的变化
          this.getData()
          this.getElementData()
        }
      }
    }
  }
</script>

<style>

  .el-table .danger-row {
    background: #ff7a62;
  }
</style>
