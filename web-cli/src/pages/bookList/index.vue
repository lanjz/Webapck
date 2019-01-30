<template>
  <div>
    <div class="book-list-layout">
      <div v-for="(item, index) in bookList" :key="index" class="book-item-layout">
        <div class="delete-icon book-item-delete" @click="todoDeleteBook(item)"></div>
        <div>
          <svg class="icon book-iconfont" aria-hidden="true">
            <use xlink:href="#icon-wenjianjia1"></use>
          </svg>
        </div>
        {{item.name}}
        <div class="book-item-layout-edit">
          <div class="book-item-layout-in-edit" @click="todoEditBool(item)">编辑</div>
        </div>
      </div>
      <div class="book-item-layout" style="padding-top: 25px">
        <div class="book-item-layout-add" @click="todoAddBook"></div>
        <div>
          <svg class="icon book-iconfont" aria-hidden="true">
            <use xlink:href="#icon-wenjianjia1"></use>
          </svg>
        </div>
      </div>
    </div>
    <div class="modal-mark-bg" v-if="showModal">
      <div class="modal-layout">
        <div class="modal-title">title <div class="modal-title-close" @click="doCloseModal"></div></div>
        <div class="form-bg bg-fff">
          <div class="form-layout">
            <div class="form-group flex">
              <div class="form-label-layout">
                名称：
              </div>
              <div class="flex flex-1 align-items-center">
                <input class="form-input" v-model.strim="editBookName">
              </div>
            </div>
          </div>
        </div>
        <div class="modal-operate">
          <div class="btn" @click="doSaveBook">确定</div>
          <div class="btn second-btn" @click="doCloseModal">取消</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapState, mapGetter, mapMutaions, mapActions } from 'vuex'
  import * as MUTATIONS from '../../store/const/mutaions'
  import * as ACTIONS from '../../store/const/actions'
  export default {
    data(){
      return {
        editBookName: '',
        showModal: false,
        curId: ''
      }
    },
    computed: {
      ...mapState({
        bookList: state => Object.values(state.books.list)
      }),
    },
    methods: {
      ...mapActions([
        ACTIONS.BOOK_LIST_GET,
        ACTIONS.BOOK_LIST_PUT,
        ACTIONS.BOOK_LIST_POST,
        ACTIONS.BOOK_LIST_DELETE,
      ]),
      async getData(force) {
        const result = await this[ACTIONS.BOOK_LIST_GET](force)
      },
      async init() {
        this.$showLoading()
        await this.getData(-1)
        this.$hideLoading()
      },
      todoDeleteBook(item) {
        this.$alert({
          content: `你确认要删除"${item.name}"`,
          showCancel: false
        })
          .then(async res => {
            if(res) {
              this.doDeleteBook(item)
            }
          })
      },
      async doDeleteBook(item) {
        this.$showLoading()
        const result = await this[ACTIONS.BOOK_LIST_DELETE]({
          _id: item._id
        })
        if(!result.err) {
          await this.getData()
        }
        this.$hideLoading()
      },
      doCloseModal() {
        this.curId = ''
        this.editBookName = ''
        this.showModal = false
      },
      todoAddBook() {
        this.curId = ''
        this.showModal = true
      },
      todoEditBool(item) {
        this.curId = item._id
        this.editBookName = item.name
        this.showModal = true
      },
      async doSaveBook() {
        if(!this.editBookName){
          this.$alert({
            content: '名称不能为空'
          })
          return
        }
        let result
        if(!this.curId) {
          result = await this[ACTIONS.BOOK_LIST_POST]({
            name: this.editBookName
          })
        } else {
          result = await this[ACTIONS.BOOK_LIST_PUT]({
            _id: this.curId,
            name: this.editBookName
          })
        }
        this.$showLoading()

        if(!result.err) {
          await this.getData()
        }
        this.$hideLoading()
        this.doCloseModal()
      }
    },
    mounted() {
      this.init()
    }
  }
</script>
<style scoped lang="less">
  .book-list-layout{
    padding: 20px;
  }
  .book-item-layout{
    padding: 10px;
    border-radius: 5px;
    border: solid 1px @border-color;
    display: inline-block;
    margin-right: 20px;
    text-align: center;
    font-size: 17px;
    position: relative;
    vertical-align: top;
    height: 110px;
    .book-item-layout-edit{
      position: absolute;
      width: 100%;
      height: 30px;
      line-height: 30px;
      text-align: center;
      font-size: 14px;
      bottom: 0;
      left: 0;
      cursor: pointer;
      overflow: hidden;
      .book-item-layout-in-edit{
        height: 100%;
        background: rgba(0,0,0,0.5);
        color: #fff;
        transform: translateY(100%);
        transition: .2s;
      }
    }
  }
  .book-item-layout:hover .book-item-layout-in-edit{
    transform: translateY(0);
  }
  .book-item-layout:hover .book-item-delete{
    display: block;
  }
  .book-iconfont{
    font-size: 60px;
  }
  .book-item-delete{
    right: -5px;
    top: -5px;
    position: absolute;
    display: none
  }
  .book-item-layout-add{
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: rgba(0,0,0,0.3);
    color: #fff;
    padding-top: 25px;
    cursor: pointer;
  }
  .book-item-layout-add:after{
    content: '';
    position: absolute;
    width: 50px;
    height: 4px;
    background: #fff;
    top: 50%;
    left: 50%;
    border-radius: 2px;
    transform: translate(-50%, -50%);
  }
  .book-item-layout-add:before{
    content: '';
    position: absolute;
    width: 4px;
    height: 50px;
    background: #fff;
    top: 50%;
    left: 50%;
    border-radius: 2px;
    transform: translate(-50%, -50%);
  }
</style>
