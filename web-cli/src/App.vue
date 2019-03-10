<template>
    <div class="app flex direction-column">
      <Header/>
      <Layout/>
      <!--<Footer/>-->
      <div class="controller-layout-fixed">
        <div
          class="controller-layout-item"
          @click.stop="doSetConfig('showDir')"
          :class="{'act' : showDir}"><i class="iconfont icon-neirong"></i></div>
        <div
          class="controller-layout-item"
          @click.stop="doSetConfig('showBrief')"
          :class="{'act' : showBrief}"><i class="iconfont icon-shujia1"></i></div>
      </div>
    </div>

</template>

<script>
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
  import * as MUTATIONS from './store/const/mutaions'
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
    },
    computed: {
      ...mapState({
        showDir: state => state.config.showDir,
        showBrief: state => state.config.showBrief,
      })
    },
    methods: {
      ...mapMutations([
        MUTATIONS.CONFIG_TOGGLE_SAVE
      ]),
      doSetConfig(tar) {
        this[MUTATIONS.CONFIG_TOGGLE_SAVE]({
          tar,
          val: !this[tar]
        })
      }
    },
    data() {
      return {
        hiddenArticleLayout: false
      }
    }
  }
</script>
<style lang="less">
  @import '//at.alicdn.com/t/font_992689_basv9zzmjn.css';
  .controller-layout-fixed{
    position: fixed;
    bottom: 50px;
    left: 0;
    z-index: 10;
    .controller-layout-item{
      width: 30px;
      height: 30px;
      line-height: 30px;
      cursor: pointer;
      background: @tree-color;
      border-radius: 0 20px 20px 0;
      margin-bottom: 10px;
      text-align: center;
    }
    .iconfont{
      font-size: 18px;
    }
    .controller-layout-item.act{
      background:#FFF;
    }
  }

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
