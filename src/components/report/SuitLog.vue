<template>
  <div class="log_container">
    <el-row>
      <h5>测试集日志</h5>
      <div>
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-breadcrumb separator-class="el-icon-arrow-right" >
                <el-breadcrumb-item :to="{ name: 'testLog' }">日志: {{$route.params.id}}</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ name: 'suitLog',params: {id: $route.params.id} }">
                  测试集:{{$route.params.suitId}}
                </el-breadcrumb-item>
              </el-breadcrumb>
            </div>
          </el-col>
          <el-col :span="12">
            <div>
              <test_static :data="suitLogCount"></test_static>
            </div>
          </el-col>
        </el-row>
      </div>
    <el-divider></el-divider>
      <div class="grid-content bg-purple-light">
        <el-table
          :data="suitLogData"
          fit
          max-height="600"
          border
          highlight-current-row
          size="small"
          :row-key="getRowKeys"
          @row-click="rowClick"
        >
          <el-table-column label="ID" width="40" align="center">
            <template slot-scope="{row}">
              <span>{{ row.id}}</span>
            </template>
          </el-table-column>
          <el-table-column label="测试集" align="center">
            <template slot-scope="{row}">
              <span>{{ row.test_case_suit_title}}</span>
            </template>
          </el-table-column>
          <el-table-column label="执行结果" align="center">
            <template slot-scope="{row}">
              <span v-if="row.run_test_result==2" style="color: black">运行中</span>
              <span v-if="row.run_test_result==1" style="color: chartreuse">成功</span>
              <span v-if="row.run_test_result==0" style="color: red">失败</span>
              <el-button  size="mini" type="text"  @click="showCase(row.id)">详情</el-button>
            </template>
          </el-table-column>
          <el-table-column label="开始时间" align="center" >
            <template slot-scope="{row}">
              <span>{{ formatDatey(row.run_test_suit_start_time)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="用时" align="center">
            <template slot-scope="{row}">
              <span>{{ row.run_test_suit_times}} 秒</span>
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
    name: "SuitLog",
    components: {test_static},
    data() {
      return {
        search: "",
        formLabelWidth: '140px',
        textareaWidth: '520px',
        currentSuitId: '',
        suitLogData: [],
        suitLogCount: '',
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
        if (to.name == 'suitLog') {
          this.getList()
        }
      }
    },
    methods: {
      rowClick(row, column, even) {
        this.expands = [row.id]
        this.currentSuitId = row.id
      },

      getList() {
        let formData = {"type": 'suit', "id": this.$route.params.id}
        getLog(formData).then((res) => {
          this.suitLogData = res.data.data_list
          this.suitLogCount = res.data.data_count
        })
      },
      showCase(suitId) {
        this.$router.push({name: "caseLog", params: {"id": this.$route.params.id, "suitId": suitId}})
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
