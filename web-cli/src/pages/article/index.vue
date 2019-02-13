<template>
  <div class="flex flex-1">
    <div class="catalog-layout box-shadow">
      <TreeItem @emitToAdd="todoAddCreateArticle"></TreeItem>
    </div>
    <ArticleBrief></ArticleBrief>
    <articles :editMeta="editMeta"></articles>
  </div>
</template>
<script>
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
  import * as MUTATIONS from '../../store/const/mutaions'
  import * as ACTIONS from '../../store/const/actions'
  import bus from '../../global/eventBus'
  import TreeItem from '../../components/tree/index.vue'
  import ArticleBrief from './ArticleBrief.vue'
  import articles from './article.vue'
  export default {
    components: {
      TreeItem,
      ArticleBrief,
      articles
    },
    data: function () {
      return {
        editMeta: {
          editId: 'new'
        },
      }
    },
    computed: {
      ...mapState({
        schemaList: state => state.schema.list
      }),
      ...mapGetters(['treeChainList']),
    },
    methods: {
      ...mapActions([
        ACTIONS.BOOK_LIST_GET,
        ACTIONS.SCHEMA_LIST_GET,
        ACTIONS.ARTICLE_RECENTLY_LIST_GET
      ]),
      todoAddCreateArticle(item) {
        const {
          catalogId,
          schemaId,
          articleId = 'new'
        } = item
        if(!schemaId) {
          this.$alert({
            title: '缺少schemaId',
            showCancel: false
          })
        }
        const { MOCK } = process.env
        const getSchema = (articleId !== 'new' && MOCK) ? Object.values(this.schemaList)[0] : this.schemaList[schemaId]
        this.editMeta = {
          ...getSchema,
          catalogId,
          editId: articleId
        }

      },
      getBookData() {
        this[ACTIONS.BOOK_LIST_GET]()
        this[ACTIONS.SCHEMA_LIST_GET]()
        this[ACTIONS.ARTICLE_RECENTLY_LIST_GET]()
      },
      async init() {
        this.getBookData()
        /**
         * @params <Object> arg 包含schemaId字段id和当前articleId(如果是添加则为'new')
         * */
        bus.$on('emitToAdd', (arg) => {
          this.todoAddCreateArticle(arg)
        })
      },
    },
    mounted() {
      this.init()
    }
  }
</script>
<style lang="less" scoped>
  .book-slider-layout{
    padding: 15px;
    background: @bg-second-color;
  }
  .book-layout{
    margin-top: 40px;
    width: 38px;
    height: 38px;
    cursor: pointer;
    position: relative;
    z-index: 1;
    .book-icon-layout{
      line-height: 38px;
      width: 100%;
      height: 100%;
      text-align: center;
      border-radius: 50%;
      background: #fff;
      overflow: hidden;
      position: relative;
    }
    .iconfont{
      font-size: 26px;
    }
    .book-list-layout{
      max-width: 300px;
      padding:7px 20px;
      background: @bg-second-color;
      position: absolute;
      left: 100%;
      top: 0;
      transition: .3s;
      transform: scale(0);
      transform-origin: 0 15px;
      .book-list-item-layout{
        color: #fff;
        text-align: center;
        .icon{
          width: 25px;
          height: 25px;
          line-height: 22px;
          border: solid 1px #fff;
          border-radius: 50%;
          .iconfont{
            font-size: 16px;
          }
        }
        .book-name{
          font-size: 12px;
          margin-left: 10px;
        }
      }
      .book-list-item-layout:not(:last-child) {
        margin-bottom: 10px;
      }
      .book-list-item-layout.act{
        .icon{
          border:solid 1px @highlight-color;
          background: @highlight-color;
        }
      }
    }
  }

  .show-book-list:hover  .book-list-layout{
    transform: scale(1);
  }
  .book-layout.act{
    transform: scale(1.2);
    .book-icon-layout{
      background: @highlight-color;
      .iconfont{
        color: #fff;
      }
    }
  }
  .book-layout:not(:last-child) {
    margin-bottom: 10px;
  }
  .catalog-layout{
    padding: 15px 2px;
    overflow: auto;
    background: @tree-bg-color;
    color: @tree-color;
    width: 210px;
  }
</style>
