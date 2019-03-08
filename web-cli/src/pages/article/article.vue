<template>
  <div class="article-layout flex direction-column flex-1"  :class="editMeta._id">
    <div class="article-title flex ">
      <div class="flex-1 schema-title-layout relative">
        <input class="full-input" v-model.trim="articleName" @blur="todoEdit" />
      </div>
      <div class="schema-operate">
        <span class="btn"
              :class="{'disable-btn': !articleName}"
              @click="todoSave" v-if="editId === 'new'">保存</span>
        <div class="operate-list-operate" v-else>
          <div class="icon-box" :class="{'act': showEditContent}" @click.stop="showEditContent=!showEditContent" v-if="showList">
            <i class="iconfont icon-zuoye1"></i>
          </div>
          <div class="icon-box" :class="{'act': showList}" @click.stop="toggleList">
            <i class="iconfont icon-wendang"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-1 flex">
      <div
        v-show="(showList&&showEditContent)||!showList"
        @click="isEditContents = true"
        v-click-outside="toDoSaveArticleContent"
        class="article-content relative flex-1 flex">
        <div class="noSave" v-show="dataHasChange"></div>
        <div class="flex-1 relative">
          <div class="scroll-box" >
            <div class="form-layout theme-1" v-if="fields&&fields.length">
              <div class="form-group flex direction-column" v-for="(field, index) in fields" :index="index">
                <div class="form-label-layout">
                  {{field.name}}-{{field.type}}：
                </div>
                <div class="flex flex-1 align-items-center form-content-layout markdown-layout" v-if="field.type==='markdown'">
                  <markdown-edit v-model="contents[field._id]"></markdown-edit>
                </div>
                <div class="flex flex-1 align-items-center form-content-layout" v-if="field.type==='input'">
                  <input class="form-input" v-model="contents[field._id]" :placeholder="'填写'+field.name"/>
                </div>
                <div class="flex flex-1 align-items-center form-content-layout" v-if="field.type==='textarea'">
                  <textarea type="text" class="form-input"/>
                </div>
                <div class="flex flex-1 align-items-center form-content-layout" v-if="field.type==='radio'">
                  <div
                    class="add-options-item radio-style"
                    :class="{'act':optionsItem.id === contents[field._id]}"
                    v-for="(optionsItem, optionsIndex) in field.options"
                  >
                    {{optionsItem.name}}
                    <input
                      type="radio"
                      class="form-radio"
                      :value="optionsItem.id"
                      v-model="contents[field._id]">
                  </div>
                </div>
                <div class=" form-content-layout form-content-layout-select"
                     v-if="field.type==='select'">
                  <div
                    class="select-style"
                    v-for="(optionsItem, optionsIndex) in field.options"
                    :class="{
                'act':Object.prototype.toString.call(contents[field._id]) === '[object Array]'&&
                contents[field._id].indexOf(optionsItem.id) > -1
              }"
                  >
                    <div class=" flex align-items-center">
                      <div class="select-iconfont"><i class="iconfont icon-gou"></i></div>
                      <div>{{optionsItem.name}}</div>
                    </div>
                    <input type="checkBox"
                           class="form-radio"
                           :value="optionsItem.id"
                           @change="changeSelect(field._id, optionsItem)"
                           :key="optionsItem.id">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1 relative" v-if="showList">
        <div class="scroll-box">
          <article-content-list
            :fields=fields
            :contentList=contentList
            @focusContent=todoEditContent
            :curContentId="contents._id"
          ></article-content-list>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import { mapState, mapGetter, mapMutations, mapActions } from 'vuex'
  import * as MUTATIONS from '../../store/const/mutaions'
  import * as ACTIONS from '../../store/const/actions'
  import articleContentList from './articleContentList.vue'
  import MarkdownEdit from '../../components/markdownEdit.vue'

  export default {
    props: {
      editMeta: {
        type: Object,
      }
    },
    data: function () {
      return {
        articleName: '未命名',
        cacheName: '未命名',
        contents: {},
        editId: 'new',
        schemaId: '',
        catalogId: '',
        test: '123',
        fields: [],
        contentList: [],
        cacheContents: {},
        isEditContents: false,
        showList: false,
        showEditContent: false
      }
    },
    components: {
      MarkdownEdit,
      articleContentList
    },
    computed: {
      ...mapState({
        catalogs: state => state.catalogs.list,
        bookList: state => state.books.list,
        articles: state => state.articles.list,
      }),
      dataHasChange() {
        return JSON.stringify(this.contents) !== JSON.stringify(this.cacheContents)
      }
    },
    watch: {
      editMeta: function (val) {
        this.setMeta(val)
      },
      editId: function (val) {
        this[MUTATIONS.ARTICLE_CUS_SAVE](val)
      }
    },
    methods: {
      ...mapMutations([
        MUTATIONS.ARTICLE_CUS_SAVE,
        MUTATIONS.BOOK_CUR_UPDATE
      ]),
      ...mapActions([
        ACTIONS.ARTICLE_DES_GET,
        ACTIONS.ARTICLE_POST,
        ACTIONS.ARTICLE_PUT,
        ACTIONS.ARTICLE_CONTENT_PUT,
        ACTIONS.ARTICLE_CONTENT_POST
      ]),
      async setMeta(val) {
        const { editId, fields, _id, catalogId, content, title, list } = val
        this.editId = editId
        this.schemaId = _id
        this.catalogId = catalogId
        this.fields = []
        setTimeout(() =>{
          this.getContentList()
          this.cacheName = this.articleName = editId === 'new' ? '未命名' : title
          this.showList = list || false
          this.fields = [ ...fields ]
          this.contents = content
          this.cacheContents = JSON.parse(JSON.stringify(this.contents))
        })
      },
      todoEditContent(contentItem) {
        this.showEditContent = true
        const content = contentItem ? contentItem : {
          _id: 'new'
        }
        const arg = {
          editId: this.editId,
          _id: this.schemaId,
          catalogId: this.catalogId,
          fields : this.fields,
          title: this.articleName,
          list: this.showList,
          content
        }
        this.setMeta(arg)
      },
      getContentList() {
        if(this.editId === 'new') {
          this.contentList = []
          return
        }
        const data = this.articles[this.editId].contents
        this.contentList = [ ...data ]
        console.log('data', this.contentList)
        return data
      },
      changeSelect(id, tar) {
        if(Object.prototype.toString.call(this.contents[id]) !== '[object Array]') {
          this.contents[id] = []
        }
        const findIndex = this.contents[id].indexOf(tar.id)
        if(findIndex > -1) {
          this.contents[id].splice(findIndex, 1)
          return
        }
        const arr = [ ...this.contents[id] ]
        arr.push(tar.id)
//         this.contents[id] = [ ...arr ]
        this.contents[id].push(tar.id)
        this.contents = JSON.parse(JSON.stringify(this.contents))
      },
      toggleList() {
        this.showList = !this.showList
        if(!this.articleName){
          this.articleName = this.cacheName
        }
        this.todoEdit(true)
      },
      async todoEdit(force = false) {
        if(!force){
          if(!this.articleName ||
            this.editId === 'new' ||
            this.cacheName === this.articleName
          ) {
            return
          }
        }
        this.$showLoading()
        const result = await this[ACTIONS.ARTICLE_PUT]({
          _id: this.editId,
          content: this.contents,
          title: this.articleName,
          list: this.showList
        })
        if(!result.err) {
          this.$toast({
            title: '保存成功'
          })
          const id = this.editId
          await this.getData(id, true)
          this.$emit('emitUpdateArticle', {
            schemaId: this.schemaId,
            catalogId: this.catalogId,
            articleId: id,
            getData: 'getArticleByCatalogId'
          })
        }
        this.$hideLoading()
      },
      async todoSave() {
        if(!this.articleName) return
        this.$showLoading()
        const result = await this[ACTIONS.ARTICLE_POST]({
          schemaId: this.schemaId,
          catalogId: this.catalogId,
          content: this.contents,
          title: this.articleName
        })
        if(!result.err) {
          this.$toast({
            title: '添加成功'
          })
          const id = result.data.id
          await this.getData(id, true)
          this.$emit('emitUpdateArticle', {
            schemaId: this.schemaId,
            catalogId: this.catalogId,
            articleId: id,
            getData: 'getArticleByCatalogId'
          })
        }
        this.$hideLoading()
      },
      async getData(id, force = false) {
        this.editId = id
        this.$showLoading()
        const result = await this[ACTIONS.ARTICLE_DES_GET]({
          _id: id,
          force
        })
        if(!result.err) {
          const { bookId, catalogId } = result.data
          const { MOCK } = process.env
          if(!MOCK){
            this[MUTATIONS.BOOK_CUR_UPDATE](bookId)
          }
        }
        this.$hideLoading()
      },
      async toDoSaveArticleContent() {
        if(!this.dataHasChange || this.editId === 'new') return
        this.isEditContents = false
        this.$showLoading()
        let contentId = ''
        let result = ''
        if(this.contents._id === 'new') {
          result = await this[ACTIONS.ARTICLE_CONTENT_POST](
            {
              _id: this.editId,
              content: this.contents,
            }
          )
        } else {
          result = await this[ACTIONS.ARTICLE_CONTENT_PUT](
            {
              _id: this.editId,
              content: this.contents,
            }
          )
          contentId = this.contents._id
        }
        this.$hideLoading()
        if(!result.err) {
          const toastMsg = this.contents._id === 'new' ? '添加成功' : '保存成功'
          this.$toast({
            title: toastMsg
          })
        }
        this.$emit('emitUpdateArticle', {
          schemaId: this.schemaId,
          catalogId: this.catalogId,
          articleId: this.editId,
          contentId

        })
      },
      async init() {
        const { id } = this.$route.params
        if(id) {
          this.editId = id
          await this.getData(id)
        }
      }
    },
    mounted() {
      this.init()
    }
  }
</script>
<style lang="less" scoped>
  .article-layout {
    background: #eee;
    position: relative;

    .form-label-layout{
      width: 100%;
      text-align: left;
      font-size: 12px;
      color: #adabab;
      padding-left: 0;
    }
    .form-content-layout{
      background: #fff;
      padding: 7px 20px;
    }
    .add-options-item{
      margin: 5px;
    }
    .from-select, .form-input{
      border: none;
      outline: none;
      padding: 0;
    }
    .form-group:not(:first-child){
      margin: 0;
    }
    .form-content-layout-select{
      padding-top: 18px;
      padding-bottom: 18px;
    }
    .markdown-layout{
      min-height: 500px;
      position: relative;
      padding: 10px;
    }
  }
  .article-layout-theme1{
    .article-content{
      padding: 40px;
    }
    .form-label-layout{
      display: none;
    }
    .from-select, .form-input{
      border: none;
      outline: none;
      font-size: 20px;
    }
  }
  .article-title {
    border-bottom: solid 1px @border-color;
    font-size: 18px;
    background: #fff;
    height: 65px;
    line-height: 65px;
    padding: 0 15px;
    .operate-list-operate{
      .iconfont{
        font-size: 20px;
        cursor: pointer;
      }
      .icon-box{
        border: solid 1px @tree-color;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        display: inline-block;
      }
      .icon-box.act{
        background: @highlight-color;
        color: #fff;
      }
    }
  }

  .article-content {
    padding: 7px;
  }

  .full-input {
    font-size: 20px;
    outline: none;
    color: @tree-light-bg-color;
  }

  .markdown{
    .form-label-layout{
      display: none;
    }
    .markdown-layout{
      padding: 0;
    }
    .article-content{
      padding: 0;
    }
    .scroll-box{
      overflow: hidden;
    }
    .form-group, .form-layout{
      height: 100%;
    }
  }
  .noSave{
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 1;
    box-shadow: 0 0 4px 1px  @warn-color inset;

  }
</style>
