<template>
  <div class="left-layout flex">
    <div class="book-slider-layout">
      <div class="relative book-layout show-book-list act">
        <div class="book-icon-layout">
          <i class="iconfont icon-jingdian"></i>
        </div>
        <div class="book-list-layout  flex justify-content-start direction-column">
          <div>
            <div class="book-list-item-layout flex align-items-center">
              <div class="icon">
                <i class="iconfont icon-jingdian"></i>
              </div>
              <div class="book-name line-ellipsis">测试测试测试测试</div>
            </div>
            <div class="book-list-item-layout flex align-items-center act">
              <div class="icon">
                <i class="iconfont icon-jingdian"></i>
              </div>
              <div class="book-name line-ellipsis">测试测试测试测试</div>
            </div>
          </div>
        </div>
      </div>
      <div class="book-layout act">
        <div class="book-icon-layout">
          <i class="iconfont icon-jingdian"></i>
        </div>
      </div>
      <div class="book-layout">
        <div class="book-icon-layout">
          <i class="iconfont icon-liebiao3"></i>
        </div>
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
    border-right:solid 1px #eee;
    padding: 15px 25px;
    overflow: auto;
  }
</style>
