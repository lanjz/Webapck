<template>
  <div class="article-layout box-shadow" :class="{'hidden-article': hiddenArticleLayout}">
    <div class="article-layout-input-box align-items-center">
      <input type="text" class="article-layout-input" v-model="filterKeys"/>
      <i class="iconfont icon-sousuo"></i>
    </div>
    <div
      class="article-item"
      v-for="(item, index) in list"
      :class="{'act': item._id === cusArticle}"
      @click="chooseArticles(item)">
      <div class="article-item-title">{{item.title}}</div>
      <div class="article-item-mark">{{item.createTime | timestampToTime}}~{{item.updateTime | timestampToTime}}</div>
    </div>
    <!-- TODO -->
    <div
      class="article-layout-fixed controller-layout-fixed"
      @click.stop="hiddenArticleLayout = !hiddenArticleLayout"
      :class="{'act' : !hiddenArticleLayout}">简介</div>
  </div>
</template>
<script>
  import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
  import * as MUTATIONS from '../../store/const/mutaions'
  import * as ACTIONS from '../../store/const/actions'

  import bus from '../../global/eventBus'
  import constKey from '../../util/const'

  export default {
    props: {
      list: {
        type: Array,
        default() {
          return []
        }
      },
      cusArticle: ''
    },
    data() {
      return {
        filterKeys: '',
        hiddenArticleLayout: false
      }
    },
    computed: {
      /* TODO unless*/
      ...mapState({
        // cusArticle: state => state.articles.cusArticle
      }),
    },
    methods: {
      ...mapMutations([
        /* TODO unless*/
        MUTATIONS.ARTICLE_CUS_SAVE
      ]),
      chooseArticles: function (item) {
        this.$emit('emitToChooseCurArticle', {schemaId: item.schemaId, articleId: item._id, catalogId: item.catalogId})
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
    max-width: 500px;
    transition: .5s;
  }
  .article-layout.hidden-article{
    max-width: 0;
  }

  .article-layout-input-box{
    background: @tree-light-bg-color;
    color: @tree-light-color;
    width: 90%;
    height: 40px;
    padding: 0 10px;
    position: relative;
    margin: 0 auto;
    margin-bottom: 10px;
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
  .article-layout-fixed{
    bottom: 100px;;
  }
</style>
