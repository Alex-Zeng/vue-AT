<template>
  <div>

    <el-table
      ref="multipleTable"
      :data="tableData.filter(data => !search || data.case_title.toLowerCase().includes(search.toLowerCase())|| data.rank.toLowerCase().includes(search.toLowerCase()))"
      fit highlight-current-row
      size="small"
      border
      :default-sort="{prop: 'rank', order: 'ascending'}"

    >

      <el-table-column label="执行顺序" align="center" prop="rank">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.rank" class="edit-input" size="mini"/>
          </template>
          <span v-else>{{ row.rank }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用例" align="center" prop="case_title">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <!--            <el-input v-model="row.fun_title" class="edit-input" size="mini"/>-->

            <el-select v-model="row.case_id" placeholder="请选择用例" size="mini"
                       @change="getCaseData();">
              <el-option v-for="test_case in caseData" :label="test_case.title" :value="test_case.id"
                         :key="test_case.id"></el-option>
            </el-select>
          </template>
          <span v-else>{{ row.case_title }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="update_datetime"
        label="更新时间"
        align="center">
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot="header" slot-scope="scope">
          <el-button type="primary" @click="addForm=true">新增<i class="el-icon-plus el-icon--right"></i>
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
              @click="row.edit=!row.edit;getCaseData()"
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
        <el-form-item label="执行顺序：" :label-width="formLabelWidth">
          <el-input v-model="form.rank" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用例：" :label-width="formLabelWidth">
          <el-select v-model="form.case_id" placeholder="请选择用例" size="mini"
                     @change="getCaseData();">
            <el-option v-for="item in caseData" :label="item.title" :value="item.id" :key="item.id"></el-option>
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
  import {postSuitStep, getSuitStepList, putSuitStep, deleteSuitStep, getCaseList} from '@/api/api'

  export default {
    name: 'suitStepTable',
    data() {
      return {
        search: '',
        tableData: [],
        caseData: [],
        defaultDataId: '',
        addForm: false,
        form: {
          rank: '',
          case_id: '',
        },
        formLabelWidth: '120px'
      }
    },

    methods: {
      addData() {
        postSuitStep(this.$route.params.id, this.$route.params.suit_id, this.form).then(res => {
          if (res.status == 1) {
            this.addForm = false
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.getTableData()
            this.search = ''
          } else {
            this.$alert(res.message)
          }
        })
      },
      confirmEdit(row) {
        row.edit = false
        row.originalRank = row.rank
        row.originalCaseTitle = row.case_title
        putSuitStep(this.$route.params.id, this.$route.params.suit_id, row.id, row).then(res => {
          if (res.status == 1) {
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
            this.getTableData()
          } else {

          }
        })

      },
      cancelEdit(row) {
        row.rank = row.originalRank
        row.case_title = row.originalCaseTitle
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
            deleteSuitStep(this.$route.params.id, this.$route.params.suit_id, rowId).then(res => {
              if (res.status == 1) {
                this.getTableData()
                this.search = ''
                this.$message({
                  type: 'info',
                  message: res.message
                });
              }
            })
          }
        )
      },

      getCaseData() {
        this.projectId = this.$route.params.id
        getCaseList(this.projectId).then(
          res => {
            this.caseData = res.data.data_list
          },
          err => {
            console.log(err)
          }
        )
      },
      getTableData() {
        let projectId = this.$route.params.id
        let dataId = this.$route.params.suit_id
        getSuitStepList(projectId, dataId).then(
          res => {
            if (res.data.data_list.length > 0) {
              this.tableData = res.data.data_list.map(v => {
                this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
                v.originalRank = v.rank //  will be used when user click the cancel botton
                v.originalCaseTitle = v.case_title
                return v
              })
            } else {
              this.tableData = res.data.data_list
            }

          },
          err => {
            console.log(err);
          }
        )
      }
    },
    mounted() {
      if (this.$route.name == 'suit') {
        this.getTableData()
        this.getCaseData()

      }
    },
    watch: {
      '$route'(to, from) { //监听路由是否变化
        if (to.name == 'suit') {// 判断条件1  判断传递值的变化
          this.getTableData()
          this.getCaseData()
        }
      }
    }
  }
</script>

<style>

</style>
