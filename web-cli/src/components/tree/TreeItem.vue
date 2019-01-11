<template>
  <div class="catalogs-layout">
    <div
      class="flex align-items-center catalogs-item-layout"
      @click.left="chooseCatalog"
      @click.right.stop.prevent="(e) => showOperateMenu(e)"
      :class="{'act': actCatalog['_id'] === curNode['_id']}"
      v-click-outside="closeMenu"
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
      <div class="catalog-operate-layout" :style="operateMenuStyle" v-if="operateMenuStyle.left !== -1">
        <div class="catalog-operate-item" @click="doCreateTemDir">新建文件夹</div>
        <div class="catalog-operate-item" @click="todoRename">重命名</div>
        <div class="catalog-operate-item">删除</div>
      </div>
    </div>
    <TreeItem
      v-if="newDir.parentId === curNode['_id']"
      :curNode="newDir"
      @emitSubmitCatalogName="submitCatalogName"
      :isNewDir="newDir.parentId === curNode['_id']"
    ></TreeItem>
    <TreeItem
      v-if="catalogs[curNode['_id']]"
      v-for="(item, index) in catalogs[curNode['_id']]"
      :key="index"
      @emitSubmitCatalogName="submitCatalogName"
      :curNode="item"
    ></TreeItem>
  </div>
</template>
<script>
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
  import * as MUTATIONS from '../../store/const/mutaions'
  import * as ACTIONS from '../../store/const/actions'

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
        }
      }
    },
    computed: {
      ...mapState({
        catalogs: state => state.catalogs.catalogs,
        actCatalog: state => state.catalogs.curCatalog,
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
      chooseCatalog() {
        this[MUTATIONS.CATALOGS_CUR_SAVE]({ data: this.curNode })
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
      /**
       * 重命名input失去焦点时
       * */
      doRename() {
        this.renameCatalog = false
        if(this.isNewDir){
          this.$emit('emitSubmitCatalogName', this.renameValue, this.curNode)
          return
        }
        if(this.renameValue && this.renameValue !== this.curNode.name) {
          this.$emit('emitSubmitCatalogName', this.renameValue, this.curNode)
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
        if(!result.err) {
          // 新建完成后根据当前文件id获取目录，但是没更新当前文件状态，hasChild没有变化
          this.getDate()
        }
      },
      doCreateTemDir() {
        this.closeMenu()
        this.newDir.parentId = this.curNode['_id']
      },
      async getDate(){
        await this[ACTIONS.CATALOGS_GET]({ parentId: this.curNode['_id'] })
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
    margin-right: 2px;
    position: relative;
    z-index: 1;
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
  .catalogs-item-layout:hover{
    background: @border-color
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
    z-index: 1;
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
    overflow: hidden;
    .catalog-operate-item{
      width: 150px;
      padding: 10px 20px;
    }
    .catalog-operate-item:not(:last-child){
      border-bottom: solid 1px @border-color;
    }
  }

</style>
