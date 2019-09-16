<template>

  <div>
    <el-table
      ref="multipleTable"
      :data="elesData.filter(data => !search || data.title.toLowerCase().includes(search.toLowerCase()))"
      fit highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        label="ID"
        width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" label="元素名称">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.title" class="edit-input" size="small"/>
          </template>
          <span v-else>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" label="查找方式">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.type" class="edit-input" size="small"/>
          </template>
          <span v-else>{{ row.type }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" label="元素位置">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.loc" class="edit-input" size="small"/>
          </template>
          <span v-else>{{ row.loc }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="update_datetime"
        label="更新时间">
      </el-table-column>
      <el-table-column align="center" label="操作" width="300">
        <template slot="header" slot-scope="scope">
          <el-button type="primary" @click="addForm=true">新增<i class="el-icon-plus el-icon--right"></i>
          </el-button>
          <el-input
            v-model="search"
            size="mini"
            placeholder="输入元素名称搜索"/>
        </template>
        <template slot-scope="{row}">
          <div v-if="row.edit">
            <el-button
              type="success"
              size="small"
              icon="el-icon-circle-check-outline"
              @click="confirmEdit(row)"
            >
              确定
            </el-button>
            <el-button
              class="cancel-btn"
              size="small"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelEdit(row)"
            >
              取消编辑
            </el-button>
          </div>

          <div v-else>
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="row.edit=!row.edit"
            >
              编辑
            </el-button>
            <el-button
              type="primary"
              size="small"
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
        <el-form-item label="元素标题：" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="查找方式：" :label-width="formLabelWidth">
          <el-input v-model="form.type" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="元素位置：" :label-width="formLabelWidth">
          <el-input v-model="form.loc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addForm = false">取 消</el-button>
        <el-button type="primary" @click="addElement">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import {getElementList, postElement, editElement, deleteElement} from "@/api/api";

  export default {
    name: 'elementTable',
    data() {
      return {
        search: '',
        eleTitle: '',
        elesData: [],
        addForm: false,
        editFormVisible: false,
        deleteDialogVisible: false,
        form: {
          title: '',
          type: '',
          loc: '',
        },
        formLabelWidth: '120px'
      }
    },

    methods: {
      addElement() {

        postElement(this.$route.params.id, this.$route.params.page_id, this.form).then(res => {
          if (res.status == 1) {
            this.addForm = false
            this.$alert(res.msg)
            this.getElementData()
            this.search = ''
          } else {
            this.$alert(res.msg)
          }
        })
      },
      confirmEdit(row) {
        row.edit = false
        row.originalTitle = row.title
        row.originalLoc = row.loc
        row.originalType = row.type
        editElement(this.$route.params.id, this.$route.params.page_id, row.id, row).then(res => {
          if (res.status == 1) {
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
            this.getElementData()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      },
      cancelEdit(row) {
        row.title = row.originalTitle
        row.loc = row.originalLoc
        row.type = row.originalType
        row.edit = false

        this.$message({
          message: '放弃编辑',
          type: 'warning'
        })
      },
      deleteRow(rowId) {
        this.$confirm('确定删除?', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
            deleteElement(this.$route.params.id, this.$route.params.page_id, rowId).then(res => {
              if (res.status == 1) {
                this.getElementData()
                this.search = ''
                this.$message({
                  type: 'info',
                  message: res.msg
                });
              } else {
                this.$alert(res.msg)
              }
            })
          }
        ).catch(() => {
        })
      },
      getElementData() {
        let project_id = this.$route.params.id
        let pa_id = this.$route.params.page_id
        getElementList(project_id, pa_id).then(
          res => {
            if (res.data.data_list.length > 0) {
              this.elesData = res.data.data_list.map(v => {
                this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
                v.originalTitle = v.title //  will be used when user click the cancel botton
                v.originalType = v.type //  will be used when user click the cancel botton
                v.originalLoc = v.loc //  will be used when user click the cancel botton
                return v
              })
            } else {
              this.elesData = res.data.data_list
            }
          },
          err => {
            console.log(err);
          }
        )
      },
    },
    mounted() {
      if (this.$route.params.page_id) {
        this.getElementData()

      }
    },
    watch: {
      '$route'(to, from) { //监听路由是否变化
        if (to.params.page_id) {// 判断条件1  判断传递值的变化
          this.getElementData()
        }
      }
    }
  }
</script>

<style>
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }

  .el-dropdown-menu__item {
    padding: 0
  }

  .pg {
    padding: 0 20px
  }
</style>
