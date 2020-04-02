<template>
    <el-tree
      class="filter-tree"
      :data="dataList"
      node-key="id"
      :filter-node-method="filterNode"
      @node-click="addNodeClick"
      :highlight-current="true"
      ref="tree">
    </el-tree>
</template>

<script>

  export default {
    name: "selectTree",
    props:['dataList','row'],
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      },
    },
    computed: {

    },
    data() {
      return {
        filterText: '',
        currentSelectId: '',
        currentSelectRow: '',
        deleteVisible: false,
        addForm: false,
        editFormVisible: false,
        form:{
          pId:'无父级',
          title:''
        }
      }
    },
    methods: {

      addNodeClick(treeData) {
        let data = {
          treeData:treeData,
          row:this.row
        }
        this.$emit('addNodeClick', data)
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
