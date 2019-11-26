<template>

  <div>
    <el-table
      ref="multipleTable"
      :data="$store.state.tableData.elementData.filter(data => !search || data.title.toLowerCase().includes(search.toLowerCase()))"
      fit highlight-current-row
      size="small"
    >

      <el-table-column
        label="所属页面"
        width="180">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-select v-model="scope.row.page_id" placeholder="请选择操作" size="mini">
              <el-option v-for="item in $store.state.tableData.pageData" :label="item.title" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </template>
          <span v-else>{{ scope.row.page_title }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" label="元素名称">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.title" class="edit-input" size="mini"/>
          </template>
          <span v-else>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" label="查找方式">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-select v-model="row.type" placeholder="请选择操作" size="mini">
              <el-option v-for="item in findType" :label="item" :value="item" :key="item.index"></el-option>
            </el-select>
          </template>
          <span v-else>{{ row.type }}</span>
        </template>
      </el-table-column>

      <el-table-column label="元素位置">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.loc" class="edit-input" size="mini"/>
          </template>
          <span v-else>{{ row.loc }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="update_datetime"
        label="更新时间">
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
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
        <el-form-item label="元素标题：" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="查找方式：" :label-width="formLabelWidth">
          <el-select v-model="form.type" placeholder="请选择查找方式" size="mini">
              <el-option v-for="item in findType" :label="item" :value="item" :key="item.index"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="元素位置："  :label-width="formLabelWidth">
          <el-input v-model="form.loc" placeholder="根据查找方式,填写元素位置" autocomplete="off"></el-input>
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
          type: 'xpath',
          loc: '',
        },
        findType:['xpath','id','css','class','tag','tap_by_proportional','tap_by_coordinates','android_uiautomator','accessibility_id'],
        formLabelWidth: '120px'
      }
    },

    methods: {
      getElementData() {
        this.$store.dispatch('tableData/getElementData', {
          "projectId": this.$route.params.id,
          "pageId": this.$route.params.page_id
        })
      },
      addData() {

        postElement(this.$route.params.id, this.$route.params.page_id, this.form).then(res => {
          if (res.status == 1) {
            this.getElementData()
            this.addForm = false
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.search = ''
          } else {
            this.$alert(res.message)
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
            this.getElementData()
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        })
      },
      cancelEdit(row) {
        row.title = row.originalTitle
        row.loc = row.originalLoc
        row.type = row.originalType
        row.edit = !row.edit
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
                  message: res.message
                });
              } else {
                this.$alert(res.message)
              }
            })
          }
        ).catch(() => {
        })
      },
    },
    created() {
      this.getElementData()
    }
  }
</script>

<style>

</style>
