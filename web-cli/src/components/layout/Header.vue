<template>
  <div class="head flex">
    <div class="logo">
      <img src="../../assets/imgs/small-LOGO.png">
    </div>
    <div class="flex flex-1 align-items-center justify-content-end">
      <div class="user-avatar-layout"></div>
    </div>
  </div>
</template>
<style lang="less" scoped>
  .head{
    padding: 15px;
    background: @bg-color;
    position: relative;

  }
  .logo{
    position: absolute;
    width: 65px;
    height: 65px;
    border-radius: 50%;
    left: 10px;
    top: 10px;
    img{
      height: 65px;
    }
  }
  .user-avatar-layout{
    width: 28px;
    height: 28px;
    border-radius: 5px;
    overflow: hidden;
  }
</style>
