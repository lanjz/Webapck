<template>
  <div class="article-layout box-shadow" :class="{'hidden-article': !showBrief}">
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
      <div class="operate-icon" @click.stop="todoDelete(item)">
        <i class="iconfont icon-shanchu1"></i>
      </div>
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
      }
    },
    computed: {
      ...mapState({
        showBrief: state => state.config.showBrief,
      }),
    },
    methods: {
      ...mapActions([
        ACTIONS.ARTICLE_DELETE,
      ]),
      chooseArticles: function (item) {
        this.$emit('emitToChooseCurArticle', {schemaId: item.schemaId, articleId: item._id, catalogId: item.catalogId})
      },
      todoDelete(item) {
        this.$alert({
          title: `你确认要删除"${item.title}"`,
        })
          .then(async res => {
            if(res) {
              this.doDeleteArticle(item)
            }
          })
      },
      async doDeleteArticle(item = {}) {
        this.$showLoading()
        const result = await this[ACTIONS.ARTICLE_DELETE](item._id)
        this.$hideLoading()
        this.$emit('emitInitArticle', {
          schemaId: item.schemaId,
          catalogId: item.catalogId
        })
      },
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
    .operate-icon{
      width: 30px;
      height: 30px;
      border-radius: 50%;
      right: 7px;
      top: 7px;
      position: absolute;
      z-index: 1;
      background: #5f5f5f;
      opacity: 0;
      transform: scale(0);
      transition: .3s;
      text-align: center;
      line-height: 30px;
      color: @article-brief-light-bg;
      .iconfont{
        font-size: 18px;
      }
    }
    .operate-icon:hover{
      background: @warn-color;
      color: #fff;
    }
  }
  .article-item:hover .operate-icon{
    opacity: 1;
    transform: scale(1);
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
</style>
