<template>
  <div class="hello-message-box" v-show="visible">
    <div class="hello-title">{{title}}</div>
    <div class="hello-content">{{content}}</div>
    <div class="hello-btn-operate">
      <div class="hello-btn" @click="cancel">{{confirmText}}</div>
      <div class="hello-btn cancel" @click="cancel">{{cancelText}}</div>
    </div>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        title: '',
        content: '',
        confirmText: '',
        cancelText: '',
        visible: false
      }
    },
    methods: {
      cancel() {
        this.callback('abc')
      }
    },
    mounted() {
      console.log('this', this)
    }
  }
</script>

<style scoped>
  .hello-message-box{
    position: fixed;
    left: 50%;
    top:50%;
    background: #fff;
    border-radius: 5px;
    transform: translate(-50%,-50%);
    width: 300px;
    border: solid 1px #24292e
  }
  .hello-message-box .hello-title{
    background: #24292e;
    color: #fff;
    padding: 10px;
  }
  .hello-content{
    min-height: 100px;
    padding: 40px;
  }
  .hello-btn-operate{
    padding: 10px;
    text-align: right;
  }
  .hello-btn-operate .hello-btn{
    padding: 3px 10px;
    background: #24292e;
    color: #fff;
    display: inline-block;
    border-radius: 4px;
    font-size: 13px;
  }
  .hello-btn-operate .hello-btn.cancel{
    background: #fff;
    border:solid 1px #24292e;
    color: #24292e ;
  }
</style>
