<template>
  <div>

    <el-table
      ref="multipleTable"
      :data="tableData.filter(data => !search || data.action_title.toLowerCase().includes(search.toLowerCase())|| data.rank.toLowerCase().includes(search.toLowerCase()))"
      fit highlight-current-row
      size="small"
      :default-sort="{prop: 'rank', order: 'ascending'}"

    >

      <el-table-column label="步骤" align="center" prop="rank" width="80">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model.number="row.rank" class="edit-input" size="mini"/>
          </template>
          <span v-else>{{ row.rank }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否跳过" align="center" prop="rank" width="120">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.skip"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            @change="confirmEdit(row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作页面" align="center">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <!--            <el-input v-model="row.fun_title" class="edit-input" size="mini"/>-->

            <el-select v-model="row.page_id" placeholder="请选择页面" size="mini"
                       @change="row.action_id='';getActionData(row.page_id);">
              <el-option v-for="page in pageData" :label="page.title" :value="page.id" :key="page.id"></el-option>
            </el-select>
          </template>
          <span v-else>{{ row.page_title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作方法" align="center">
        <template slot-scope="{row}">
          <template v-if="row.edit">

            <!--            <el-input v-model="row.fun_title" class="edit-input" size="mini"/>-->
            <el-select v-model="row.action_id" placeholder="请选择操作" size="mini">
              <el-option v-for="act in actData" :label="act.title" :value="act.id" :key="act.id"></el-option>
            </el-select>
          </template>
          <span v-else>{{ row.action_title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="输入参数" align="center">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.input_key" class="edit-input" size="mini"/>
          </template>
          <span v-else>{{ row.input_key }}</span>
        </template>
      </el-table-column>
      <el-table-column label="输出参数" align="center">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.output_key" class="edit-input" size="mini"/>
          </template>
          <span v-else>{{ row.output_key }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="update_datetime"
        label="更新时间"
        align="center">
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot="header" slot-scope="scope">
          <el-button type="primary" @click="addNew">新增<i class="el-icon-plus el-icon--right"></i>
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
              @click="row.edit=!row.edit;getActionData(row.page_id)"
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
        <el-form-item label="步骤：" :label-width="formLabelWidth">
          <el-input v-model.number="form.rank" placeholder="请输入 正整数且不重复"></el-input>
        </el-form-item>
        <el-form-item label="操作方法：" :label-width="formLabelWidth">
          <el-select v-model="form.page_id" placeholder="请选择页面" size="mini"
                     @change="form.action_id='';getActionData(form.page_id);">
            <el-option v-for="page in pageData" :label="page.title" :value="page.id" :key="page.id"></el-option>
          </el-select>
          <el-select v-model="form.action_id" placeholder="请选择方法" size="mini">
            <el-option v-for="act in actData" :label="act.title" :value="act.id" :key="act.id"></el-option>
          </el-select>
        </el-form-item>
                <el-form-item label="输入参数：" :label-width="formLabelWidth">
          <el-input v-model="form.input_key" placeholder="输入参数名,每个用例只允许一个输出参数名"></el-input>
        </el-form-item>
                <el-form-item label="输出参数：" :label-width="formLabelWidth">
          <el-input v-model="form.output_key" placeholder="输出参数名,每个用例只允许一个输出参数名"></el-input>
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
  import {postStep, getStepList, putStep, deleteStep, getActionList, getPageList} from '@/api/api'

  export default {
    name: 'stepTable',
    data() {
      return {
        search: '',
        tableData: [],
        actData: [],
        pageData: [],
        defaultDataId: '',
        addForm: false,
        form: {
          rank: '',
          page_id: '',
          action_id: '',
          input_key: '',
          output_key: '',
        },
        formLabelWidth: '120px',
      }

    },

    methods: {
      isRealNum(val) {
        // 先判定是否为number
        if (typeof val !== 'number') {
          return false;
        }
        if (!isNaN(val)) {
          return true;
        } else {
          return false;
        }
      },
      addNew() {
        this.addForm = true
        this.form.rank = parseInt(this.tableData[this.tableData.length - 1].rank) + 1
        this.form.page_id = ''
        this.form.action_id = ''
        this.form.input_key = ''
        this.form.output_key = ''
      },
      addData() {
        if (this.isRealNum(this.form.rank) != true) {
          this.$message({
            message: '步骤必须为正整数且不能重复',
            type: 'error'
          })
        }
        postStep(this.$route.params.id, this.$route.params.case_id, this.form).then(res => {
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
        row.originalActionId = row.action_id
        row.originalPageId = row.page_id
        row.originalSkip = row.skip

        putStep(this.$route.params.id, this.$route.params.case_id, row.id, row).then(res => {
          if (res.status == 1) {
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
            this.getTableData()
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        })
      },
      cancelEdit(row) {
        row.rank = row.originalRank
        row.action_id = row.originalActionId
        row.page_id = row.originalPageId
        row.skip = row.originalSkip

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
            deleteStep(this.$route.params.id, this.$route.params.case_id, rowId).then(res => {
              if (res.status == 1) {
                this.getTableData()
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
      },
      getActionData(pageId) {
        let projectId = this.$route.params.id
        getActionList(projectId, pageId).then(
          res => {
            this.actData = res.data.data_list
          },
          err => {
            console.log(err);
          }
        )
      },
      getPageData() {
        this.projectId = this.$route.params.id
        getPageList(this.projectId).then(
          res => {
            this.pageData = res.data.page_list
          },
          err => {
            console.log(err)
          }
        )
      },
      getTableData() {
        let projectId = this.$route.params.id
        let caseId = this.$route.params.case_id
        getStepList(projectId, caseId).then(
          res => {
            if (res.data.data_list.length > 0) {
              this.tableData = res.data.data_list.map(v => {
                this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
                v.originalRank = v.rank //  will be used when user click the cancel botton
                v.originalActionId = v.action_id
                v.originalPageId = v.page_id
                v.originalSkip = v.skip
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
    created() {
      if (this.$route.name == 'case') {
        this.getTableData()
        this.getPageData()

      }
    },
    watch: {
      '$route'(to, from) { //监听路由是否变化
        if (to.name == 'case') {// 判断条件1  判断传递值的变化
          this.getTableData()
          this.getPageData()
        }
      }
    }
  }
</script>

<style>

</style>
