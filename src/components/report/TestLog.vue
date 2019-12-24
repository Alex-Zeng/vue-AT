<template>
  <div class="log_container">
    <el-row>
      <h5>整体测试</h5>
      <div>
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ name: 'testLog' }">日志: {{currentId}}</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
          </el-col>
          <el-col :span="12">
            <div>
              <test_static :data="testLogCount"></test_static>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-divider></el-divider>
      <div class="grid-content bg-purple-light">
        <el-table
          :data="testLogData"
          fit
          max-height="600"
          border
          highlight-current-row
          style="width: 100%"
          size="small"
          :row-key="getRowKeys"
          :expand-row-keys="expands"
          @row-click="rowClick"
        >
          <el-table-column label="ID" width="60" align="center">
            <template slot-scope="{row}">
              <span>{{ row.id}}</span>
            </template>
          </el-table-column>
          <el-table-column label="设备名" width="160" align="center">
            <template slot-scope="{row}">
              <span>{{ row.equipment_title}}</span>
            </template>
          </el-table-column>
                    <el-table-column label="设备ID" width="60" align="center">
            <template slot-scope="{row}">
              <span>{{ row.equipment_id}}</span>
            </template>
          </el-table-column>
          <el-table-column label="执行结果" align="center">
            <template slot-scope="{row}">
              <span v-if="row.run_test_result==2" style="color: black">运行中 </span>
              <span v-if="row.run_test_result==1" style="color: chartreuse">成功 </span>
              <span v-if="row.run_test_result==0" style="color: red">失败 </span>
              <el-button  size="mini" type="text"  @click="showSuit(row.id)">详情</el-button>
            </template>
          </el-table-column>
          <el-table-column label="开始时间" align="center">
            <template slot-scope="{row}">
              <span>{{ formatDatey(row.run_test_start_time)}}</span>
            </template>
            </el-table-column>
            <el-table-column   label="结束时间" align="center">
            <template slot-scope="{row}">
              <span>{{ formatDatey(row.run_test_end_time)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="用时" align="center" >
            <template slot-scope="{row}">
              <span>{{ row.run_test_times}} 秒</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="300" align="center">
            <template slot-scope="{row}">
              <el-popover
                placement="right"
                title="日志查看"
                width="1000"
                trigger="click"
              >
                <div style="height: 500px" class="cmm-wrapper" v-html="logText"></div>
                <el-button slot="reference" size="mini" type="info" plain @click="getRunTestLogData(row.id)">查看运行日志</el-button>
                <el-button slot="reference" size="mini" type="warning"  @click="delLogData(row.id)">删除日志</el-button>
              </el-popover>

            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-row>
  </div>

</template>

<script>
  import {getLog, getLogFile, deleteLogData} from '@/api/api'
  import test_static from './test_static'

  export default {
    name: "SuitLog",
    components: {test_static},
    data() {
      return {
        search: "",
        formLabelWidth: '140px',
        textareaWidth: '520px',
        testLogData: [],
        testLogCount: '',
        logText: '',
        currentId: '',
        getRowKeys(row) {
          return row.id;
        },
        expands: [],
      }
    },
    mounted() {
      this.getList()
    },

    watch: {
      $route(to, from) {
        if (to.name == 'testLog') {
          this.getList()
        }
      }
    },
    methods: {
      rowClick(row, column, even) {
        this.expands = [row.id]
        this.currentId = row.id
        // this.toSuitLog(row.id)
      },

      getList() {
        let formData = {"type": 'test', "id": 0}
        getLog(formData).then((res) => {
          this.testLogData = res.data.data_list
          this.testLogCount = res.data.data_count
        })
      },
      showSuit(id) {
        this.$router.push({name: "suitLog", params: {"id": id}})
      },
      delLogData(id){
        deleteLogData(id).then((res) => {
          this.$message({
              message: '删除成功',
              type: 'success'
            })
          this.getList()
        })

      },
      formatDatey(column) {
        column += '+0800'
        let d = new Date(column)
        let date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        return date

      },
      getRunTestLogData(id) {
        this.logText = ''
        getLogFile(id).then((res) => {
          this.logText = res.data
        })
      }
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

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
    text-align: right;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 80%;
    min-height: 600px;
  }

  .cmm-wrapper {
    white-space: pre-wrap;
  line-height: 40 px;
    color: #000032;
    font-size: 12px; /*px*/
    overflow: scroll;
  }
</style>
