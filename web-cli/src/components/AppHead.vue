<template>
    <div class="page-head flex justify-content-space-between align-items-center">
        <div class="head-logo"></div>
        <ul class="nav">
            <router-link v-for="(item, index) in routes" :key="index" tag="li" :to="item.path">
                {{item.alias}}
            </router-link>
        </ul>
    </div>
</template>

<script>
  import { routes } from '../router'
  export default {
    name: 'AppHead',
    data() {
      return {
        routes
      }
    }
  }
</script>

<style scoped lang="less">
    .page-head{
        height: inherit;
    }
    .head-logo{
        width: 100px;
        height: 30px;
        background: @primary-color;
        border-radius: 3px;
        position: relative;
    }
    .nav{
        font-size: 16px;
        li{
            display: inline-block;
            list-style: none;
            border-bottom: solid 2px transparent;
            padding-bottom: 2px;
            cursor: pointer;
        }
        li:not(:first-child){
            margin-left: 40px;
        }
        li.router-link-exact-active{
            border-bottom: solid 2px @primary-color;
        }
    }

</style>
