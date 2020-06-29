<template>
  <div>
    <div slot="header" class="clearfix">
      <el-button-group>
        <el-button type="info" size="small" @click="showNav('page')">页面对象PO</el-button>
        <el-button type="info" size="small" @click="showNav('case')">用例</el-button>
        <el-button type="info" size="small" @click="showNav('suit')">用例集</el-button>
      </el-button-group>
      <h3>{{asideTitle}}</h3>
      <el-button-group>
        <el-button size="mini" type="primary"
                   @click="copyNode">复制
        </el-button>
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
    <div class="text item">
      <el-tree
        class="filter-tree"
        :data="dataList"
        node-key="id"
        :filter-node-method="filterNode"
        draggable
        @node-click="nodeClick"
        @node-drop="nodeDrop"
        :expand-on-click-node="true"
        :auto-expand-parente="true"
        :highlight-current="true"
        ref="tree">
      </el-tree>
    </div>


    <!--    添加-->

    <el-dialog title="添加" :visible.sync="addForm" align="left" :modal="false">
      <el-form :model="form">
        <el-form-item label="选择父级：" :label-width="formLabelWidth">
          <el-popover
            placement="bottom"
            title="选择父级"
            width="200"
            trigger="hover"
            content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
            <div>
              <select-tree :dataList="dataList" @addNodeClick="addNodeClick"></select-tree>
            </div>
            <el-button slot="reference" size="mini">{{addFormSelectTitle?addFormSelectTitle:'请选择父级,不选择父级则为根节点'}}
            </el-button>
          </el-popover>
        </el-form-item>
        <el-form-item label="标题：" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off" @keyup.enter.native="addNode"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addForm = false">取 消</el-button>
        <el-button type="primary" @click="addNode">确 定</el-button>
      </div>
    </el-dialog>

    <!--    编辑-->

    <el-dialog title="编辑" :visible.sync="editFormVisible" align="left" :modal="false">
      <el-form :model="form">
      </el-form>
      <el-form :model="form">
        <el-form-item label="选择父级：" :label-width="formLabelWidth">
          <el-popover
            placement="bottom"
            title="选择父级"
            width="200"
            trigger="hover"
            content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
            <div>
              <select-tree :dataList="dataList" @addNodeClick="editNodeClick"></select-tree>
            </div>
            <el-button slot="reference" size="mini">{{editFormSelectTitle?editFormSelectTitle:'请选择父级,不选择父级则为根节点'}}
            </el-button>
          </el-popover>
        </el-form-item>
        <el-form-item label="标题：" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off" @keyup.enter.native="editNode"></el-input>
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
        asideTitle: state => state.tableData.asideTitle,
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
        currentNav: '',
        form: {
          pId: 0,
          title: ''
        }
      }
    },
    methods: {
      showNav(nav) {
        this.$store.dispatch('tableData/setNavVisible', nav)
        this.currentNav = nav
      },

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

        this.form.pId = data.treeData.id
        this.addFormSelectTitle = data.treeData.title
      },
      editNodeClick(data) {
        this.form.pId = data.treeData.id
        this.editFormSelectTitle = data.treeData.title
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
      copyNode() {
        this.$store.dispatch('tableData/copySelectData', {"currentSelectId": this.currentSelectId})
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
        this.$store.dispatch('tableData/editSelectData', {"edit_id": edit_id, "parentId": pId})
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
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
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
    width: 210px;
  }
</style>
