<template>
  <div class="article-layout">
    <input type="text" class="article-layout-input"/>
    <div
      class="article-item"
      v-for="(item, index) in articles"
      :class="{'act': index === 1}"
      @click="chooseArticles(item)">
      <div class="article-item-title">{{item.title}}</div>
      <div class="article-item-mark">{{item.createTime | timestampToTime}}~{{item.updateTime | timestampToTime}}</div>
    </div>
  </div>
</template>
<script>
  import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
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
        if (!Object.keys(this.articleList).length) {
          return []
        }
        const getList = this.articleList[`${this.curBook}_${this.treeChainList[this.treeChainList.length - 1]}`]
        if (!getList) {
          return []
        }
        return getList
      }
    },
    methods: {
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
      color: #afb0b1;
    }
    .article-item-mark {
      margin-top: 7px;
      font-size: 12px;
    }
  }
  .article-item.act {
    background: #484a4c;
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
    background: @bg-second-color;
    color: #6f6f6f;
  }

  .article-layout-input {
    width: 90%;
    margin: 0 auto;
    height: 40px;
    border: none;
    background: #afb0b1;
    display: block;
    padding: 0 10px;
    color: #484a4c;
    outline: #fff;
  }
</style>
