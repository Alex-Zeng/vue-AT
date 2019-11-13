<template>
  <div>
    <el-tabs v-model="$store.state.tabViews.editableTabsValue+''" type="card" closable @tab-remove="removeTab"
             @tab-click="handleClick">
      <el-tab-pane
        v-for="(item, index) in visitedViews"
        :key="item.index"
        :label="item.title"
        :name="item.index+''"
      >

      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import {mapGetters, mapState} from 'vuex';

  export default {
    name: 'tabViews',
    data() {
      return {}
    },
    computed: {
      ...mapState({
        visitedViews: state => state.tabViews.visitedViews,
      }),
    },
    methods: {
      async handleClick(tab, event) {
        if (this.$store.state.tabViews.editableTabsValue != tab.name) {
          await this.$store.dispatch('tabViews/changeView', tab.name)
          // console.log(this.$store.state.tabViews.visitedViews[tab.index])

          this.$router.push({
            name: this.$store.state.tabViews.visitedViews[tab.index].name,
            params: this.$store.state.tabViews.visitedViews[tab.index].params
          })
        }

      },
      removeTab(targetName) {
        this.$store.dispatch('tabViews/delView', targetName)
        let toPath = '/home'
        // 还有tab,则循环列表,路由跳转到当前选中的tab页面
        if (this.$store.state.tabViews.visitedViews) {
          for (const item of this.$store.state.tabViews.visitedViews) {
            if (this.$store.state.tabViews.editableTabsValue == item.index) {
              toPath = item.fullPath
            }
          }
          this.$router.push({path: toPath})
        }
      }
    }
  }
</script>
