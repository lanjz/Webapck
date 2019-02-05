<template>
  <div class="catalogs-layout">
    <div
      class="flex align-items-center catalogs-item-layout"
      @click.left="chooseCatalog"
      @click.right.stop.prevent="(e) => showOperateMenu(e)"
      :class="{
        'act': actCatalog['_id'] === curNode['_id'],
        'in-chain': isOpen||(isOpen&&curNode['hasChild']&&treeChainList.indexOf(curNode['_id']) > -1),
        'has-child': curNode['hasChild']
      }"
    >
      <div class="iconfont">
        <svg class="icon icon-close" aria-hidden="true">
          <use xlink:href="#icon-wenjian2"></use>
        </svg>
        <svg class="icon  icon-open" aria-hidden="true">
          <use xlink:href="#icon-wenjian-"></use>
        </svg>
      </div>
      <input
        v-if="curNode.isNew||renameCatalog"
        v-model.trim="renameValue"
        class="edit-catalogs-input line-ellipsis"
        @blur="doRename"
        v-focus:select

      />
      <div v-else class="catalogs-name line-ellipsis">{{curNode.name}}</div>
      <div class="operate-triangle-btn" @click.left.stop="(e) => showOperateMenu(e)"></div>
      <div class="catalog-operate-layout" v-click-outside="closeMenu" :style="operateMenuStyle" v-if="operateMenuStyle.left !== -1">
        <div class="catalog-operate-item hadChild">
          新建文件
          <div class="operate-item-child">
            <div class="catalog-operate-item" v-for="(item, index) in schemaList" @click.stop="todoCreateFile(item)">{{item.name}}</div>
          </div>
        </div>
        <div class="catalog-operate-item" @click="doCreateTemDir">新建文件夹</div>
        <div class="catalog-operate-item" @click="todoRename">重命名</div>
        <div class="catalog-operate-item">删除</div>
      </div>
    </div>
    <TreeItem
      v-if="newDir.parentId === curNode['_id']"
      :curNode="newDir"
      @emitExitNewDir="exitNewDir"
      :isNewDir="newDir.parentId === curNode['_id']"
    ></TreeItem>
    <TreeItem
      v-show="isOpen"
      v-if="catalogs[curNode['_id']]"
      v-for="(item, index) in catalogs[curNode['_id']]"
      :key="index"
      :curNode="item"
      :treeChain="[...treeChain, item['_id']]"
    ></TreeItem>
  </div>
</template>
<script>
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
  import * as MUTATIONS from '../../store/const/mutaions'
  import * as ACTIONS from '../../store/const/actions'
  import bus from '../../global/eventBus'

  export default {
    name: 'TreeItem',
    props: {
      curNode: {
        type: Object,
        require: true
      },
      isNewDir: {
        type: Boolean,
        default: function () {
          return false
        }
      },
      treeChain: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    data() {
      return {
        renameCatalog: false,
        operateMenuStyle: { left: -1, top: '50%'},
        renameValue: '',
        newDir: {
          parentId: '',
          name: '新建文件夹',
          show: false,
          isNew: true
        },
        isOpen: false
      }
    },
    computed: {
      ...mapState({
        catalogs: state => state.catalogs.list,
        actCatalog: state => state.catalogs.curCatalog,
        treeChainList: state => state.catalogs.treeChain,
        schemaList: state => Object.values(state.schema.list)
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
        ACTIONS.CATALOGS_POST,
        ACTIONS.SCHEMA_LIST_GET,
      ]),
      chooseCatalog() {
        this.isOpen = !this.isOpen
        this[MUTATIONS.CATALOGS_CUR_SAVE](
          { data: this.curNode,
            treeChain: [ ...this.treeChain]
          }
        )
      },
      showOperateMenu(e) {
        const { clientX, clientY } = e
        this.operateMenuStyle = {
          top: `${clientY}px`,
          left: `${clientX}px`
        }
      },
      closeMenu() {
        this.operateMenuStyle.left = -1
      },
      todoRename() {
        this.renameValue = this.curNode.name
        this.closeMenu()
        this.renameCatalog = true
      },
      todoCreateFile(item) {
        bus.$emit('emitToAdd', item)
        this.closeMenu()
      },
      /**
       * 重命名input失去焦点时
       * */
      doRename() {
        this.renameCatalog = false
        if(this.isNewDir){
          this.addCatalog(this.renameValue, this.curNode.parentId)
          return
        }
        if(this.renameValue && this.renameValue !== this.curNode.name) {
          this.modifyCatalogName(this.renameValue, this.curNode)
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
        const { _id, parentId } = item
        const result = await this[ACTIONS.CATALOGS_PUT]({
          id: _id,
          name,
        })
        if(!result.err) {
          this.getDate(parentId)
        }
      },
      async addCatalog(name, parentId) {
        const result = await this[ACTIONS.CATALOGS_POST]({
          parentId,
          name
        })
        this.$emit('emitExitNewDir')
      },
      exitNewDir() {
        this.getDate(this.curNode.parentId)
        this.newDir.parentId = ''
      },
      doCreateTemDir() {
        this.closeMenu()
        this.newDir.parentId = this.curNode['_id']
      },
      async getDate(id){
        await Promise.all([
          this[ACTIONS.SCHEMA_LIST_GET]('-1'),
          this[ACTIONS.CATALOGS_GET]({ parentId: id || this.curNode['_id'] })
        ])
      },
      init() {
        // 如果就新建文件夹则直接执行todoRename函数
        if(this.isNewDir) {
          this.todoRename()
        } else if(this.curNode.hasChild){
          this.getDate()
        }
        document.addEventListener('click', (e) => {
          !this.$el.contains(e.target)
        })
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
  .iconfont{
    font-size: 25px;
    position: relative;
  }
  .catalogs-item-layout{
    cursor:pointer;
    padding: 7px 25px;
    position: relative;
    transition: .3s;
    .icon-open{
      display: none;
    }
    .icon-close{
      display: block;
    }
  }
  .catalogs-item-layout:after{
    content: '';
    background: transparent;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    left: -100%;
    transition: .3s;
  }
  .operate-triangle-btn{
    display: none;
    position: absolute;
    border-left: solid 6px #d4d4d4;
    border-top: solid 5px transparent;
    border-bottom: solid 5px transparent;
    width: 0;
    height: 0;
    right: 12px;
    top: 50%;
    transform: translateY(-4px) rotate(90deg);
  }
  // 有子文件夹且未打开
  .catalogs-item-layout.has-child:before{
    content: '';
    position: absolute;
    border-left: solid 6px @bg-second-color;
    border-top: solid 5px transparent;
    border-bottom: solid 5px transparent;
    width: 0;
    height: 0;
    left: 12px;
    top: 50%;
    transform: translateY(-6px);
  }
  // 月子目录且打开状态
  .catalogs-item-layout.has-child.in-chain:before{
    transform: translateY(-6px) rotate(90deg);
  }
  .catalogs-item-layout.act.has-child:before{
    border-left: solid 6px #fff;
  }
  .catalogs-item-layout:hover{
    background: @border-color
  }
  .catalogs-item-layout:hover .operate-triangle-btn{
    display: block;
  }
  .catalogs-item-layout:hover:after{
    background: @border-color;
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
  .catalogs-item-layout.act:hover{
    background: @bg-second-color;
  }
  .catalogs-item-layout.act:hover:after{
    background: @bg-second-color;
  }
  .catalogs-item-layout.act:after{
    background: @bg-second-color;
  }
  .catalogs-name{
    position: relative;
    max-width: 150px;
    padding: 0 5px;
  }
  .edit-catalogs-input{
    position: relative;
    z-index: 1;
    max-width: 150px;
    background: transparent;
    vertical-align: bottom;
    border: none;
    color: inherit;
    font-size: inherit;
    height: 25px;
    padding: 0 5px;
  }
  // 右键类型菜单
  .catalog-operate-layout{
    position: fixed;
    background: rgba(0,0,0,0.8);
    left: 50%;
    top: 50%;
    color: #fff;
    z-index: 999;
    border-radius: 5px;
    .catalog-operate-item{
      width: 150px;
      padding: 10px 20px;
      position: relative;
    }
    .catalog-operate-item:not(:last-child){
      border-bottom: solid 1px @border-color;
    }
    .catalog-operate-item.hadChild:after{
      content: '';
      position: absolute;
      border-left:solid 4px #fff;
      border-top: solid 4px transparent;
      border-bottom: solid 4px transparent;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
    }
    .catalog-operate-item:hover .operate-item-child{
      display: block;
    }
    .operate-item-child{
      position: absolute;
      left: 100%;
      top: 0;
      width: 100%;
      border-radius: 0 5px 5px 0;
      background: rgba(0,0,0,0.8);
      border-left:solid 1px rgba(255,255,255,.5);
      display: none
    }
  }

</style>
