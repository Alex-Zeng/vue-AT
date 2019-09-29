<template>
  <div class="app-container">
    <el-table v-loading="listLoading"
              :data="$store.state.tableData.equipmentData.filter(data => !search || data.title.toLowerCase().includes(search.toLowerCase()))"
              fit highlight-current-row style="width: 100%"
              size="small"
              expand-row-keys
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
      <el-table-column align="center" label="ID" width="80">
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

      <el-table-column label="Appium地址">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.remoteHost" class="edit-input" size="mini"/>
          </template>
          <span v-else>{{ row.remoteHost}}</span>
        </template>
      </el-table-column>

      <el-table-column label="Appium端口">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.remotePort" class="edit-input" size="mini"/>
          </template>
          <span v-else>{{ row.remotePort }}</span>
        </template>
      </el-table-column>

            <el-table-column label="状态">
        <template slot-scope="{row}">
          <span >{{ row.status == 0 ? "停止":"运行中"}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot="header" slot-scope="scope">
          <el-button type="primary" @click="addForm=true">新增<i class="el-icon-plus el-icon--right" size="mini"></i>
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

          <div v-else-if="row.status == 0">
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
              icon="el-icon-edit"
              @click="deleteRow(row.id)"
            >
              删除
            </el-button>
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
        <el-form-item label="setting_args：" :label-width="formLabelWidth">
          <el-input
            class="text-input"
            type="textarea"
            :autosize="{ minRows: 14, maxRows: 15}"
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
  </div>
</template>

<script>
  import {postEquipment, editEquipment, deleteEquipment} from '../../api/api'

  export default {
    name: "Equipment",
    data() {
      return {
        search: "",
        addForm: false,
        dataList: [],
        listLoading: true,
        formLabelWidth: '140px',
        textareaWidth: '520px',
        form: {
          title: "",
          setting_args: "",
          remoteHost: "",
          remotePort: ""
        }
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        this.$store.dispatch('tableData/getEquipmentData')
        this.listLoading = false
      },
      addData() {
        postEquipment(this.form).then(res => {
          if (res.status == 1) {
            this.search = ''
            this.addForm = false
            this.getList()
            this.$message(res.message)
          }
        })

      },
      cancelEdit(row) {
        row.edit = false
        row.title = row.originalTitle
        row.setting_args = row.originalSetting_args

        row.remoteHost = row.originalRemoteHost
        row.remotePort = row.originalRemotePort


        this.$message({
          message: '放弃编辑',
          type: 'warning'
        })
      },
      confirmEdit(row) {
        row.edit = false
        row.originalTitle = row.title
        row.originalSetting_args = row.setting_args
        row.originalRemoteHost = row.remoteHost
        row.originalRemotePort = row.remotePort
        editEquipment(row.id, row).then(res => {
          if (res.status == 1) {
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
            this.getList()
          } else {
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
          deleteEquipment(rowId).then(res => {
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

  .el-dialog input {
    color: red;
  }

  .text-input {
    width: 360px;
  }
</style>
