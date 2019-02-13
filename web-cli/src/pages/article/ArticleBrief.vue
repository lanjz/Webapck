<template>
  <div class="article-layout box-shadow">
    <div class="article-layout-input-box align-items-center">
      <input type="text" class="article-layout-input" v-model="filterKeys"/>
      <i class="iconfont icon-sousuo"></i>
    </div>
    <div
      class="article-item"
      v-for="(item, index) in articles"
      :class="{'act': item._id === cusArticle}"
      @click="chooseArticles(item)">
      <div class="article-item-title">{{item.title}}</div>
      <div class="article-item-mark">{{item.createTime | timestampToTime}}~{{item.updateTime | timestampToTime}}</div>
    </div>
  </div>
</template>
<script>
  import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
  import * as MUTATIONS from '../../store/const/mutaions'
  import * as ACTIONS from '../../store/const/actions'

  import bus from '../../global/eventBus'
  import constKey from '../../util/const'

  export default {
    data() {
      return {
        filterKeys: ''
      }
    },
    computed: {
      ...mapState({
        curBook: state => state.books.curBook,
        articleList: state => state.articles.catalogMapArticles,
        treeChainList: state => state.catalogs.curCatalog,
        cusArticle: state => state.articles.cusArticle
      }),
      ...mapGetters(['treeChainList']),
      articles: function () {
        if (!Object.keys(this.articleList).length) {
          return []
        }
        const key = this.treeChainList[this.treeChainList.length - 1] === constKey.recentlyArticlesKey ?
          constKey.recentlyArticlesKey :
          `${this.curBook}_${this.treeChainList[this.treeChainList.length - 1]}`
        const getList = this.articleList[key]
        if (!getList) {
          return []
        }
        return getList
      }
    },
    methods: {
      ...mapMutations([
        MUTATIONS.ARTICLE_CUS_SAVE
      ]),
      chooseArticles: function (item) {
        bus.$emit('emitToAdd', {schemaId: item.schemaId, articleId: item._id})
        this.$router.push(`/article/${item._id}`)

      }
    }
  }
</script>
<style lang="less" scoped="">
  .article-item {
    padding: 10px 20px;
    max-width: 230px;
    cursor: pointer;
    position: relative;
    border-bottom: solid 1px #000;
    .article-item-title {
      font-size: 18px;
      color: @tree-light-color;
    }
    .article-item-mark {
      margin-top: 7px;
      font-size: 12px;
    }
  }
  .article-item.act {
    background: @article-brief-light-bg;
  }
  .article-item.act:after{
    content: '';
    position: absolute;
    width: 4px;
    height: 100%;
    left: 0;
    top: 0;
    background: #afb0b1;
  }
  .article-layout {
    padding: 15px 0;
    overflow: auto;
    background: @bg-color;
    color: @tree-color;
  }

  .article-layout-input-box{
    background: @tree-light-bg-color;
    color: @tree-light-color;
    width: 90%;
    height: 40px;
    padding: 0 10px;
    position: relative;
    margin: 0 auto;
    .iconfont{
      display: block;
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .article-layout-input {
    height: 100%;
    border: none;
    background: transparent;
    display: inline-block;
    color: @tree-light-color;
    outline: #fff;
    padding-right: 46px;
  }
</style>
