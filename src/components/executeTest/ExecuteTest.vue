<template>
  <div class="app-container">
    <el-table
      :data="datalist"
      fit highlight-current-row style="width: 100%"
      size="small"
      :row-key="getRowKeys"
      :expand-row-keys="expands"
      @row-click="rowClick"
      :default-sort="{prop: 'rank', order: 'ascending'}"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <div v-for=" item in props.row.test_cases"><span> 用例 {{item.title}} 执行中</span> <i class="el-icon-loading"></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="执行顺序" width="80">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.rank" class="edit-input" size="mini"/>
          </template>
          <span v-else>{{ row.rank }}</span>
        </template>
      </el-table-column>

      <el-table-column label="测试集ID" width="80">
        <template slot-scope="{row}">
          <span>{{ row.suit_id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="测试集">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-popover
              placement="bottom"
              title="标题"
              width="200"
              trigger="hover"
              content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
              <div>
                <select-tree :dataList="testCaseSuitData" :row="row" @addNodeClick="editNodeClick"></select-tree>
              </div>
              <el-button slot="reference">{{row.suit_title}}</el-button>
            </el-popover>

          </template>
          <span v-else>{{ row.suit_title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <span>执行中</span>
      </el-table-column>
      <el-table-column label="更新时间">
        <template slot-scope="{row}">
          <span>{{ row.update_datetime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="300">
        <template slot="header" slot-scope="scope">
          <el-button type="primary" @click="addNew" size="mini">新增</el-button>
        </template>
        <template slot-scope="{row}">

          <div v-if="row.edit ">
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
            <el-button-group>

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
                icon="el-icon-delete"
                @click="deleteRow(row.id)"
              >
                删除
              </el-button>
            </el-button-group>

          </div>
        </template>
      </el-table-column>
    </el-table>

    <!--    添加-->

    <el-dialog title="添加" :visible.sync="addForm" :modal="false">
      <el-form :model="form" :inline="true" class="demo-form-inline" size="mini" label-position="top">
        <el-form-item label="执行顺序：" :label-width="formLabelWidth">
          <el-input v-model="form.rank" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="测试集：" :label-width="formLabelWidth">
          <template slot-scope="scope">
            <el-popover
              placement="bottom"
              title="选择测试集"
              width="200"
              trigger="hover"
              content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
              <div>
                <select-tree :dataList="testCaseSuitData" @addNodeClick="editNodeClick"></select-tree>
              </div>
              <el-button slot="reference">{{form.suit_title?form.suit_title:'选择测试集'}}</el-button>
            </el-popover>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addForm = false">取 消</el-button>
        <el-button type="primary" @click="addData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {postES, editES, deleteES, startEquipment, getESList, startES} from '../../api/api'
  import {checkJson} from '@/utils/tableDate'
  import selectTree from '@/components/common/selectTree'
  import {mapState} from "vuex"

  export default {
    name: "ExecuteText",
    props: ['e_id'],
    components: {selectTree},
    data() {
      return {
        search: "",
        addForm: false,
        formLabelWidth: '140px',
        textareaWidth: '520px',
        running: 0,
        getRowKeys(row) {
          return row.id;
        },
        expands: [],
        form: {
          rank: "",
          suit_id: "",
          suit_title: "",
        }
      }
    },
    mounted() {
      this.$store.dispatch('tableData/getTestCaseSuitData')
      this.getList()

    },
    computed: {
      ...mapState({  //这里的...不是省略号了,是对象扩展符
        testCaseSuitData: state => state.tableData.testCaseSuitData,
        datalist: state => state.tableData.equipmentTestCaseSuitData,
      })
    },
    watch: {
      e_id() {
        this.getList()
      }
    },

    methods: {
      rowClick(row, column, even) {
        this.expands = [row.id]
      },
      addNew() {
        this.addForm = true
        this.form.suit_id = ''
        this.form.suit_title = ''
        this.form.rank = this.datalist.slice(-1)[0].rank + 1
      },
      editNodeClick(value) {
        let suitId = value.treeData.id
        let suitTitle = value.treeData.title
        if (value.row) {
          value.row.suit_id = suitId
          value.row.suit_title = suitTitle
        }
        this.form.suit_id = suitId
        this.form.suit_title = suitTitle
      },
      getList() {
        this.$store.dispatch('tableData/getESData', this.e_id)
      },
      addData() {
        if (checkJson(this.form.setting_args) == true) {
          postES(this.e_id, this.form).then(res => {
            if (res.status == 1) {
              this.search = ''
              this.addForm = false
              this.getList()
              this.$message(res.message)
            }
          })
        }
      },
      cancelEdit(row) {
        row.edit = false
        row.rank = row.originalRank
        row.test_case_suit_id = row.originalTestCaseSuitId
        this.$message({
          message: '放弃编辑',
          type: 'warning'
        })
      },
      confirmEdit(row) {
        row.edit = false

        editES(this.e_id, row.id, row).then(res => {
          if (res.status == 1) {
            row.originalRank = row.rank
            row.originalTestCaseSuitId = row.test_case_suit_id
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
            this.getList()
          } else {
            row.rank = row.originalRank
            row.test_case_suit_id = row.originalTestCaseSuitId
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        })
      },
      deleteRow(rowId) {
        this.$alert('确定删除?', '删除', {
          confirmButtonText: '确定',
        }).then(() => {
          deleteES(this.e_id, rowId).then(res => {
            if (res.status == 1) {
              this.getList()
              this.search = ''
              this.$message({
                type: 'info',
                message: res.message
              });
            } else {
              this.$alert(res.message)
            }
          })
        });
      },

      startEt(row) {
        startEquipment(row.id).then(res => {
          if (res.status == 1) {
            this.search = ''
            this.$message({
              type: 'info',
              message: res.message
            })
            row.status = 1
            row.session_id = res.data
          } else {
            this.$alert(res.message)
          }
        })
      },
    },
  }
</script>

<style>
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 150px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .el-dialog input {
    color: red;
  }

  .text-input {
    width: 360px;
  }
</style>
