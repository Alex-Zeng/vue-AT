<template>
  <div class="app-container">
    <el-table v-loading="listLoading"
              :data="$store.state.tableData.functionData.filter(data => !search || data.title.toLowerCase().includes(search.toLowerCase()))"
              fit highlight-current-row style="width: 100%"
              size="small"
              border
    >

      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="方法名">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.title" class="edit-input" size="mini"/>
          </template>
          <span v-else>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="对应的代码方法名">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.fun_title" class="edit-input" size="mini"/>
          </template>
          <span v-else>{{ row.fun_title }}</span>
        </template>
      </el-table-column>

      <el-table-column label="适用设备" width="100">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-select v-model="row.type" placeholder="请选择设备" size="mini">
              <el-option v-for="(v,k) in typeData" :label="v" :value="k" :key="k"></el-option>
            </el-select>
          </template>
          <span v-else>{{ typeData[row.type]}}</span>
        </template>
      </el-table-column>


      <el-table-column label="方法描述" show-overflow-tooltip>
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.description" class="edit-input" size="mini"/>
          </template>
          <span v-else>{{ row.description }}</span>
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
          <div v-if="row.edit">
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
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="row.edit=!row.edit"
            >
            </el-button>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-delete"
              @click="deleteRow(row.id)"
            >
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!--    添加-->

    <el-dialog title="添加" :visible.sync="addForm">
      <el-form :model="form">
        <el-form-item label="方法名：" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="对应代码的方法：" :label-width="formLabelWidth">
          <el-input v-model="form.fun_title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="适用设备：" :label-width="formLabelWidth">
          <el-select v-model="form.type" placeholder="请选择设备">
            <el-option v-for="(v,k) in typeData" :label="v" :value="k" :key="k"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="方法描述：" :label-width="formLabelWidth">
          <el-input v-model="form.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addForm = false">取 消</el-button>
        <el-button type="primary" @click="addFunction">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {postFunction, editFunction, deleteFunction} from '../../api/api'

  export default {
    name: "Function",

    data() {
      return {
        search: "",
        addForm: false,
        dataList: [],
        listLoading: true,
        formLabelWidth: '100px',
        typeData: {"0": "通用", "1": "ADNROID", "2": "IOS", "3": "PC",},
        form: {
          title: "",
          type: "",
          fun_title: "",
          description: "",
        }
      }
    },
    mounted() {
      this.getFunctionList()
    },
    watch: {
      $route(to, from) {
        if (to.name == 'function') {
          this.getFunctionList()
        }
      }
    },
    methods: {
      getFunctionList() {
        this.listLoading = true
        this.$store.dispatch('tableData/getFunctionData')
        this.listLoading = false
      },
      addFunction() {
        postFunction(this.form).then(res => {
          if (res.status == 1) {
            this.search = ''
            this.addForm = false
            this.getFunctionList()
            this.$message(res.message)
          }
        })

      },
      cancelEdit(row) {
        console.log(row)
        row.edit = false
        row.title = row.originalTitle
        row.type = row.originalType
        row.description = row.originalDescription


        this.$message({
          message: '放弃编辑',
          type: 'warning'
        })
      },
      confirmEdit(row) {
        row.edit = false
        row.originalType = row.type
        row.originalDescription = row.description
        row.originalTitle = row.title
        editFunction(row.id, row).then(res => {
          if (res.status == 1) {
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
            this.getFunctionList()
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
          deleteFunction(rowId).then(res => {
            if (res.status == 1) {
              this.getFunctionList()
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

</style>
