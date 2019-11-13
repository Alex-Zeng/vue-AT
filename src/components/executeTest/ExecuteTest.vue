<template>
  <div class="app-container">
    <el-table
      :data="dataList"
      fit highlight-current-row style="width: 100%"
      size="small"

    >

      <el-table-column label="执行顺序" width="80">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.rank" class="edit-input" size="mini"/>
          </template>
          <span v-else>{{ row.rank }}</span>
        </template>
      </el-table-column>

      <el-table-column label="测试集ID" width="80">
        <template slot-scope="{row}">
          <span>{{ row.suit_id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="测试集">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-select v-model="row.suit_id" placeholder="请选择测试集" size="mini"
                       @change="selectOption($event,scope)">
              <el-option v-for="item in $store.state.tableData.testCaseSuitData" :label="item.title" :value="item.id"
                         :key="item.id"></el-option>
            </el-select>
          </template>
          <span v-else>{{ row.suit_title }}</span>
        </template>
      </el-table-column>

      <el-table-column label="更新时间">
        <template slot-scope="{row}">
          <span>{{ row.update_datetime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="300">
        <template slot="header" slot-scope="scope">
          <el-button type="primary" @click="addNew" size="mini">新增</el-button>
          <el-button type="primary" @click="addNew" size="mini">运行</el-button>
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
        <el-form-item label="执行顺序：" :label-width="formLabelWidth">
          <el-input v-model="form.rank" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="测试集：" :label-width="formLabelWidth">
          <template slot-scope="scope">
            <el-select v-model="form.suit_id" placeholder="请选择测试集" size="mini"
                       @change="selectOption($event,scope)">
              <el-option v-for="item in $store.state.tableData.testCaseSuitData" :label="item.title" :value="item.id"
                         :key="item.id"></el-option>
            </el-select>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addForm = false">取 消</el-button>
        <el-button type="primary" @click="addData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {postES, editES, deleteES, startEquipment,getESList} from '../../api/api'
  import {checkJson} from '@/utils/tableDate'

  export default {
    name: "ExecuteText",
    data() {
      return {
        search: "",
        addForm: false,
        dataList: [],
        formLabelWidth: '140px',
        textareaWidth: '520px',
        getRowKeys(row) {
          return row.id;
        },
        expands: [],
        form: {
          rank: "",
          suit_id: "",
        }
      }
    },
    mounted() {
      this.$store.dispatch('tableData/getTestCaseSuitData')
      this.getList()
    },
    watch:{
      $route(to,from){
        if(to.name == 'executeTest')
          this.getList()
        }
      },

    methods: {
      addNew() {
        this.addForm = true
        this.form.rank = this.$store.state.tableData.equipmentTestCaseSuitData.slice(-1)[0].rank + 1
      },
      getList() {
        getESList(this.$route.params.e_id).then((res) => {
          this.dataList = res.data.data_list.map(v => {
            this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
            v.originalRank = v.rank //  will be used when user click the cancel botton
            v.originalTestCaseSuitId = v.test_case_suit_id
            return v
          })
        })
      },
      addData() {
        if (checkJson(this.form.setting_args) == true) {
          postES(this.$route.params.e_id, this.form).then(res => {
            if (res.status == 1) {
              this.search = ''
              this.addForm = false
              this.getList()
              this.$message(res.message)
            }
          })
        }
      },
      cancelEdit(row) {
        console.log()
        row.edit = false
        row.rank = row.originalRank
        row.test_case_suit_id = row.originalTestCaseSuitId
        this.$message({
          message: '放弃编辑',
          type: 'warning'
        })
      },
      confirmEdit(row) {
        row.edit = false

        editES(this.$route.params.e_id, row.id, row).then(res => {
          if (res.status == 1) {
            row.originalRank = row.rank
            row.originalTestCaseSuitId = row.test_case_suit_id
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
            this.getList()
          } else {
            row.rank = row.originalRank
            row.test_case_suit_id = row.originalTestCaseSuitId
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        })
      },
      deleteRow(rowId) {
        this.$alert('确定删除?', '删除', {
          confirmButtonText: '确定',
        }).then(() => {
          deleteES(this.$route.params.e_id, rowId).then(res => {
            if (res.status == 1) {
              this.getList()
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

  .el-dialog input {
    color: red;
  }

  .text-input {
    width: 360px;
  }
</style>
