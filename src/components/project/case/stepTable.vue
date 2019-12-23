<template>
  <div>
    <el-table
      ref="multipleTable"
      :data="tableData.filter(data => !search || data.action_title.toLowerCase().includes(search.toLowerCase())|| data.rank.toLowerCase().includes(search.toLowerCase()))"
      fit highlight-current-row
      size="small"
      :row-class-name="tableRowClassName"
      :default-sort="{prop: 'rank', order: 'ascending'}"
    >

      <el-table-column label="步骤" align="center" prop="rank" width="60">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model.number="row.rank" class="edit-input" size="mini"/>
          </template>
          <span v-else>{{ row.rank }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否跳过" align="center" width="120">
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
      <el-table-column label="是否截图" align="center" width="120">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.take_screen_shot"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            @change="confirmEdit(row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="延时" align="center" width="80">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model.number="row.wait_time" class="edit-input" size="mini"/>
          </template>
          <span v-else>{{ row.wait_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作页面" align="center">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <!--            <el-input v-model="row.fun_title" class="edit-input" size="mini"/>-->
            <el-popover
              placement="left"
              title="选择页面"
              width="200"
              trigger="hover"
              content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
              <div>
                <select-tree :dataList="pageData" :row="row" @addNodeClick="editNodeClick"></select-tree>
              </div>
              <el-button slot="reference" size="mini">{{row.page_title?row.page_title:'请选择页面'}}</el-button>
            </el-popover>
          </template>
          <span v-else>{{ row.page_title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作方法" align="center">
        <template slot-scope="{row}">
          <template v-if="row.edit">
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

      <el-table-column align="right" label="操作"  width="160px">
        <template slot="header" slot-scope="scope">
          <el-button-group>
            <el-button type="primary" @click="addNew" size="mini">新增</el-button>
            <el-button type="primary" size="mini" @click="debugForm = true">调试</el-button>
          </el-button-group>
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
              <el-tooltip class="item" effect="dark" content="复制" placement="top-start">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-document-copy"
                  @click="row.edit=!row.edit"
                >

                </el-button>
              </el-tooltip>
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
            </el-button-group>
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
          <el-popover
            placement="top"
            title="选择页面"
            width="200"
            trigger="hover"
            content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
            <div>
              <select-tree :dataList="pageData" :row="form" @addNodeClick="editNodeClick"></select-tree>
            </div>
            <el-button slot="reference" size="mini">{{form.page_title?form.page_title:'请选择页面'}}</el-button>
          </el-popover>
          <el-select v-model="form.action_id" placeholder="请选择方法" size="mini">
            <el-option v-for="act in actData" :label="act.title" :value="act.id" :key="act.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否跳过：" :label-width="formLabelWidth">
          <el-switch
            v-model="form.skip"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="是否截图：" :label-width="formLabelWidth">
          <el-switch
            v-model="form.take_screen_shot"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="延时：" :label-width="formLabelWidth">
          <el-input v-model.number="form.wait_time" placeholder="操作完后延迟几秒截图"></el-input>
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

    <!--    调试-->
    <el-dialog title="调试" :visible.sync="debugForm" style="text-align: center;">
      <div>
        <el-select v-model="equipmentId" placeholder="请选择设备" size="mini"
                   @change="form.action_id='';getActionData(form.page_id);">
          <el-option v-for="item in $store.state.tableData.equipmentData" :label="item.title" :value="item.id"
                     :key="item.id"></el-option>
        </el-select>

      </div>
      <div v-for="item in $store.state.tableData.equipmentData" v-if="item.id == equipmentId" style="text-align: left;">
        <h1>ID: {{item.id}}</h1>
        <h1>设备: {{item.title}}</h1>
        <h1>appium地址: {{item.remoteHost}}</h1>
        <h1>appium端口: {{item.remotePort}}</h1>
        <h1>运行状态: {{item.status== 0 ? "停止":"运行中"}}</h1>
        <h1>参数: {{item.setting_args}}</h1>
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

          v-model="debugInputArg">
        </el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="debugForm = false;">取 消</el-button>
        <el-button type="primary" @click="confirmDebug">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import {postStep, getStepList, putStep, deleteStep, getActionList, debugCase} from '@/api/api'
  import selectTree from '@/components/common/selectTree'
  import {mapState} from "vuex"

  export default {
    name: 'stepTable',
    components: {selectTree},
    data() {
      return {
        search: '',
        caseId: '',
        tableData: [],
        drawer: false,
        EquipmentData: [],
        defaultDataId: '',
        equipmentId: '',
        debugInputArg: '',
        addForm: false,
        debugForm: false,
        form: {
          rank: '',
          page_id: '',
          page_title: '',
          action_id: '',
          input_key: '',
          output_key: '',
          take_screen_shot: 0,
          wait_time: 0,
          skip: 0,
        },
        formLabelWidth: '120px',
      }

    },
    mounted() {
      if (this.$route.name == 'case') {
        this.caseId = this.$route.params.case_id
        this.getTableData()
        this.getPageData()
        this.$store.dispatch('tableData/getEquipmentData')
      }
    },
    computed: {
      ...mapState({  //这里的...不是省略号了,是对象扩展符
        pageData: state => state.tableData.pageData,
        projectId: state => state.tableData.curreentPro.id,
        actData: state => state.tableData.actionData
      })
    },
    watch: {
      $route(to, from) {
        if (to.name == 'case') {
          this.caseId = this.$route.params.case_id
          this.getTableData()
          this.getPageData()
        }
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
      tableRowClassName({row, rowIndex}) {
        if (rowIndex % 2 === 0) {
          return 'warning-row';
        } else {
          return 'success-row';
        }
        return '';
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
      addNew() {
        this.addForm = true
        this.form.rank = parseInt(this.tableData[this.tableData.length - 1].rank) + 1
        this.form.page_id = ''
        this.form.page_title = ''
        this.form.action_id = ''
        this.form.take_screen_shot = 0
        this.form.wait_time = 0
        this.form.input_key = ''
        this.form.output_key = ''
        this.form.skip = 0
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
        row.originalTakeScreenShot = row.take_screen_shot
        row.originalWaitTime = row.wait_time
        row.originalPageTitle = row.page_title

        putStep(this.projectId, this.caseId, row.id, row).then(res => {
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
        row.wait_time = row.originalWaitTime
        row.page_title = row.originalPageTitle
        row.take_screen_shot = row.originalTakeScreenShot
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
            deleteStep(this.projectId, this.caseId, rowId).then(res => {
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
      confirmDebug() {
        let debugForm = {
          e_id: this.equipmentId,
          input_args: this.debugInputArg
        }
        debugCase(this.projectId, this.caseId, debugForm)
      },
      getActionData(pageId) {
        this.$store.dispatch('tableData/getActionData', pageId)
      },
      getPageData() {
        this.$store.dispatch('tableData/getPage')
      },
      getTableData() {
        getStepList(this.projectId, this.caseId).then(
          res => {
            if (res.data.data_list.length > 0) {
              this.tableData = res.data.data_list.map(v => {
                this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
                v.originalRank = v.rank //  will be used when user click the cancel botton
                v.originalActionId = v.action_id
                v.originalPageId = v.page_id
                v.originalPageTitle = v.page_title
                v.originalSkip = v.skip
                v.originalWaitTime = v.wait_time
                v.originalTakeScreenShot = v.take_screen_shot
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
    }
    ,

  }
</script>

<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }

  .el-table th {
    background: #deffe2;
  }

</style>
