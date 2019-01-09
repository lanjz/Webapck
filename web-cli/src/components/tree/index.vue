<template>
  <div class="catalogs-layout">
    <div
      v-if="catalogs[parentId]"
      v-for="(item, index) in catalogs[parentId]"
      :key="index"
    >
      <TreeItem
        :item="item"
        :index="index"
        :curCatalog="curCatalog"
        @emitChooseCatalog="chooseCatalog"
      ></TreeItem>
      <Tree :parentId="item['_id']" :treeNode="getTreeNode(item, index)" v-if="item.hasChild"></Tree>
    </div>
  </div>
</template>
<script>
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
  import * as MUTATIONS from '../../store/const/mutaions'
  import * as ACTIONS from '../../store/const/actions'
  import TreeItem from './TreeItem'
  export default {
    name: 'Tree',
    props: {
      parentId: {
        type: String,
        require: true
      },
      treeNode: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    components: {
      TreeItem
    },
    data() {
      return {
        operateMenuStyle: { left: -1, top: '50%'}
      }
    },
    computed: {
      ...mapState({
        catalogs: state => state.catalogs.catalogs,
        curCatalog: state => state.catalogs.curCatalog,
      }),
    },
    methods: {
      ...mapMutations([
        MUTATIONS.CATALOGS_CUR_SAVE
      ]),
      ...mapActions([
        ACTIONS.CATALOGS_GET
      ]),
      async getDate(){
        await this[ACTIONS.CATALOGS_GET]({ parentId: this.parentId })
      },
      init() {
        this.getDate()
      },
      chooseCatalog(data, index) {
        this[ MUTATIONS.CATALOGS_CUR_SAVE]({
          data,
          treeNode: this.getTreeNode(data, index)
        })
      },
      getTreeNode(data, index) {
        return [ ...this.treeNode, { ...data, showIndex: index } ]
      },
      showOperateMenu(e) {
        console.log('e', e)
        const { offsetX, offsetY } = e
        this.operateMenuStyle = {
          top: `${offsetY}px`,
          left: `${offsetX}px`
        }
      }
    },
    mounted() {
      console.log('this', this.$store.state)
      this.init()
    }
  }
</script>
<style lang="less" scoped>
  .catalogs-layout{
    .catalogs-layout{
      padding-left: 20px;
    }
  }
</style>
