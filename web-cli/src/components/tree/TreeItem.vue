<template>
  <div class="catalogs-layout">
    <div
      v-if="catalogs[parentId]"
      v-for="(item, index) in catalogs[parentId]"
      :key="index"
    >
      <div
        class="flex align-items-center catalogs-item-layout"
        @click="chooseCatalog(item, index)"
        :class="{'act': curCatalog['_id'] === item['_id']}"
      >
        <div class="iconfont">
          <svg class="icon icon-close" aria-hidden="true">
            <use xlink:href="#icon-wenjian2"></use>
          </svg>
          <svg class="icon  icon-open" aria-hidden="true">
            <use xlink:href="#icon-wenjian-"></use>
          </svg>
        </div>
        <div class="catalogs-name line-ellipsis">
          {{item.name}}
        </div>
      </div>
      <TreeItem :parentId="item['_id']" :treeNode="getTreeNode(item, index)" v-if="item.hasChild"></TreeItem>
    </div>
  </div>
</template>
<script>
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
  import * as MUTATIONS from '../../store/const/mutaions'
  import * as ACTIONS from '../../store/const/actions'
  export default {
    name: 'TreeItem',
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
    cursor:pointer;
    .iconfont{
      font-size: 25px;
      margin-right: 5px;
      position: relative;
      z-index: 1;
    }
    .catalogs-layout{
      padding-left: 20px;
    }
    .catalogs-item-layout{
      padding: 2px 25px;
      position: relative;
      .icon-open{
        display: none;
      }
      .icon-close{
        display: block;
      }
    }
    .catalogs-item-layout.act{
      background: @bg-second-color;
      color: #fff;
      .icon-open{
        display: block;
      }
      .icon-close{
        display: none;
      }
    }
    .catalogs-item-layout.act:after{
      content: '';
      background: inherit;
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      left: -100%;
    }
    .catalogs-item-layout:hover{
      background: @border-color
    }
    .catalogs-item-layout:hover:after{
      background: inherit
    }
    .catalogs-item-layout.act:hover{
      background: @bg-second-color
    }
  }
  .catalogs-name{
    position: relative;
    z-index: 1;
    max-width: 150px;
  }

</style>
