<template>
  <div>

    <el-table
      ref="multipleTable"
      :data="tableData.filter(data => !search || data.case_title.toLowerCase().includes(search.toLowerCase())|| data.rank.toLowerCase().includes(search.toLowerCase()))"
      fit highlight-current-row
      size="small"
      :row-key="getRowKeys"
      :expand-row-keys="expands"
      @row-click="rowClick"
      :row-class-name="tableRowClassName"
      :default-sort="{prop: 'rank', order: 'ascending'}"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="输入参数:">
              <template v-if="props.row.edit">
                <el-input
                  styel="width: 600px"
                  class="text-input"
                  type="textarea"
                  :autosize="{ minRows: 6, maxRows: 8}"
                  placeholder='请输入参数 json形式,如
                {
                "username":["test001","test002"],
                "password":["123456","abcdef"]
                }'
                  v-model="props.row.input_args">
                </el-input>
              </template>
              <div v-else>
                <div v-for="(v,k) in JSON.parse(props.row.input_args)">
                  <h5>{{k}}:</h5>
                  <div v-for="item  in v">{{item}}</div>
                </div>
              </div>

            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="执行顺序" align="center" prop="rank" width="80">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.rank" class="edit-input" size="mini"/>
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
      <el-table-column label="用例" align="center" prop="case_title" width="200">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-popover
              placement="bottom"
              title="选择用例"
              width="200"
              trigger="hover"
              content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
              <div>
                <select-tree :dataList="caseData" :row="row" @addNodeClick="editNodeClick"></select-tree>
              </div>
              <el-button slot="reference">{{row.case_title}}</el-button>
            </el-popover>
          </template>
          <el-link type="primary" :underline="false" @click="toCase(row)" v-else>{{  row.case_title  }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="输入参数" align="center">
        <template slot-scope="{row}">
          <span>{{ row.input_keys + '' }} </span>
        </template>
      </el-table-column>
      <el-table-column label="输出参数" align="center">
        <template slot-scope="{row}">

          <span>{{ row.output_keys + '' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="update_datetime"
        label="更新时间"
        align="center">
      </el-table-column>
      <el-table-column align="center" label="操作" fixed="right" width="200">
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
            <el-button-group>

              <el-button
                type="primary"
                size="mini"
                icon="el-icon-document-copy"
                @click="row.edit=!row.edit"
              >
              </el-button>
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                @click="row.edit=!row.edit;getCaseData()"
              >
              </el-button>
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-delete"
                @click="deleteRow(row.id)"
              >
              </el-button>
            </el-button-group>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!--    添加-->

    <el-dialog title="添加" :visible.sync="addForm" class="dialog-add">
      <el-form :model="form">
        <el-form-item label="执行顺序：" :label-width="formLabelWidth">
          <el-input v-model="form.rank" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用例：" :label-width="formLabelWidth">
          <template slot-scope="scope">
            <el-popover
              placement="right"
              title="选择用例"
              width="200"
              trigger="hover"
              >
              <div>
                <select-tree :dataList="caseData" @addNodeClick="addNodeClick"></select-tree>
              </div>
              <el-button slot="reference">{{form.case_title?form.case_title:'请选择用例'}}</el-button>
            </el-popover>
          </template>
        </el-form-item>
        <el-form-item label="输入参数：" :label-width="formLabelWidth">
          <span>{{inputK}}</span>
        </el-form-item>
        <el-form-item label="输出参数：" :label-width="formLabelWidth">
          <span>{{outputK}}</span>
        </el-form-item>
        <el-form-item label="输入参数:" :label-width="formLabelWidth">
          <el-input
            styel="width: 500px"
            class="text-input"
            type="textarea"
            :autosize="{ minRows: 6, maxRows: 8}"
            placeholder='请输入参数 json形式,如
                {
                "username":["test001","test002"],
                "password":["123456","abcdef"]
                }
如果后面的用例要使用之前用例输出的参数,则在前面是用 双$$符号即可:如 $$member_code'
            v-model="form.input_args">
          </el-input>
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
  import {formatArgs, checkJson} from '@/utils/tableDate'
  import selectTree from '@/components/common/selectTree'
  import {mapState} from "vuex"

  export default {
    name: 'suitStepTable',
    components: {selectTree},
    data() {
      return {
        search: '',
        filterText: '',
        defaultDataId: '',
        selectCase: '',
        currentRow: '',
        addForm: false,
        inputK: '',
        outputK: '',
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        getRowKeys(row) {
          return row.id;
        },
        expands: [],
        form: {
          rank: '',
          case_id: '',
          input_args: '',
          case_title: '',
        },
        formLabelWidth: '120px',
      }
    },
    computed: {
      ...mapState({  //这里的...不是省略号了,是对象扩展符
        caseData: state => state.tableData.caseData,
        tableData: state => state.tableData.testCaseSuitStepData,
      })
    },

    methods: {
      tableRowClassName({row, rowIndex}) {
        if (rowIndex % 2 === 0) {
          return 'warning-row';
        } else {
          return 'success-row';
        }
        return '';
      },
      addNew() {
        this.addForm = true
        this.form.rank = parseInt(this.tableData[this.tableData.length - 1].rank) + 1
        this.form.case_id = ''
        this.form.input_args = ''
        this.inputK = ''
        this.outputK = ''
        this.case_title = ''
      },
      rowClick(row, column, even) {
        this.expands = [row.id]
        this.currentRow = row
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      toCase(row){
        this.$router.push({
          name: 'case',
          params: {id: this.projectId, page_id: row.id}
        })
        this.$store.dispatch('tabViews/addView', {"route": this.$route, "title": ': ' + row.case_title})
      },
      addNodeClick(value) {
        let nodeId = value.treeData.id
        this.inputK = value.treeData.input_keys
        this.outputK = value.treeData.output_keys
        this.form.case_title = value.treeData.title
        this.form.input_args = ''
        this.form.case_id = nodeId
        if (this.inputK) {
          this.form.input_args = formatArgs(this.inputK)
        }

      },
      editNodeClick(value) {
        let nodeId = value.treeData.id
        value.row.case_title = value.treeData.title
        value.row.case_id = nodeId

        value.row.input_keys = value.treeData.input_keys
        value.row.output_keys = value.treeData.output_keys
        if (value.row.input_keys != '') {
          value.row.input_args = formatArgs(value.row.input_keys)
        }
      },
      addData() {
        console.log(this.form.input_args)
        if (checkJson(this.form.input_args)) {
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
        }

      },
      confirmEdit(row) {
        console.log(row.input_args)
        if (checkJson(row.input_args)) {
          row.edit = false
          row.originalRank = row.rank
          row.originalCaseTitle = row.case_title
          row.originalSkip = row.skip
          row.originalInputArgs = row.input_args
          row.originalInputKeys = row.input_keys
          row.case_id = row.case_id
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
        }
      },
      cancelEdit(row) {
        row.rank = row.originalRank
        row.case_title = row.originalCaseTitle
        row.edit = false
        row.input_keys = row.originalInputKeys
        row.skip = row.originalSkip
        row.input_args = row.originalInputArgs
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
        this.$store.dispatch('tableData/getCaseData')
      },
      getTableData() {
        let suitId = this.$route.params.suit_id
        this.$store.dispatch('tableData/getTestCaseSuitStepData',suitId)
      },
    }
    ,
    mounted() {
      if (this.$route.name == 'suit') {
        this.getTableData()
        this.getCaseData()

      }
    },
    watch: {
      $route(to, from) {
        if (to.name == 'suit') {
          this.getTableData()
          this.getCaseData()
        }
      },
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
  }
</script>

<style>
  .dialog-add {
    text-align: left;
  }

  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
