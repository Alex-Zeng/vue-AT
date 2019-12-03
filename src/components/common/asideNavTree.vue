<template>
  <div>
    <div align="center">
      <h5>页面对象PO</h5>
      <el-button-group>
        <el-button size="mini" type="primary" icon="el-icon-plus"
                   @click="addForm=true;form.title='';form.pId=0;addFormSelectTitle='';"></el-button>
        <el-button size="mini" type="primary" icon="el-icon-edit"
                   @click="editFormVisible=true;form.title=currentSelectRow.title;form.pId=currentSelectRow.parent_directory"></el-button>
        <el-popover
          placement="top"
          width="160"
          v-model="deleteVisible">
          <p>确定删除: {{currentSelectRow.title}} 吗？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="deleteVisible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="deleteSelect">确定</el-button>
          </div>
          <el-button slot="reference" size="mini" type="primary" icon="el-icon-delete"></el-button>
        </el-popover>
      </el-button-group>
    </div>
    <el-tree
      class="filter-tree"
      :data="dataList"
      node-key="id"
      default-expand-all
      :filter-node-method="filterNode"
      draggable
      @node-click="nodeClick"
      @node-drop="nodeDrop"
      :expand-on-click-node="false"
      :highlight-current="true"
      ref="tree">
    </el-tree>

    <!--    添加-->

    <el-dialog title="添加" :visible.sync="addForm" align="left">
      <el-form :model="form">
        <el-form-item label="选择父级：" :label-width="formLabelWidth">
          <span>{{addFormSelectTitle?addFormSelectTitle:'不选择父级则为根节点'}}</span>
        </el-form-item>
        <el-form-item label="选择父级：" :label-width="formLabelWidth">
          <select-tree :dataList="dataList" @addNodeClick="addNodeClick"></select-tree>
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addForm = false">取 消</el-button>
        <el-button type="primary" @click="addNode">确 定</el-button>
      </div>
    </el-dialog>

    <!--    编辑-->

    <el-dialog title="编辑" :visible.sync="editFormVisible" align="left">
      <el-form :model="form">
      </el-form>
      <el-form :model="form">
        <el-form-item label="选择父级：" :label-width="formLabelWidth">
          <span>{{editFormSelectTitle?editFormSelectTitle:'不选择父级则为根节点'}}</span>
        </el-form-item>
        <el-form-item label="父级：" :label-width="formLabelWidth">
          <select-tree :dataList="dataList" @addNodeClick="editNodeClick"></select-tree>
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editNode">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {mapState} from "vuex"
  import selectTree from '@/components/common/selectTree'

  export default {
    name: "asideNavTree",
    components: {selectTree},
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      },
    },
    computed: {
      ...mapState({  //这里的...不是省略号了,是对象扩展符
        dataList: state => state.tableData.asideTreeData,
        visible: state => state.tableData.visible,
        proId: state => state.tableData.curreentProId,
      })
    },
    data() {
      return {
        filterText: '',
        currentSelectId: '',
        currentSelectRow: '',
        deleteVisible: false,
        addForm: false,
        addFormSelectTitle: '',
        editFormSelectTitle: '',
        editFormVisible: false,
        formLabelWidth: '120px',
        form: {
          pId: 0,
          title: ''
        }
      }
    },
    methods: {
      nodeClick(data) {

        this.currentSelectId = data.id
        this.currentSelectRow = data
        this.editFormSelectTitle = data.parent_title
        if (this.visible == 1) {
          this.$router.push({name: 'page', params: {id: this.proId, page_id: data.id}})
          this.$store.dispatch('tabViews/addView', {"route": this.$route, "title": ': ' + data.title})
        } else if (this.visible == 2) {
          this.$router.push({name: 'case', params: {id: this.proId, case_id: data.id}})
          this.$store.dispatch('tabViews/addView', {"route": this.$route, "title": ': ' + data.title})
        } else if (this.visible == 3) {
          this.$router.push({name: 'suit', params: {id: this.proId, suit_id: data.id}})
          this.$store.dispatch('tabViews/addView', {"route": this.$route, "title": ': ' + data.title})
        }
      },
      addNodeClick(data) {
        this.form.pId = data.id
        this.addFormSelectTitle = data.title
      },
      editNodeClick(data) {
        this.form.pId = data.id
        this.editFormSelectTitle = data.title
      },

      addNode() {
        let title = this.form.title
        let pId = this.form.pId
        this.$store.dispatch('tableData/addAsideTreeData', {"title": title, "parentId": pId})
        this.addForm = false
      },
      editNode() {

        let title = this.form.title
        let pId = this.form.pId
        let editId = this.currentSelectId
        this.$store.dispatch('tableData/editSelectData', {"edit_id": editId, "title": title, "parentId": pId})
        this.editFormVisible = false
      },
      nodeDrop(draggingNode, dropNode, dropType, ev) {
        let edit_id = draggingNode.data.id
        let pId = 0
        if (dropType == 'inner') {
          pId = dropNode.data.id
        } else {
          if (dropNode.parent.data.id) {
            pId = dropNode.parent.data.id
          } else {
            pId = 0
          }
        }
        this.$store.dispatch('tableData/editSelectData', {"edit_id": edit_id,"parentId": pId})
      },
      deleteSelect() {
        this.deleteVisible = false
        this.$store.dispatch('tableData/deleteSelectData', this.currentSelectId)
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      }
    }
  }
</script>

<style scoped>

</style>
