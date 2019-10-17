<template>
  <div>
    <!--    <div style="margin-bottom: 20px;">-->
    <!--      <el-button-->
    <!--        size="small"-->
    <!--        @click="addTab(editableTabsValue)"-->
    <!--      >-->

    <!--      </el-button>-->
    <!--    </div>-->
    <el-tabs v-model="$store.state.tabViews.editableTabsValue+''" type="card" closable @tab-remove="removeTab"
             @tab-click="handleClick">
      <el-tab-pane
        v-for="(item, index) in $store.state.tabViews.visitedViews"
        :key="item.index"
        :label="item.title"
        :name="item.index+''"
      >
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>

  export default {
    name: 'tabViews',
    data() {
      return {}
    },
    methods: {
      handleClick(tab, event) {
        this.$store.dispatch('tabViews/changeView', tab.name)
        this.$router.push({path: this.$store.state.tabViews.visitedViews[tab.index].fullPath})
      },
      removeTab(targetName) {
        this.$store.dispatch('tabViews/delView', targetName)
        let toPath
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
