<template>
  <div class="flex flex-1">
    <div class="catalog-layout box-shadow">
      <TreeItem></TreeItem>
    </div>
    <ArticleBrief
      @emitToChooseCurArticle="chooseCurArticle"
      :list="curArticleList"
      :cusArticle="cusArticle"
    ></ArticleBrief>
    <div class="flex-1" v-show="!editMeta.editId"></div>
    <articles
      :editMeta="editMeta"
      v-show="editMeta.editId"
      @emitUpdateArticle="doEditArticle"
    ></articles>
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
  import constKey from '../../util/const'

  export default {
    components: {
      TreeItem,
      ArticleBrief,
      articles
    },
    data: function () {
      return {
        editMeta: {
          editId: ''
        },
        curArticleList: [],
        cusArticle: ''
      }
    },
    computed: {
      ...mapState({
        schemaList: state => state.schema.list,
        articleList: state => state.articles.catalogMapArticles,
        curBook: state => state.books.curBook,
      }),
      ...mapGetters(['treeChainList']),
    },
    methods: {
      ...mapMutations([
        MUTATIONS.CATALOGS_CUR_SAVE,
      ]),
      ...mapActions([
        ACTIONS.BOOK_LIST_GET,
        ACTIONS.SCHEMA_LIST_GET,
        ACTIONS.ARTICLE_RECENTLY_LIST_GET,
        ACTIONS.ARTICLE_LIST_GET,
      ]),
      getBookData() {
        this[ACTIONS.BOOK_LIST_GET]()
        this[ACTIONS.SCHEMA_LIST_GET]()
        this[ACTIONS.ARTICLE_RECENTLY_LIST_GET]()
      },
      /**
       *  获取文章详情 设置编辑内容 editId设为articleId
       *  @param <String> catalogId
       *  @param <String> schemaId
       *  @param <String> articleId
       *  */
      async chooseCurArticle(arg) {
        const { articleId } = arg
        this.cusArticle = articleId
        this.$router.push(`/article/${articleId}`)
        this.setEditMeta(arg, articleId)
      },
      /**
       * 创建新文章时， editId设为new
       * */
      async doCreateArticle(arg) {
        const { catalogId } = arg
        await this.getArticleByCatalogId(catalogId)
        this.setEditMeta(arg, 'new')
      },
      async doEditArticle(arg) {
        const { catalogId, articleId } = arg
        await this.getArticleByCatalogId(catalogId)
        if(this.curArticleList && this.curArticleList.length) {
          this.chooseCurArticle({
            ...this.curArticleList[0],
            articleId: articleId || this.curArticleList[0]._id
          })
        }
      },
      setEditMeta(arg, editId) {
        const {
          catalogId,
          schemaId
        } = arg
        if(!schemaId) {
          this.$alert({
            title: '缺少schemaId',
            showCancel: false
          })
        }
        const { MOCK } = process.env
        const getSchema = (editId !== 'new' && MOCK) ? Object.values(this.schemaList)[0] : this.schemaList[schemaId]
        this.editMeta = {
          ...getSchema,
          catalogId,
          editId: editId
        }
        this.cusArticle = editId
      },
      /* 根据catalogId获取文章列表 */
      async getArticleByCatalogId(catalogId) {
        if(this.catalogId === constKey.recentlyArticlesKey){
          // this.getRecentlyArticles()
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
        const result = await this[ACTIONS.ARTICLE_LIST_GET]({
          bookId: this.curBook,
          catalogId: catalogId
        })
        this.setArticleBrief()
        this.$hideLoading()
        return result
      },
      setArticleBrief() {
        if (!Object.keys(this.articleList).length) {
          this.curArticleList = []
          this.editMeta.editId = ''
          return
        }
        const curCatalog = this.treeChainList[this.treeChainList.length - 1]
        const key = curCatalog === constKey.recentlyArticlesKey ?
          constKey.recentlyArticlesKey :
          `${this.curBook}_${curCatalog}`
        const getList = this.articleList[key]
        if (!getList) {
          this.curArticleList = []
          this.editMeta.editId = ''
          return
        }
        this.curArticleList = getList
      },
      async init() {
        this.getBookData()
        /**
         * @params <Object> arg 包含schemaId字段id和当前articleId(如果是添加则为'new')
         * */
        bus.$on('emitToCreateArticle', (arg) => {
          this.doCreateArticle(arg)
        })
        bus.$on('emitFromCatalog', (arg) => {
          const { isNew } = arg
          if(isNew) {
            this.doCreateArticle(arg)
          } else {
            this.doEditArticle(arg)
          }

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
