<template>
  <div class="hello-loading-bg" v-show="visible">
    <div class="hello-loading-layout">
      <svg class="loading-circular" viewBox="25 25 50 50">
        <circle class="loading-circular-path" cx="50" cy="50" r="20" fill="none"/>
      </svg>
      {{text||'Loading...'}}
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        text: '',
        visible: false
      }
    }
  }
</script>
<style scoped>
  .loading-circular{
    height: 42px;
    width: 42px;
    animation: loading-rotate 2s linear infinite;
  }
  .loading-circular-path{
    animation: loading-dash 1.5s ease-in-out infinite;
    stroke-dasharray: 90, 150;
    stroke-dashoffset: 0;
    stroke-width: 2;
    stroke: #409EFF;
    stroke-linecap: round;
  }
  @keyframes loading-rotate {
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes loading-dash {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0; }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -40px; }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -120px; }
  }
  .hello-loading-bg{
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .1);
    left: 0;
    top: 0;
    z-index: 1000;
  }
  .hello-loading-layout{
    width: 100px;
    padding: 20px 0;
    position: absolute;
    left: 50%;
    top:50%;
    transform: translate(-50%,-50%);
    background: rgba(0,0,0,.8);
    color: #fff;
    border-radius: 10px;
    text-align: center;
  }
</style>
