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
          <el-table-column label="ID" width="40">
            <template slot-scope="{row}">
              <span>{{ row.id}}</span>
            </template>
          </el-table-column>
          <el-table-column label="设备名">
            <template slot-scope="{row}">
              <span>{{ row.equipment_title}}</span>
            </template>
          </el-table-column>

          <el-table-column label="执行结果">
            <template slot-scope="{row}">
              <span>{{ row.run_test_result?'成功':'失败' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="开始时间"

          >
            <template slot-scope="{row}">
              <span>{{ formatDatey(row.run_test_start_time)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="用时">
            <template slot-scope="{row}">
              <span>{{ row.run_test_times}} 秒</span>
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
        this.toSuitLog(row.id)
      },

      getList() {
        let formData = {"type": 'test', "id": 0}
        getLog(formData).then((res) => {
          this.testLogData = res.data.data_list
          this.testLogCount = res.data.data_count
        })
      },
      toSuitLog(id) {
        this.$router.push({name: "suitLog", params: {"id": id}})
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
