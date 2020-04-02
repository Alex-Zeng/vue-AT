<template>
  <div class="app-container">
    <el-table
      :data="dataList.filter(data => !search || data.title.toLowerCase().includes(search.toLowerCase()))"
      fit highlight-current-row style="width: 100%"
      size="small"
      border
      :row-key="getRowKeys"
      @row-click="rowClick"
      :expand-row-keys="expands"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="参数">
              <template v-if="props.row.edit">
                <el-input
                  class="text-input"
                  type="textarea"
                  :autosize="{ minRows: 14, maxRows: 15}"
                  placeholder="请输入参数 kye=value"
                  v-model="props.row.setting_args">
                </el-input>
              </template>
              <span v-else>{{ props.row.setting_args }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column align="center" label="ID" width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="设备名">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.title" class="edit-input" size="mini"/>
          </template>
          <span v-else>{{ row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Appium地址" width="120">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.remoteHost" class="edit-input" size="mini"/>
          </template>
          <span v-else>{{ row.remoteHost}}</span>
        </template>
      </el-table-column>

      <el-table-column label="Appium端口" width="100">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.remotePort" class="edit-input" size="mini"/>
          </template>
          <span v-else>{{ row.remotePort }}</span>
        </template>
      </el-table-column>

      <el-table-column label="开启定时" width="80">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.cron_status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            @change="confirmEdit(row)"
          >
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column label="下次运行时间" width="180">
        <template slot-scope="{row}">
          <span>{{ row.next_run_time}}</span>
        </template>
      </el-table-column>
      <el-table-column label="cron表达式" width="100">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.cron_times" class="edit-input" size="mini"/>
          </template>
          <el-tooltip class="item" effect="dark" content="cron表达式: 秒 分 时 日 月 年,如 10 10 10 * * * 表示每天10点10分10秒执行一次任务"
                      placement="top" v-else>
            <span>{{ row.cron_times}}</span>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column label="最后一次执行日志" width="180">
        <template slot-scope="{row}">
              <el-popover
                placement="right"
                title="日志查看"
                width="1000"
                trigger="click"
              >
                <div style="height: 500px" class="cmm-wrapper" v-html="logText"></div>
                <el-button slot="reference" size="mini" type="info" plain @click="getRunTestLogData(row.id)">查看运行日志</el-button>
              </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240" align="center">
        <template slot-scope="{row}">
          <div>
            <template v-if="row.running">
            <span type="info" disabled size="mini">执行中<i class="el-icon-loading"></i>
            </span>
            </template>
            <el-button v-else type="primary" @click.stop="runTest(row)" size="mini">执行测试</el-button>

            <el-button
              type="success"
              size="mini"
              @click="suitEdit(row)"
            >
              用例集
            </el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" fixed="right" width="200">
        <template slot="header" slot-scope="scope">
          <el-button type="primary" @click="addForm=true" icon="el-icon-plus" size="mini">新增设备
          </el-button>
          <el-input
            v-model="search"
            size="mini"
            placeholder="输入操作搜索"/>
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
              <!--              <el-button v-if="row.session_id" type="danger" icon="el-icon-video-pause" size="mini"-->
              <!--                         @click="stopEt(row)">停止-->
              <!--              </el-button>-->
              <!--              <el-button v-else type="primary" icon="el-icon-video-play" size="mini" @click="startEt(row)">启动-->
              <!--              </el-button>-->
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

    <el-dialog title="添加" :visible.sync="addForm">
      <el-form :model="form" :inline="true" class="demo-form-inline" size="mini" label-position="top">
        <el-form-item label="设备名：" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="remoteHost：" :label-width="formLabelWidth">
          <el-input v-model="form.remoteHost" autocomplete="off" placeholder="连接的appium地址"></el-input>
        </el-form-item>
        <el-form-item label="remotePort：" :label-width="formLabelWidth">
          <el-input v-model="form.remotePort" autocomplete="off" placeholder="连接的appium端口"></el-input>

        </el-form-item>
        <el-form-item label="是否开启定时任务：" :label-width="formLabelWidth">
          <el-switch
            v-model="form.cron_status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="cron_times：" :label-width="formLabelWidth">
          <el-input v-model="form.cron_times" autocomplete="off"
                    placeholder="cron表达式 例如:0 15 10 * * ? 2005 2005年的每天上午10:15触发"></el-input>
        </el-form-item>

        <el-form-item label="setting_args：" :label-width="formLabelWidth">
          <el-input
            class="text-input"
            type="textarea"
            :autosize="{ minRows: 10, maxRows: 15}"
            placeholder="请输入参数 kye=value"
            v-model="form.setting_args">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addForm = false">取 消</el-button>
        <el-button type="primary" @click="addData">确 定</el-button>
      </div>
    </el-dialog>
    <el-drawer
      :title="currentEtitle"
      :visible.sync="suitForm"
      direction="rtl"
      size="80%">
      <ExecuteTest :e_id="currentEid"></ExecuteTest>
    </el-drawer>
    <el-drawer
      :title="currentEtitle"
      :visible.sync="logForm"
      direction="rtl"
      size="80%">
      <ExecuteLog :e_id="currentEid"></ExecuteLog>
    </el-drawer>

  </div>
</template>

<script>
  import {
    postEquipment,
    editEquipment,
    deleteEquipment,
    startEquipment,
    stopEquipment,
    startES,
    getFinalLogText
  } from '../../api/api'
  import ExecuteTest from '../executeTest/ExecuteTest'
  import ExecuteLog from '../report/ExecuteLog'
  import {checkJson} from '@/utils/tableDate'
  import {mapState} from "vuex"

  export default {
    name: "Equipment",
    components: {
      ExecuteTest,
      ExecuteLog,
    },
    data() {
      return {
        search: "",
        addForm: false,
        logForm: false,
        suitForm: false,
        listLoading: true,
        currentEid: '',
        logText: '',
        currentEtitle: '管理用例集',
        formLabelWidth: '140px',
        textareaWidth: '520px',
        getRowKeys(row) {
          return row.id;
        },
        expands: [],
        form: {
          title: "",
          setting_args: "",
          remoteHost: "",
          remotePort: "",
          cron_status: "",
          cron_times: ""
        }
      }
    },
    computed: {
      ...mapState({  //这里的...不是省略号了,是对象扩展符
        dataList: state => state.tableData.equipmentData,
      })
    },
    created() {
      this.getEquipmentDataList()
    },
    watch: {
      $route(to, from) {
        if (to.name == 'equipment') {
          this.getEquipmentDataList()
        }
      }
    },
    methods: {
      getRunTestLogData(e_id) {
        this.logText = ''
        getFinalLogText(e_id).then((res) => {
          this.logText = res.data
        })
      },
      rowClick(row, column, even) {
        this.expands = [row.id]
      },

      getEquipmentDataList() {
        this.$store.dispatch('tableData/getEquipmentData')
      },
      suitEdit(row) {
        this.suitForm = true
        this.currentEid = row.id
        this.currentEtitle = row.title
      },
      runTest(row) {
        this.expands = [row.id]
        row.running = true
        startES(row.id).then((res) => {
          alert(res.message)

          this.expands = [row.id]
          row.running = false
        })

      },
      addData() {
        if (checkJson(this.form.setting_args) == true) {
          postEquipment(this.form).then(res => {
            if (res.status == 1) {
              this.search = ''
              this.addForm = false
              this.getEquipmentDataList()
              this.$message(res.message)
            }
          })
        }
      },
      cancelEdit(row) {
        row.edit = false
        row.title = row.originalTitle
        row.setting_args = row.originalSetting_args
        row.remoteHost = row.originalRemoteHost
        row.remotePort = row.originalRemotePort
        row.cron_times = row.originalCronTimes
        row.cron_status = row.originalCronStatus
        this.$message({
          message: '放弃编辑',
          type: 'warning'
        })
      },
      confirmEdit(row) {

        if (checkJson(row.setting_args)) {
          row.edit = false
          row.originalTitle = row.title
          row.originalSetting_args = row.setting_args
          row.originalRemoteHost = row.remoteHost
          row.originalRemotePort = row.remotePort
          row.originalCronTimes = row.cron_times
          row.originalCronStatus = row.cron_status
          editEquipment(row.id, row).then(res => {
            if (res.status == 1) {
              this.$message({
                message: res.message,
                type: 'success'
              })
              this.getEquipmentDataList()
            } else {
              this.$message({
                message: res.message,
                type: 'error'
              })
            }
          })
        }
      },
      deleteRow(rowId) {
        this.$alert('确定删除?', '删除', {
          confirmButtonText: '确定',
        }).then(() => {
          deleteEquipment(rowId).then(res => {
            if (res.status == 1) {
              this.getEquipmentDataList()
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
      stopEt(row) {
        stopEquipment(row.id, {'session_id': row.session_id}).then(res => {
          if (res.status == 1) {
            this.search = ''
            this.$message({
              type: 'info',
              message: res.message
            });
            row.status = 0
            row.session_id = ''
          } else {
            row.status = 0
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

  .text-input {
    width: 300px;
  }
</style>
