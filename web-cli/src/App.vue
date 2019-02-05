<template>
    <div class="app flex direction-column">
      <Header/>
      <Layout/>
      <Footer/>
    </div>

</template>

<script>
  import './assets/styles/global.less'
  import './assets/styles/app.less'
  import Header from './components/layout/Header.vue'
  import Footer from './components/layout/Footer.vue'
  import Layout from './components/layout/Layout.vue'

  export default {
    name: 'app',
    components: {
      Header,
      Footer,
      Layout
    }
  }
</script>
<style lang="less">
  @import '//at.alicdn.com/t/font_992689_h99hc54vl16.css';
  /*@import "//at.alicdn.com/t/font_992689_pswgkexoa3.css";*/
  /*      background: @bg-color;
    }
    .ivu-layout-header{
        background: #fff;
        box-shadow: 0 0 1px rgba(0,0,0,0.25);
        position: relative;
        z-index: 1;
        line-height: normal;
    }
    .main-layout{
        padding: 0 0 @padding-size @padding-size;
    }
    .content{
        padding: @padding-size*3;
        background: #fff;
        position: relative;
    }*!*/
</style>
