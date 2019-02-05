<template>
  <div class="left-layout flex">
    <div class="book-slider-layout">
      <div class="relative book-layout show-book-list">
        <div class="book-icon-layout" @click="goArticle">
         <!-- <div class="cur-book-icon">
            <i class="iconfont icon-bianji1"></i>
          </div>-->
          <div class="book-icon-layout flex justify-content-center align-items-center">
            <svg class="icon shelve-svg-icon" aria-hidden="true">
              <use xlink:href="#icon-wenjianjia1"></use>
            </svg>
            <div class="cur-book-name line-ellipsis" v-if="curBookInfo">{{curBookInfo.name}}</div>
          </div>
        </div>
        <div class="book-list-layout  flex justify-content-start direction-column">
          <div>
            <div
              v-for="(item, index) in bookList"
              @click.stop="todoSetCurBook(item)"
              class="book-list-item-layout flex align-items-center">
              <div>
                <svg class="icon shelve-svg-icon" aria-hidden="true">
                  <use xlink:href="#icon-wenjianjia1"></use>
                </svg>
              </div>
              <div class="book-name line-ellipsis">{{item.name}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="book-layout" @click="goBook">
        <router-link class="book-icon-layout" to="/BookList">
          <i class="iconfont icon-shuji"></i>
        </router-link>
      </div>
      <div class="book-layout" @click="goSchema">
        <router-link class="book-icon-layout" to="/Schema">
          <i class="iconfont icon-neirong"></i>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapState, mapGetters, mapMutations } from 'vuex'
  import * as MUTATIONS from '../../store/const/mutaions'
  export default {
    computed: {
      ...mapState({
        treeChain: state => state.catalogs.treeChain,
        bookList: state => Object.values(state.books.list),
      }),
      ...mapGetters([
        'curBookInfo'
      ])
    },
    methods: {
      ...mapMutations([
        MUTATIONS.BOOK_CUR_UPDATE
      ]),
      goArticle() {
        this.$router.push('/')
      },
      goBook() {
        this.$router.push('/BookList')
      },
      goSchema() {
        this.$router.push('/Schema')
      },
      goTest() {
        this.$router.push('/Bar')
      },
      todoSetCurBook(item) {
        this[MUTATIONS.BOOK_CUR_UPDATE](item._id)
      },
    }
  }
</script>
<style lang="less" scoped>
  .book-slider-layout{
    padding: 15px;
    background: @bg-second-color;
  }
  .book-layout{
    margin-top: 40px;
    width: 38px;
    height: 38px;
    cursor: pointer;
    position: relative;
    z-index: 1;
    a.book-icon-layout{
      display: inline-block;
    }
    .book-icon-layout{
      line-height: 38px;
      width: 100%;
      height: 100%;
      text-align: center;
      border-radius: 50%;
      background: #fff;
      position: relative;
      text-decoration: none;
      color: @bg-second-color;
      .cur-book-name{
        background: rgba(0,0,0,0.5);
        color: #fff;
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top:0;
        text-align: center;
        font-size: 12px;
        border-radius: 50%;
      }
    }
    .cur-book-icon{
      position: absolute;
      z-index: 2;
      width: 35px;
      height: 35px;
      left: 20px;
      bottom: 25px;
      border-radius: 50%;
    }
    .shelve-svg-icon{
      border-radius: 50%;
      font-size: 28px;
    }
    .router-link-active .iconfont{
      color: @highlight-color;
    }
    .book-list-layout{
      max-width: 300px;
      padding:7px 20px;
      background: @bg-second-color;
      position: absolute;
      left: 100%;
      top: 0;
      transition: .3s;
      transform: scale(0);
      transform-origin: 0 15px;
      .book-list-item-layout{
        color: #fff;
        text-align: center;
        .book-name{
          font-size: 12px;
          margin-left: 10px;
        }
      }
      .book-list-item-layout:not(:last-child) {
        margin-bottom: 10px;
      }
      .book-list-item-layout.act{
        .icon{
          border:solid 1px @highlight-color;
          background: @highlight-color;
        }
      }
    }
  }

  .show-book-list:hover  .book-list-layout{
    transform: scale(1);
  }
  .book-layout.act{
    transform: scale(1.2);
    .book-icon-layout{
      background: @highlight-color;
      .iconfont{
        color: #fff;
      }
    }
  }
  .book-layout:not(:last-child) {
    margin-bottom: 10px;
  }
</style>
