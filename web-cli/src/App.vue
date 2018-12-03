<template>
    <div class="app">
        <Layout>
            <Header>
                <app-head></app-head>
            </Header>
            <Layout>
                <Sider hide-trigger :style="{background: '#fff'}">
                </Sider>
                <Layout class="main-layout">
                    <Content class="content">
                        <router-view></router-view>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    </div>

</template>

<script>
  import 'iview/dist/styles/iview.css'
  import AppHead from './components/AppHead'
  import './assets/styles/global.less'
  import './assets/styles/app.less'
  export default {
    name: 'app',
    components: {
      AppHead
    }
  }
</script>
<style scoped lang="less">
    .ivu-layout-has-sider{
        background: @bg-color;
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
    }
</style>
