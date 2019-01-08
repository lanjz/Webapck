<template>
  <div>
    <div
      class="catalogs-item-layout flex align-items-center"
      v-if="catalogs[parentId]"
      v-for="(item, index) in catalogs[parentId]"
      :key="index"
    >
      <i class="iconfont icon-wenjian"></i>
      <div class="catalogs-name">
        {{item.name}}
      </div>
      <div class="catalogs-edit-layout flex">
        <div class="catalogs-modify">
          <i class="iconfont icon-bianji"></i>
        </div>
        <div class="catalogs-delete">
          <i class="iconfont icon-shanchu"></i>
        </div>
      </div>
      <TreeItem :parentId="item['_id']"></TreeItem>
    </div>
  </div>
</template>
<script>
  import { mapState, mapActions } from 'vuex'
  // import * as MUTATIONS from '../../store/const/mutaions'
  import * as ACTIONS from '../../store/const/actions'
  export default {
    name: 'TreeItem',
    props: {
      parentId: {
        type: String,
        require: true
      }
    },
    computed: {
      ...mapState(['catalogs'])
    },
    methods: {
      ...mapActions([
        ACTIONS.CATALOGS_GET
      ]),
      async getDate(){
        await this[ACTIONS.CATALOGS_GET]({ parentId: this.parentId })
      },
      init() {
        this.getDate()
      }
    },
    mounted() {
      console.log('this', this.$store.state)
      this.init()
    }
  }
</script>
<style lang="less" scoped>
  .catalogs-item-layout{
    cursor:pointer;
    padding: 3px 0;
    .iconfont{
      font-size: 20px;
    }
  }
  .catalogs-item-layout.act{
    .iconfont{
      color: @highlight-color
    }
  }
  .catalogs-tree{
    font-size: 15px;
    position: relative;
    /*padding-top: 7px;*/
    /*border: solid 1px #000;*/
    .catalogs-tree{
      margin-left: 10px;
      padding-left: 10px;
      font-size: 14px;
      border-bottom: none;
    }
    .catalogs-tree:after{
      content: '';
      border-bottom:dashed 1px @primary-color;
      border-left:dashed 1px @primary-color;
      position: absolute;
      width: 10px;
      height: 50%;
      left: 0;
      bottom: 50%;
    }
    .catalogs-tree:not(:last-child):before{
      content: '';
      border-left:dashed 1px @primary-color;
      position: absolute;
      width: 10px;
      height: 50%;
      left: 0;
      bottom: 0;
    }
  }
  .catalogs-edit-layout .iconfont{
    margin-left: 10px;
  }

</style>
