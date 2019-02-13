<template>
  <div class="wrap">{{text}}</div>
</template>
<script>
  export default {
    data(){
      return {
        text: 'tt'
      }
    },
    mounted() {
      setTimeout(() => {
        this.callback('abc')
      })

    }
  }
</script>

<style scoped>
  .wrap{
    position: fixed;
    left: 50%;
    top:50%;
    background: rgba(0,0,0,.35);
    padding: 10px;
    border-radius: 5px;
    transform: translate(-50%,-50%);
    color:#fff;
  }
</style>
