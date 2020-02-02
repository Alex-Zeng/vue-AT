<template>
  <div>
    <el-tabs v-model="$store.state.tabViews.editableTabsValue+''" type="card"
             @tab-click="handleClick">
      <el-tab-pane
        class="mytabitem"
        v-for="(item, index) in visitedViews"
        :key="item.index"
        :name="item.index+''"
      >
        <div slot="label" @contextmenu.prevent="rightClick(item,$event)">{{item.title}}</div>
      </el-tab-pane>
    </el-tabs>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="closeMenu">取消</li>
      <li @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags">关闭所有</li>
    </ul>
  </div>

</template>
<script>
  import { mapState} from 'vuex';

  export default {
    inject:['reload'],
    name: 'tabViews',
    data() {
      return {
        visible: false,
        top: 0,
        left: 0,
        selectedTag: {},
        affixTags: []
      }
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
          this.$router.push({
            name: this.$store.state.tabViews.visitedViews[tab.index].name,
            params: this.$store.state.tabViews.visitedViews[tab.index].params
          })
        }
        this.visible = false
      },
      rightClick(tag, e) {
        const menuMinWidth = 105
        const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
        const offsetWidth = this.$el.offsetWidth // container width
        const maxLeft = offsetWidth - menuMinWidth // left boundary
        const left = e.clientX - offsetLeft // 15: margin right

        if (left > maxLeft) {
          this.left = maxLeft
        } else {
          this.left = left
        }

        this.top = e.clientY
        this.visible = true
        this.selectedTag = tag
      },
      closeSelectedTag(tag) {
        this.$store.dispatch('tabViews/delView', tag.index)
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
        this.visible = false
      },
      refreshSelectedTag() {
        this.reload()
        this.visible = false
      },
      closeOthersTags() {
        this.$store.dispatch('tabViews/delOthersViews', this.selectedTag)
        this.$router.push(this.selectedTag.path)
        this.visible = false
      },
      closeAllTags() {
        this.$store.dispatch('tabViews/delAllViews')
        this.$router.push({name: 'home'})
        this.visible = false
      },
      closeMenu(){
        this.visible = false
      }
    }
  }
</script>
<style lang="less">

  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);

    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;

      &:hover {
        background: #eee;
      }
    }
  }
</style>
