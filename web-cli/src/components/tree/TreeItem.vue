<template>
  <div class="catalogs-layout">
    <div
      class="flex align-items-center catalogs-item-layout"
      @click.left="chooseCatalog"
      @click.right.stop.prevent="(e) => showOperateMenu(e)"
      :class="{
        'act': actCatalog === curNode['_id'],
        'catalogs-item-hover': !(isNewDir || renameCatalog)
      }"
    >
      <!--左边三角-->
      <div
        class="has-child"
        :class="{
        'in-chain': isOpen||(isOpen&&hasChild&&treeChainList.indexOf(curNode['_id']) > -1),
      }"
        @click.stop="toggleOpenDir"
        v-if="catalogs[curNode['_id']]&&hasChild"></div>
      <i class="iconfont" :class="curNode.icon" :id="curNode._id" v-if="curNode.icon"></i>
      <i class="iconfont icon-wenjianjia" :class="curNode.icon" :id="curNode._id" v-else-if="treeChainList.indexOf(curNode['_id']) > -1"></i>
      <i class="iconfont icon-wendang1" :id="curNode._id" v-else></i>
   <!--   <div class="iconfont" v-else>
        <svg class="icon icon-close" aria-hidden="true">
          <use xlink:href="#icon-wenjian2"></use>
        </svg>
        <svg class="icon  icon-open" aria-hidden="true">
          <use xlink:href="#icon-wenjian-"></use>
        </svg>
      </div>-->
      <input
        v-if="curNode.isNew||renameCatalog"
        v-model.trim="renameValue"
        class="edit-catalogs-input line-ellipsis"
        @blur="doRename"
        v-focus:select

      />
      <div v-else class="catalogs-name line-ellipsis">{{curNode.name}}</div>
      <div class="operate-triangle-btn"
           @click.left.stop="(e) => showOperateMenu(e)"
           v-if="!curNode.icon"
      >
        <i class="iconfont icon-tianjiajiahaowubiankuang"></i>
      </div>
      <div class="catalog-operate-layout" v-click-outside="closeMenu" :style="operateMenuStyle" v-if="operateMenuStyle.left !== -1">
        <div class="catalog-operate-item hadChild">
          新建文件
          <div class="operate-item-child">
            <div class="catalog-operate-item" :class="{'builtIn': item.builtIn}" v-for="(item, index) in schemaList" @click.stop="todoCreateFile(item)">{{renameCatalog}}{{item.name}}</div>
          </div>
        </div>
        <div class="catalog-operate-item" @click.stop="doCreateTemDir">新建文件夹</div>
        <div class="catalog-operate-item" @click.stop="todoRename" v-if="curNode._id !== 'root'">重命名</div>
        <div class="catalog-operate-item" @click.stop="todoDelete" v-if="curNode._id !== 'root'">删除</div>
      </div>
    </div>
    <div v-if="catalogs[curNode['_id']]&&catalogs[curNode['_id']].childNodes&&catalogs[curNode['_id']].childNodes.length">
      <TreeItem
        v-show="isOpen"
        v-for="(item, index) in catalogs[curNode['_id']].childNodes"
        :key="index"
        :curNode="item"
      ></TreeItem>
    </div>
    <TreeItem
      v-if="newDir.parentId === curNode['_id']"
      :curNode="newDir"
      @emitExitNewDir="exitNewDir"
      :isNewDir="newDir.parentId === curNode['_id']"
    ></TreeItem>
  </div>
</template>
<script>
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
  import * as MUTATIONS from '../../store/const/mutaions'
  import * as ACTIONS from '../../store/const/actions'
  import bus from '../../global/eventBus'
  import constKey from '../../util/const'

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
        },
        isOpen: false
      }
    },
    computed: {
      ...mapState({
        catalogs: state => state.catalogs.list,
        actCatalog: state => state.catalogs.curCatalog,
        schemaList: state => Object.values(state.schema.list).filter(item => item.fields.length),
        curBook: state => state.books.curBook
      }),
      ...mapGetters(['treeChainList']),
      hasChild() {
        return this.catalogs[this.curNode['_id']]
          && this.catalogs[this.curNode['_id']]['childNodes']
          && this.catalogs[this.curNode['_id']]['childNodes'].length
      }
    },
    watch: {
      curNode: {
        handler() {
          this.getDate()
        },
        deep: true
      }
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
        ACTIONS.ARTICLE_LIST_GET,
        ACTIONS.ARTICLE_RECENTLY_LIST_GET,
        ACTIONS.CATALOGS_DELETE
      ]),
      toggleOpenDir() {
        this.isOpen = !this.isOpen
      },
      async chooseCatalog() {
        this.isOpen = true
        if(this.curNode._id === constKey.recentlyArticlesKey){
          this.getRecentlyArticles()
          return
        }
        if(!this.curBook){
          this.$alert({
            content: '缺少bookId',
            showCancel: false
          })
          return
        }
        this.$showLoading()
        await this[ACTIONS.ARTICLE_LIST_GET]({
          bookId: this.curBook,
          catalogId: this.curNode._id
        })
        this.$hideLoading()
        console.log('this.curNode', this.curNode)
        this[MUTATIONS.CATALOGS_CUR_SAVE](this.curNode._id)
      },
      async getRecentlyArticles() {
        this.$showLoading()
        await this[ACTIONS.ARTICLE_RECENTLY_LIST_GET]()
        this.$hideLoading()
        this[MUTATIONS.CATALOGS_CUR_SAVE]('recently')
      },
      showOperateMenu(e) {
        if(this.curNode.icon) return
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
        bus.$emit('emitToAdd', {
          schemaId: item._id,
          catalogId: this.curNode._id
        })
        this.closeMenu()
      },
      todoDelete() {
        this.closeMenu()
        this.$alert({
          title: `你确认要删除"${this.curNode.name}"`
        })
          .then(async res => {
            this.doDeleteCatalog()
          })
      },
      async doDeleteCatalog() {
        this.$showLoading()
        const result = await this[ACTIONS.CATALOGS_DELETE]({
          _id: this.curNode._id
        })
        if(!result.err) {
          await this.getDate(this.curNode, true)
        }
        this.$hideLoading()
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
          _id: _id,
          name,
          parentId
        })
        if(!result.err) {
          this.getDate(item, true)
        }
      },
      async addCatalog(name, parentId) {
        const result = await this[ACTIONS.CATALOGS_POST]({
          parentId,
          name,
          bookId: this.curBook
        })
        this.$emit('emitExitNewDir')
      },
      exitNewDir() {
        this.getDate(this.curNode, true)
        this.newDir.parentId = ''
      },
      doCreateTemDir() {
        this.isOpen = true
        this.closeMenu()
        this.newDir.parentId = this.curNode['_id']
        this.newDir.parentParentId = this.curNode['parentId']
      },
      async getDate(treeNode, isParentId){
        const params = treeNode || this.curNode
        await this[ACTIONS.CATALOGS_GET]({
          parentId: isParentId ? params.parentId || 'root' : params._id,
          bookId: this.curBook
        })
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
/*    border-left: solid 6px @tree-color;
    border-top: solid 5px transparent;
    border-bottom: solid 5px transparent;*/
    width: 16px;
    height: 16px;
    right: 12px;
    top: 50%;
    .iconfont{
      font-size: 15px;
    }
    transform: translateY(-50%);
  }
  // 有子文件夹且未打开
  .catalogs-item-layout .has-child{
    position: absolute;
    border-left: solid 6px @tree-color;
    border-top: solid 5px transparent;
    border-bottom: solid 5px transparent;
    width: 0;
    height: 0;
    left: 12px;
    top: 50%;
    transform: translateY(-6px);
    transition: .2s;
  }
  .catalogs-item-layout .has-child:after{
    content: '';
    width: 20px;
    height: 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  // 有子目录且打开状态
  .catalogs-item-layout .has-child.in-chain{
    transform: translateY(-6px) rotate(90deg);
  }
/*  .catalogs-item-layout.act.has-child:before{
    border-left: solid 6px @tree-light-color;
  }*/
  .catalogs-item-hover:hover{
    background: @tree-hover-bg-color;
    color: @tree-light-color;
  }
  .catalogs-item-hover:hover .operate-triangle-btn{
    display: block;
    color: @tree-light-color;
  }
  .catalogs-item-hover:hover:after{
    background: @tree-hover-bg-color;
  }
  .catalogs-item-layout.act{
    background: @tree-light-bg-color;
    color: @tree-light-color;
    .icon-open{
      display: block;
    }
    .icon-close{
      display: none;
    }
  }
  .catalogs-item-layout.act:hover{
    background: @tree-light-bg-color;
  }
  .catalogs-item-layout.act:hover:after{
    background: @tree-light-bg-color;
  }
  .catalogs-item-layout.act:after{
    background: @tree-light-bg-color;
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
      border-bottom: solid 1px rgba(255,255,255,.2);
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
      border-left:solid 1px rgba(255,255,255,.2);
      display: none
    }
    .catalog-operate-item.builtIn{
      border-bottom: solid 1px rgba(255,255,255,.6);
    }
  }
  #hello_recent{
    font-size: 24px;
  }
</style>
