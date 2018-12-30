<template>
  <div class="catalogs-tree">
    <div class="catalogs-item-layout act flex align-items-center">
      <i class="iconfont icon-wenjian"></i>
      <div class="catalogs-name">
        JavaScript
      </div>
      <div class="catalogs-edit-layout flex">
        <div class="catalogs-modify">
          <i class="iconfont icon-bianji"></i>
        </div>
        <div class="catalogs-delete">
          <i class="iconfont icon-shanchu"></i>
        </div>
      </div>
    </div>
    <div class="catalogs-tree">
      <div class="catalogs-item-layout flex align-items-center">
        <i class="iconfont icon-tuya-"></i>
        <div class="catalogs-name">
          TypeScript
        </div>
      </div>
    </div>
    <div class="catalogs-tree">
      <div class="catalogs-item-layout flex align-items-center">
        <i class="iconfont icon-tuya-"></i>
        <div class="catalogs-name">
          TypeScript
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less">
  .catalogs-item-layout{
    cursor:pointer;
    padding: 3px 0;
    .iconfont{
      font-size: 20px;
    }
  }
  .catalogs-item-layout.act{
    .iconfont{
      color: @highlight-color
    }
  }
  .catalogs-tree{
    font-size: 15px;
    position: relative;
    /*padding-top: 7px;*/
    /*border: solid 1px #000;*/
    .catalogs-tree{
      margin-left: 10px;
      padding-left: 10px;
      font-size: 14px;
      border-bottom: none;
    }
    .catalogs-tree:after{
      content: '';
      border-bottom:dashed 1px @primary-color;
      border-left:dashed 1px @primary-color;
      position: absolute;
      width: 10px;
      height: 50%;
      left: 0;
      bottom: 50%;
    }
    .catalogs-tree:not(:last-child):before{
      content: '';
      border-left:dashed 1px @primary-color;
      position: absolute;
      width: 10px;
      height: 50%;
      left: 0;
      bottom: 0;
    }
  }
  .catalogs-edit-layout .iconfont{
    margin-left: 10px;
  }

</style>
