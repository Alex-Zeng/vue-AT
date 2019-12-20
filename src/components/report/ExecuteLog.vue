<template>
  <div class="log_container">
    <el-table
      :data="datalist"
      height="700"
      fit highlight-current-row style="width: 100%"
      size="small"
      :row-key="getRowKeys"
      :expand-row-keys="expands"
      @row-click="rowClick"
      :default-sort="{prop: 'rank', order: 'ascending'}"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <div>
            <el-table
              :data="props.row.test_cases_log"
              height="700"
              fit highlight-current-row style="width: 100%"
              size="small"
              :row-key="getRowKeys"
              :expand-row-keys="expands"
              @row-click="rowClick"
            >
              <el-table-column prop="test_case_title" label="测试用例"></el-table-column>
              <el-table-column prop="test_case_action_title" label="测试用例步骤"></el-table-column>
              <el-table-column prop="action_start_time" label="测试步骤开始时间"></el-table-column>

            </el-table>

          </div>
        </template>
      </el-table-column>

      <el-table-column label="日志ID" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="测试集">
        <template slot-scope="{row}">
          <span>{{ row.test_case_suit_title}}</span>
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
        prop="run_test_suit_start_time"
        label="开始时间"
        align="center"
        width="160px">
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
  import selectTree from '@/components/common/selectTree'
  import {mapState} from "vuex"

  export default {
    name: "ExecuteLog",
    props: ['e_id'],
    components: {selectTree},
    data() {
      return {
        search: "",
        formLabelWidth: '140px',
        textareaWidth: '520px',
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
    computed: {
      ...mapState({  //这里的...不是省略号了,是对象扩展符
        datalist: state => state.tableData.LogData,
      })
    },
    watch: {
      e_id() {
        this.getList()
      }
    },
    methods: {
      rowClick(row, column, even) {
        this.expands = [row.id]
      },

      getList() {
        this.$store.dispatch('tableData/getESLogData', this.e_id)
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

</style>
