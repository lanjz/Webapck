<template>
  <div class="left-layout flex">
    <div class="book-slider-layout">
      <div class="book-layout act">
        <i class="iconfont icon-jingdian"></i>
      </div>
      <div class="book-layout act">
        <i class="iconfont icon-jingdian"></i>
      </div>
      <div class="book-layout">
        <i class="iconfont icon-liebiao3"></i>
      </div>
    </div>
    <div class="catalog-layout">
      <CatalogsTree></CatalogsTree>
      <CatalogsTree></CatalogsTree>
    </div>
    <ArticleBrief></ArticleBrief>
  </div>
</template>
<script>
  import CatalogsTree from './CatalogsTree.vue'
  import ArticleBrief from './ArticleBrief.vue'
  export default {
    components: {
      CatalogsTree,
      ArticleBrief
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
    border-radius: 50%;
    background: #fff;
    text-align: center;
    line-height: 38px;
    cursor: pointer;
    .iconfont{
      font-size: 26px;
    }
  }
  .book-layout.act{
    background: @highlight-color;
    transform: scale(1.2);
    .iconfont{
      color: #fff;
    }
  }
  .book-layout:not(:last-child) {
    margin-bottom: 10px;
  }
  .catalog-layout{
    border-right:solid 1px #eee;
    padding: 15px 25px;
    overflow: auto;
  }
</style>
