<template>
  <div>
    <div>
      <el-button style="padding: 5px" type="success" @click="openAddDialog(form)">添加设备</el-button>
    </div>
    <br>
    <div>
      <el-row justify="space-around">
        <el-col :span="12" v-for="item in devices" :key="item.id">
          <div class="grid-content bg-purple">
            <el-card class="box-card-device">
              <div slot="header" class="clearfix">
                <span>{{item.title}}</span>
                <span>下次运行时间: {{item.next_run_time}}</span>
                <span>设备ID: {{JSON.parse(item.setting_args).deviceName}}</span>

                <el-button style="float: right; padding: 3px 0" type="text" @click="deleteRow(item.id)">删除</el-button>
                <el-button style="float: right; padding: 3px 0" type="text"
                           @click="openEditDialog(item)"> 编辑
                </el-button>
                <el-button style="float: right; padding: 3px 0" type="text" @click="setTop(item)">置顶</el-button>
              </div>
              <div class="text item">
                <el-row justify="space-around">
                  <el-col :span="19">
                    <devices :deviceName="JSON.parse(item.setting_args).deviceName"></devices>
                  </el-col>
                  <el-col :span="5">
                    <ul class="button_li">
                      <br>
                      <br>
                      <br>
                      <div class="test_button">
                        <el-popover
                          placement="right"
                          :title="currentEtitle + ': 最后一次运行测试日志查看'"
                          width="800"
                          trigger="click"
                        >
                          <div style="height: 500px;" class="cmm-wrapper" v-html="logText"></div>
                          <el-button slot="reference" size="mini" type="info" plain @click="getRunTestLogData(item)">
                            运行日志
                          </el-button>
                        </el-popover>
                      </div>
                      <div class="test_button">
                        <el-button type="primary" @click="logForm = true" size="mini">
                          测试报告
                        </el-button>
                      </div>
                      <div class="test_button">
                        <el-button v-if="item.running == true || item.status == 1" disabled type="primary" size="mini">
                          执行中
                        </el-button>
                        <el-button v-else type="primary" @click="runTest(item)" size="mini">执行测试</el-button>
                      </div>
                      <div class="test_button">
                        <el-button type="primary" @click="suitEdit(item)" size="mini">用例集</el-button>
                      </div>
                    </ul>
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </div>
          <br>
        </el-col>

      </el-row>
    </div>
    <!--    添加-->

    <el-dialog :title="dialogTilte" :visible.sync="addForm">
      <el-form :model="currentDevice" :inline="true" class="demo-form-inline" size="mini" label-position="top">
        <el-form-item label="设备名：" :label-width="formLabelWidth">
          <el-input v-model="currentDevice.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序：" :label-width="formLabelWidth">
          <el-input v-model="currentDevice.rank" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="remoteHost：" :label-width="formLabelWidth">
          <el-input v-model="currentDevice.remoteHost" autocomplete="off" placeholder="连接的appium地址"></el-input>
        </el-form-item>
        <el-form-item label="remotePort：" :label-width="formLabelWidth">
          <el-input v-model="currentDevice.remotePort" autocomplete="off" placeholder="连接的appium端口"></el-input>

        </el-form-item>
        <el-form-item label="是否开启定时任务：" :label-width="formLabelWidth">
          <el-switch
            v-model="currentDevice.cron_status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="cron_times：" :label-width="formLabelWidth">
          <el-input v-model="currentDevice.cron_times" autocomplete="off"
                    placeholder="cron表达式 例如:0 15 10 * * ? 2005 2005年的每天上午10:15触发"></el-input>
        </el-form-item>

        <el-form-item label="setting_args：" :label-width="formLabelWidth">
          <el-input
            class="text-input"
            type="textarea"
            :autosize="{ minRows: 10, maxRows: 15}"
            placeholder="请输入参数 kye=value"
            v-model="currentDevice.setting_args">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit(currentDevice)">取 消</el-button>
        <el-button type="primary" @click="confirm(currentDevice)">确 定</el-button>
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
      size="80%"
    >
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
  import Devices from '../common/Devices'
  import {checkJson} from '@/utils/tableDate'
  import {mapState} from "vuex"
  import Pages from "../project/Pages";

  export default {
    name: "MinicapDisplay",
    components: {
      Pages,
      ExecuteTest,
      ExecuteLog,
      Devices,
    },
    data() {
      return {
        form: {
          title: "",
          setting_args: '',
          remoteHost: "",
          remotePort: "",
          cron_status: "",
          cron_times: ""
        },
        addForm: false,
        logForm: false,
        suitForm: false,
        currentDevice: '',
        dialogTilte: '',
        logText: '',
        gRank: 999,
        formLabelWidth: '140px',
        textareaWidth: '520px',
        currentEtitle: '管理用例集',
        currentEid: '',

      }
    },
    computed: {
      ...mapState({  //这里的...不是省略号了,是对象扩展符
        devices: state => state.tableData.equipmentData,
      })
    },
    mounted() {
      this.getEquipmentDataList()
    },
    destroyed() {

    },
    methods: {
      getRunTestLogData(row) {
        this.logText = '还没有日志'
        this.currentEtitle = row.title
        getFinalLogText(row.id).then((res) => {
          this.logText = res.data
        })
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
        row.running = true
        console.log(row)
        startES(row.id).then((res) => {
          alert(res.message)
          row.running = false
          this.$store.dispatch('tableData/getEquipmentData')
          console.log(row)
        })

      },
      addData() {
        if (checkJson(this.form.setting_args) == true) {
          postEquipment(this.form).then(res => {
            if (res.status == 1) {
              this.search = ''
              this.getEquipmentDataList()
              this.$message(res.message)
            }
          })
        }
      },
      openAddDialog(row) {

        this.dialogTilte = '添加'
        this.currentDevice = row
        this.addForm = true

      },
      openEditDialog(row) {
        this.dialogTilte = '编辑'
        this.currentDevice = row
        this.addForm = true
        row.originalTitle = row.title
        row.originalSetting_args = row.setting_args
        row.originalRemoteHost = row.remoteHost
        row.originalRemotePort = row.remotePort
        row.originalCronTimes = row.cron_times
        row.originalCronStatus = row.cron_status
      },
      cancelEdit(row) {
        row.edit = false
        row.title = row.originalTitle
        row.setting_args = row.originalSetting_args
        row.remoteHost = row.originalRemoteHost
        row.remotePort = row.originalRemotePort
        row.cron_times = row.originalCronTimes
        row.cron_status = row.originalCronStatus
        this.addForm = false
      },
      confirm(row) {
        if (row.id === undefined) {
          this.addData()
        } else {
          this.confirmEdit(row)
        }
        this.addForm = false

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
      checkDevice(row) {
        console.log(JSON.parse(row.setting_args).deviceName)
      },
      setTop(row) {
        this.$store.dispatch('tableData/setEquipmentTop', {id: row.id})
      }

    }
  }
</script>

<style>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .box-card-device {
    width: 95%
  }

  .button_li li {
    padding-bottom: 5px;
    float: right;
  }

  .cmm-wrapper {
    white-space: pre-wrap;
    line-height: 40px;
    color: #000032;
    font-size: 12px; /*px*/
    overflow: scroll;
  }
  .test_button{
    padding-bottom: 10px;
  }
</style>

