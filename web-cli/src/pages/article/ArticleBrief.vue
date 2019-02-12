<template>
  <div class="article-layout">
    <input type="text" class="article-layout-input"/>
    <div class="article-item act" v-for="(item, index) in articles" @click="chooseArticles(item)">
      <div class="article-item-title">{{item.title}}</div>
      <div class="article-item-mark">{{item.createTime|timestampToTime}}~{{item.updateTime|timestampToTime}}</div>
    </div>
  </div>
</template>
<script>
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
  import bus from '../../global/eventBus'

  export default {
    computed: {
      ...mapState({
        curBook: state => state.books.curBook,
        articleList: state => state.articles.catalogMapArticles,
        treeChainList: state => state.catalogs.curCatalog
      }),
      ...mapGetters(['treeChainList']),
      articles: function () {
        console.log(this.treeChainList)
        if(!Object.keys(this.articleList).length){
          return []
        }
        const getList = this.articleList[`${this.curBook}_${this.treeChainList[this.treeChainList.length-1]}`]
        if(!getList){
          return []
        }
        return getList
      }
    },
    methods: {
      chooseArticles: function (item) {
        bus.$emit('emitToAdd', { schemaId: item.schemaId, articleId: item._id})
        this.$router.push(`/article/${item._id}`)
      }
    }
  }
</script>
<style lang="less" scoped="">
  .article-item{
    border-radius: 4px;
    padding: 10px 20px;
    margin-top: 10px;
    max-width: 230px;
    .article-item-title{
      font-size: 18px;
    }
    .article-item-mark{
      margin-top: 7px;
      font-size: 12px;
    }
  }
  .article-item.act{
    background: rgba(230, 0 ,18, .3);
    color: #fff;
  }
  .article-layout{
      border-right:solid 1px #eee;
      padding: 15px 7px;
      overflow: auto;
    }
  .article-layout-input{
    width: 100%;
    border-radius: 4px;
    height: 30px;
    border: solid 1px  #d7dde4;
  }
</style>
