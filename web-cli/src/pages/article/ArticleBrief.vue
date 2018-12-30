<template>
  <div class="article-layout">
    <input type="text" class="article-layout-input"/>
    <div class="article-item act">
      <div class="article-item-title">未解决问题记录</div>
      <div class="article-item-mark">2019.1.1</div>
    </div>
    <div class="article-item">
      <div class="article-item-title">未解决问题记录</div>
      <div class="article-item-mark">2019.1.1</div>
    </div>
  </div>
</template>
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
