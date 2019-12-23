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
              <el-breadcrumb-item  :to="{ name: 'suitLog',params: {suit_id: 23} }">测试集:{{22}}</el-breadcrumb-item>
              <el-breadcrumb-item>测试用例: {{33}}</el-breadcrumb-item>
              <el-breadcrumb-item>测试步骤: {{44}}</el-breadcrumb-item>
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
         <router-view ></router-view>
<!--        <test-log></test-log>-->
<!--        <suit-log></suit-log>-->
      </div>
    </el-row>
  </div>
</template>

<script>
  import {getLog} from '@/api/api'
  import test_static from './test_static'
  import SuitLog from './SuitLog'
  import TestLog from './TestLog'
  import {mapState} from "vuex"

  export default {
    name: "Report",
    components: {test_static,SuitLog,TestLog},
    data() {
      return {
        search: "",
        formLabelWidth: '140px',
        textareaWidth: '520px',
        testLogData: '',
        testLogCount: '',
        currentId: '',
        suitLogData: '',
        suitLogCount: '',
        caseLogData: '',
        caseLogCount: '',
        stepLogData: '',
        stepLogCount: '',
        running: 0,
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
        if (to.name == 'report') {
          this.getList()
        }
      }
    },
    methods: {
      rowClick(row, column, even) {
        this.expands = [row.id]
        this.currentId = row.id
        this.$router.push({name:"suitLog",params:{"suit_id":id}})
      },

      getList() {
        let formData = {"type": 'test', "id": 0}
        getLog(formData).then((res) => {
          this.testLogData = res.data.data_list
          this.testLogCount = res.data.data_count
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
