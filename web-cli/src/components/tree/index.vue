<template>
  <div class="catalogs-layout">
    <div v-if="isNewDir" :abc="isNewDir">
      <TreeItem
        :item="newDir"
        :curCatalog="curCatalog"
        :isNewDir="isNewDir"
        @emitChooseCatalog="chooseCatalog"
        @emitSubmitCatalogName="submitCatalogName"
        @emitDoCreateTemDir="doCreateTemDir"
      ></TreeItem>
    </div>
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
        @emitSubmitCatalogName="submitCatalogName"
        @emitDoCreateTemDir="doCreateTemDir"
      ></TreeItem>
      <Tree
        :parentId="item['_id']"
        :treeNode="getTreeNode(item, index)"
        :isNewDir="isNewCondition(item)"
        v-if="(newDir.parentId === item['_id'])||item.hasChild">
      </Tree>
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
      },
      isNewDir: {
        type: Boolean,
        default: function () {
          return false
        }
      }
    },
    components: {
      TreeItem
    },
    data() {
      return {
        operateMenuStyle: { left: -1, top: '50%'},
        newDir: {
          parentId: '',
          name: '新建文件夹',
          show: false,
          isNew: true
        }
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
        MUTATIONS.CATALOGS_CUR_SAVE,
        MUTATIONS.CATALOGS_TEMPLATE_CREATE
      ]),
      ...mapActions([
        ACTIONS.CATALOGS_GET,
        ACTIONS.CATALOGS_PUT,
        ACTIONS.CATALOGS_POST
      ]),
      async getDate(){
        await this[ACTIONS.CATALOGS_GET]({ parentId: this.parentId })
      },
      init() {
        console.log('isNewDir', this.isNewDir, this.parentId)
        if(!this.isNewDir) {
          this.getDate()
        }
      },
      isNewCondition(item) {
        return this.newDir.parentId === item['_id']
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
        const { offsetX, offsetY } = e
        this.operateMenuStyle = {
          top: `${offsetY}px`,
          left: `${offsetX}px`
        }
      },
      submitCatalogName(name, item) {
        const { isNew } = item
        if(!isNew) {
          this.modifyCatalogName(name, item)
          return
        }
        this.addCatalog(name, item)
      },
      async modifyCatalogName(name, item) {
        const { _id } = item
        const result = await this[ACTIONS.CATALOGS_PUT]({
          id: _id,
          name,
        })
        if(!result.err) {
          this.getDate()
        }

      },
      async addCatalog(name, item) {
        const { parentId } = item
        const result = await this[ACTIONS.CATALOGS_POST]({
          parentId,
          name
        })
        this.newDir.parentId = ''
        console.log('this.newDir.parentId', this.newDir.parentId)
        if(!result.err) {
          this.getDate()
        }
      },
      // 创建新的文件夹存入store
      doCreateTemDir({ _id }) {
        this.newDir.parentId = _id
      }
    },
    mounted() {
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
