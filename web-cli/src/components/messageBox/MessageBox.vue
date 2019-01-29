<template>
  <div class="hello-message-box-bg" v-show="visible">
    <div class="hello-message-box">
      <div class="hello-content">
        <div class="hello-title" v-if="title">{{title}}</div>
        <div class="hello-des" v-if="content">{{content}}</div>
      </div>
      <div class="hello-btn-operate">
        <div class="hello-btn cancel" @click="cancel(false)">{{cancelText}}</div>
        <div class="hello-btn confirm" @click="cancel(true)">{{confirmText}}</div>
      </div>
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
      cancel(arg) {
        this.callback(arg)
      }
    },
    mounted() {
      console.log('弹空组件', this)
    }
  }
</script>

<style scoped>
  .hello-message-box-bg{
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .1);
    left: 0;
    top: 0;
    z-index: 999;
  }
  .hello-message-box{
    position: absolute;
    left: 50%;
    top:50%;
    background: #fff;
    border-radius: 8px;
    transform: translate(-50%,-50%);
    width: 300px;
    box-shadow: 0 0 3px 1px #c7c7c7;
    color: #333;
  }
  .hello-message-box .hello-title{
    text-align: center;
    font-weight: bold;
    font-size: 17px;
    margin-bottom: 5px;
  }
  .hello-content{
    padding: 15px;
    text-align: center;
  }
  .hello-btn-operate{
    text-align: right;
    display: flex;
    border-top: solid 1px #c7c7c7;
  }
  .hello-btn-operate .hello-btn{
    flex: 1;
    text-align: center;
    padding: 10px 0;
    cursor: pointer;
  }
  .hello-btn-operate .confirm{
    color: dodgerblue;
  }
  .hello-btn-operate .hello-btn.cancel{
  }
  .hello-btn:not(:last-child) {
    border-right: solid 1px #c7c7c7;
  }
</style>
