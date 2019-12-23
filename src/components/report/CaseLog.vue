<template>
  <div class="log_container">
    <el-row>
      <h5>测试用例日志</h5>
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
              </el-breadcrumb>
            </div>
          </el-col>
          <el-col :span="12">
            <div>
              <test_static :data="caseLogCount"></test_static>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="grid-content bg-purple-light">
        <el-table
          :data="caseLogData"
          fit
          max-height="600"
          border
          highlight-current-row
          style="width: 100%"
          size="small"
          :row-key="getRowKeys"
          @row-click="rowClick"
        >
          <el-table-column label="ID" width="60">
            <template slot-scope="{row}">
              <span>{{ row.id}}</span>
            </template>
          </el-table-column>
          <el-table-column label="用例">
            <template slot-scope="{row}">
              <span>{{ row.test_case_title}}</span>
            </template>
          </el-table-column>

          <el-table-column label="执行结果">
            <template slot-scope="{row}">
              <span>{{ row.run_test_case_result?'成功':'失败' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="开始时间"

          >
            <template slot-scope="{row}">
              <span>{{ formatDatey(row.action_start_time)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="用时">
            <template slot-scope="{row}">
              <span>{{ row.run_test_case_times}} 秒</span>
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
        caseLogData: [],
        caseLogCount: '',
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
        if (to.name == 'caseLog') {
          this.getList()
        }
      }
    },
    methods: {
      rowClick(row, column, even) {
        this.expands = [row.id]
        this.currentCaseId = row.id
        this.showStep(row.id)
      },

      getList() {
        let formData = {"type": 'case', "id": this.$route.params.suitId}
        getLog(formData).then((res) => {
          this.caseLogData = res.data.data_list
          this.caseLogCount = res.data.data_count
        })
      },
      showStep(caseId) {
        this.$router.push({
          name: "stepLog",
          params: {"id": this.$route.params.id, "suitId": this.$route.params.suitId, "caseId": caseId}
        })
      },
      formatDatey(column) {
        column += '+0800'
        let d = new Date(column)
        let date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        return date

      },
      getData(type, id) {

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
</style>
