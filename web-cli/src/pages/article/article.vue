<template>
  <div class="article-layout flex-1 flex direction-column">
    <div class="article-title">
      测试测试测试
    </div>
    <div class="article-content">
      测试测试测试
      测试测试测试
      测试测试测试
    </div>
  </div>
</template>

<script>
  export default {
    components: {
    }
  }
</script>
<style lang="less">
  .article-layout{
    padding: 0 7px;
  }
  .article-title{
    border-bottom: solid 1px @border-color;
    padding: 15px;
    font-size: 18px;
  }
  .article-content{
    padding: 15px;
  }

</style>
