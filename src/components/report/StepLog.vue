<template>
  <div class="log_container">
    <el-row>
      <h5>测试步骤日志</h5>
      <div>
        <el-row>
          <el-col :span="12">
            <div>
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ name: 'testLog' }">日志: {{$route.params.id}}</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ name: 'suitLog',params: {id: $route.params.id} }">
                  测试集:{{$route.params.suitId}}
                </el-breadcrumb-item>
                <el-breadcrumb-item
                  :to="{ name: 'caseLog',params: {id: $route.params.id,suitId:$route.params.suitId} }">
                  测试用例:{{$route.params.caseId}}
                </el-breadcrumb-item>
                <el-breadcrumb-item>
                  测试步骤
                </el-breadcrumb-item>
              </el-breadcrumb>
            </div>
          </el-col>
          <el-col :span="12">
            <div>
              <test_static :data="stepLogCount"></test_static>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-divider></el-divider>
      <div class="grid-content bg-purple-light">
        <el-table
          :data="stepLogData"
          fit
          max-height="600"
          border
          highlight-current-row
          style="width: 100%"
          size="small"
          :row-key="getRowKeys"
          @row-click="rowClick"
        >
          <el-table-column label="ID" width="60" align="center">
            <template slot-scope="{row}">
              <span>{{ row.id}}</span>
            </template>
          </el-table-column>
          <el-table-column label="用例" align="center">
            <template slot-scope="{row}">
              <span>{{ row.test_case_action_title}}</span>
            </template>
          </el-table-column>
          <el-table-column label="步骤" width="60" align="center">
            <template slot-scope="{row}">
              <span>{{ row.test_case_step_rank}}</span>
            </template>
          </el-table-column>
          <el-table-column label="执行结果" align="center">
            <template slot-scope="{row}">
              <span v-if="row.run_test_action_result==2" style="color: black">运行中</span>
              <span v-if="row.run_test_action_result==1" style="color: chartreuse">成功</span>
              <span v-if="row.run_test_action_result==0" style="color: red">失败
                               <el-popover
                                 placement="right-end"
                                 width="400"
                                 trigger="hover"
                                 v-if="row.error_msg"
                               >
                <div class="demo-image">
                  <div class="block">
                    <div style="height: 500px" class="cmm-wrapper" v-html="row.error_msg"></div>
                  </div>
                </div>
                <el-button slot="reference" type="text">错误信息</el-button>
              </el-popover>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="开始时间"

          >
            <template slot-scope="{row}">
              <span>{{ formatDatey(row.action_start_time)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="输入参数" align="center">
            <template slot-scope="{row}">
              <span>{{ row.test_case_action_input}}</span>
            </template>
          </el-table-column>
          <el-table-column label="输出参数" align="center">
            <template slot-scope="{row}">
              <span>{{ row.test_case_action_output}}</span>
            </template>
          </el-table-column>
          <el-table-column label="用时" align="center">
            <template slot-scope="{row}">
              <span>{{ row.run_test_case_times}} 秒</span>
            </template>
          </el-table-column>
          <el-table-column label="截图" align="center">
            <template slot-scope="{row}">
              <el-popover
                placement="right-end"
                width="400"
                trigger="hover"
                v-if="row.screen_shot_path"
              >
                <div class="demo-image">
                  <div class="block">
                    <el-image
                      style="width: 400px; height: 700px"
                      :src="url+row.id + ''"
                      fit="contain"></el-image>
                  </div>
                </div>
                <el-button slot="reference">查看截图</el-button>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-row>
  </div>

</template>

<script>
  import {getLog} from '@/api/api'
  import test_static from './test_static'
  import {mapState} from "vuex"

  export default {
    name: "CaseLog",
    components: {test_static},
    data() {
      return {
        search: "",
        formLabelWidth: '140px',
        textareaWidth: '520px',
        currentCaseId: '',
        stepLogData: [],
        stepLogCount: '',
        url: 'http://localhost:5002/runtest/image_log/',
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
        if (to.name == 'stepLog') {
          this.getList()
        }
      }
    },
    methods: {
      rowClick(row, column, even) {
        // this.expands = [row.id]
        // this.currentCaseId = row.id
        // this.showStep(row.id)
      },

      getList() {
        let formData = {"type": 'step', "id": this.$route.params.caseId}
        getLog(formData).then((res) => {
          this.stepLogData = res.data.data_list
          this.stepLogCount = res.data.data_count
        })
      },
      // showStep(caseId) {
      //   this.$router.push({name: "StepLog", params: {"id": this.$route.params.id, "suitId": this.$route.params.suitId, "caseId": caseId}})
      // },
      formatDatey(column) {
        column += '+0800'
        let d = new Date(column)
        let date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        return date

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
    line-height: 40px;
    color: #000032;
    font-size: 12px; /*px*/
    overflow: scroll;
  }
</style>
