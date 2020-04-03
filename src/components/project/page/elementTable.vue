<template>

  <div>
    <el-table
      ref="multipleTable"
      :data="$store.state.tableData.elementData.filter(data => !search || data.title.toLowerCase().includes(search.toLowerCase()))"
      fit highlight-current-row
      size="small"
      :row-class-name="tableRowClassName"
    >

      <el-table-column
        label="所属页面"
        width="180">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-popover
              placement="left"
              title="选择页面"
              width="200"
              trigger="hover"
              content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
              <div>
                <select-tree :dataList="pageData" :row="scope.row" @addNodeClick="editNodeClick"></select-tree>
              </div>
              <el-button slot="reference" size="mini">{{scope.row.page_title?scope.row.page_title:'请选择页面'}}</el-button>
            </el-popover>
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
      <el-table-column width="150px" label="Android查找方式">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-select v-model="row.type_for_android" placeholder="请选择操作" size="mini">
              <el-option v-for="item in findType" :label="item" :value="item" :key="item.index"></el-option>
            </el-select>
          </template>
          <span v-else>{{ row.type_for_android }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Android元素位置">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.loc_for_android" class="edit-input" size="mini"/>
          </template>
          <span v-else>{{ row.loc_for_android }}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" label="IOS查找方式">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-select v-model="row.type_for_ios" placeholder="请选择操作" size="mini">
              <el-option v-for="item in findType" :label="item" :value="item" :key="item.index"></el-option>
            </el-select>
          </template>
          <span v-else>{{ row.type_for_ios }}</span>
        </template>
      </el-table-column>

      <el-table-column label="IOS元素位置">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.loc_for_ios" class="edit-input" size="mini"/>
          </template>
          <span v-else>{{ row.loc_for_ios }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="update_datetime"
        label="更新时间">
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot="header" slot-scope="scope">

          <el-button type="primary" @click="openAddForm" size="mini">新增<i class="el-icon-plus el-icon--right"></i>
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
              @click="copyData(row)"
            >复制
            </el-button>
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
        <el-form-item label="Android查找方式：" :label-width="formLabelWidth">
          <el-select v-model="form.type_for_android" placeholder="请选择查找方式" size="mini">
            <el-option v-for="item in findType" :label="item" :value="item" :key="item.index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Android元素位置：" :label-width="formLabelWidth">
          <el-input v-model="form.loc_for_android" placeholder="根据查找方式,填写元素位置" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="IOS查找方式：" :label-width="formLabelWidth">
          <el-select v-model="form.type_for_ios" placeholder="请选择查找方式" size="mini">
            <el-option v-for="item in findType" :label="item" :value="item" :key="item.index"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="IOS元素位置：" :label-width="formLabelWidth">
          <el-input v-model="form.loc_for_ios" placeholder="根据查找方式,填写元素位置" autocomplete="off"></el-input>
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
  import selectTree from '@/components/common/selectTree'
  import {mapState} from "vuex"

  export default {
    name: 'elementTable',
    components: {selectTree},
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
          type: 'id',
          loc_for_ios: '',
          type_for_ios: '',
          loc_for_android: '',
          type_for_android: '',
        },
        findType: ['xpath', 'id', 'ios_predicate', 'css', 'class', 'tag', 'tap_by_proportional', 'tap_by_coordinates', 'android_uiautomator', 'ios_uiautomation', 'accessibility_id', 'ios_class_chain', 'no_need'],
        formLabelWidth: '160px'
      }
    },
    computed: {
      ...mapState({  //这里的...不是省略号了,是对象扩展符
        pageData: state => state.tableData.pageData,

      })
    },
    methods: {
      editNodeClick(data) {
        if (data.row) {
          data.row.page_title = data.treeData.title
          data.row.page_id = data.treeData.id
          data.row.action_id = ''
        }
        this.form.page_title = data.treeData.title
        this.form.page_id = data.treeData.id
        this.getActionData(data.treeData.id)
      },
      tableRowClassName({row, rowIndex}) {
        if (this.$route.query.eleId == row.id) {
          return 'danger-row';
        }
        return '';
      },
      getElementData() {
        this.$store.dispatch('tableData/getElementData', {
          "projectId": this.$route.params.id,
          "pageId": this.$route.params.page_id
        })

      },
      openAddForm() {
        this.addForm = true
        form.title = ''
        form.type = 'id'
        form.title = ''
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
      copyData(row) {
        postElement(this.$route.params.id, this.$route.params.page_id, row).then(res => {
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
        row.originalLocAndroid = row.loc_for_android
        row.originalType = row.type_for_android
        row.originalTypeIos = row.type_for_ios
        row.originalLocIos = row.loc_for_ios
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
        row.loc_for_android = row.originalLocAndroid
        row.type_for_android = row.originalTypeAndroid
        row.loc_for_ios = row.originalLocIos
        row.type_for_ios = row.originalTypeIos
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

  .el-table .danger-row {
    background: #ff7a62;
  }
</style>
