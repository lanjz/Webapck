<template>
  <div class="catalogs-layout">
    <div v-if="isNewDir === item['_id']">
      <TreeItem
        :item="newDir"
        :curCatalog="curCatalog"
        :isNewDir="isNewDir"
        @emitChooseCatalog="chooseCatalog"
        @emitModifyCatalogName="modifyCatalogName"
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
        @emitModifyCatalogName="modifyCatalogName"
        @emitDoCreateTemDir="doCreateTemDir"
      ></TreeItem>
      <Tree :parentId="item['_id']" :treeNode="getTreeNode(item, index)" :isNewDir="createNewDir" v-if="createNewDir||item.hasChild"></Tree>
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
        type: String,
        default: function () {
          return ''
        }
      }
    },
    components: {
      TreeItem
    },
    data() {
      return {
        operateMenuStyle: { left: -1, top: '50%'},
        createNewDir: '',
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
        ACTIONS.CATALOGS_PUT
      ]),
      async getDate(){
        await this[ACTIONS.CATALOGS_GET]({ parentId: this.parentId })
      },
      init() {
        if(!this.createNewDir) {
          this.getDate()
        }
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
      async modifyCatalogName(name, item) {
        const { _id, isNew } = item
        let result = null
        if(isNew) {
          result = await this[ACTIONS.CATALOGS_PUT]({
            id: _id,
            name,
          })
        } else {
          result = await this[ACTIONS.CATALOGS_POST]({
            parentId: this.parentId,
            name,
          })
        }
        if(!result.err) {
          this.getDate()
        }
      },
      // 创建新的文件夹存入store
      doCreateTemDir({ _id }) {
        this.parentId = _id
        this.createNewDir = id
        // this[MUTATIONS.CATALOGS_TEMPLATE_CREATE](_id)
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
