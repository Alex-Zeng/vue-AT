<template>
  <el-container class="root_container">
    <div class="app-container">
      <el-table v-loading="listLoading"
                :data="dataList.filter(data => !search || data.title.toLowerCase().includes(search.toLowerCase()))"
                fit highlight-current-row style="width: 100%"
                size="mini">

        <el-table-column align="center" label="ID" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>

        <el-table-column width="300px" label="方法名">
          <template slot-scope="{row}">
            <template v-if="row.edit">
              <el-input v-model="row.title" class="edit-input" size="mini"/>
            </template>
            <span v-else>{{ row.title }}</span>
          </template>
        </el-table-column>

        <el-table-column width="200px" label="适用设备">
          <template slot-scope="{row}">
            <template v-if="row.edit">
              <el-select v-model="row.type" placeholder="请选择设备" size="mini">
                <el-option v-for="(v,k) in typeData" :label="v" :value="k" :key="k" ></el-option>
              </el-select>
            </template>
            <span v-else>{{ typeData[row.type]}}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="300px" label="方法描述">
          <template slot-scope="{row}">
            <template v-if="row.edit">
              <el-input v-model="row.description" class="edit-input" size="mini"/>
            </template>
            <span v-else>{{ row.description }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="300">
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
        <el-form :model="form">
          <el-form-item label="方法名：" :label-width="formLabelWidth">
            <el-input v-model="form.title" autocomplete="off"></el-input>
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
  </el-container>

</template>

<script>
  import vHead from '@/components/common/Head'
  import {getProjectList, getFunctionList, postFunction, editFunction, deleteFunction} from '../../api/api'

  export default {

    name: "Function",
    components: {
      vHead,
    },
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
          description: "",
        }
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        getFunctionList().then(res => {
          if (res.status == 1 && res.data.data_list.length > 0) {
            this.dataList = res.data.data_list.map(v => {
              this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
              v.originalTitle = v.title //  will be used when user click the cancel botton
              v.originalType = v.type //  will be used when user click the cancel botton
              v.originalDescription = v.description //  will be used when user click the cancel botton
              return v
            })
          }
        })
        this.listLoading = false
      },
      addFunction() {
        postFunction(this.form).then(res => {
          if (res.status == 1) {
            this.search = ''
            this.addForm = false
            this.getList()
            this.$message(res.msg)
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
            this.getList()
          } else {
            this.$message({
              message: res.msg,
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
              this.getList()
              this.search = ''
              this.$message({
                type: 'info',
                message: res.msg
              });
            } else {
              this.$alert(res.msg)
            }
          })
        });
      }
    },
  }
</script>

<style scoped lang="less">
  .el-header {
    padding: 0 !important;
  }

  .root_container {
    min-width: 1200px;
  }

  .el-aside {
    color: #333;
    padding-top: 20px;
  }

  .el-main {
    color: #333;
    text-align: center;

  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .edit-input {
    padding-right: 100px;
  }

  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
</style>
