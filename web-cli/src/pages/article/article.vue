<template>
  <div class="article-layout flex direction-column flex-1"  :class="editMeta._id">
    <div class="article-title flex ">
      <div class="flex-1 schema-title-layout relative">
        <input class="full-input" v-model.trim="articleName" @blur="todoSave" />
      </div>
      <div class="schema-operate">
        <span class="btn"
              :class="{'disable-btn': !articleName}"
              @click="todoSave">保存</span>
        <span class="btn warn" @click="todoDelete" v-if="editId!=='new'">删除</span>
      </div>
    </div>
    <div class="flex-1 flex">
      <div
        @click="isEditContents = true"
        v-click-outside="toDoSaveArticleContent"
        class="article-content relative flex-1 flex" :class="{'noSave': dataHasChange}">
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
      <div class="flex-1 relative">
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
        contents: {},
        editId: 'new',
        schemaId: '',
        catalogId: '',
        test: '123',
        fields: [],
        contentList: [],
        cacheContents: {},
        isEditContents: false
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
        ACTIONS.ARTICLE_DELETE,
        ACTIONS.ARTICLE_CONTENT_PUT,
        ACTIONS.ARTICLE_CONTENT_POST
      ]),
      async setMeta(val) {
        const { editId, fields, _id, catalogId, content, title } = val
        this.editId = editId
        this.schemaId = _id
        this.catalogId = catalogId
        this.fields = []
        setTimeout(() =>{
          this.getContentList()
          this.articleName = editId === 'new' ? '未命名' : title
          this.fields = [ ...fields ]
          this.contents = content
          this.cacheContents = JSON.parse(JSON.stringify(this.contents))
        })
      },
      todoEditContent(contentItem) {
        const content = contentItem ? contentItem : {
          _id: 'new'
        }
        const arg = {
          editId: this.editId,
          _id: this.schemaId,
          catalogId: this.catalogId,
          fields : this.fields,
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
      todoDelete() {
        this.$alert({
          content: `你确认要删除"${this.articleName}"`,
          showCancel: false
        })
          .then(async res => {
            if(res) {
              this.doDeleteArticle(this.editId)
            }
          })
      },
      async doDeleteArticle(id) {
        this.$showLoading()
        await this[ACTIONS.ARTICLE_DELETE](id)
        this.$hideLoading()
      },
      async todoSave() {
        if(!this.articleName) return
        let result = {}
        this.$showLoading()
        if(this.editId === 'new') {
          result = await this[ACTIONS.ARTICLE_POST]({
            schemaId: this.schemaId,
            catalogId: this.catalogId,
            content: this.contents,
            title: this.articleName
          })
        } else {
          result = await this[ACTIONS.ARTICLE_PUT]({
            _id: this.editId,
            content: this.contents,
            title: this.articleName
          })
        }
        if(!result.err) {
          const id = this.editId === 'new' ? result.data.id : this.editId
          await this.getData(id, true)
          this.$emit('emitUpdateArticle', {
            schemaId: this.schemaId,
            catalogId: this.catalogId,
            articleId: id
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
        if(!this.dataHasChange) return
        this.isEditContents = false
        this.$showLoading()
        let contentId = ''
        if(this.contents._id === 'new') {
          await this[ACTIONS.ARTICLE_CONTENT_POST](
            {
              _id: this.editId,
              content: this.contents,
            }
          )
        } else {
          await this[ACTIONS.ARTICLE_CONTENT_PUT](
            {
              _id: this.editId,
              content: this.contents,
            }
          )
          contentId = this.contents._id
        }

        this.$emit('emitUpdateArticle', {
          schemaId: this.schemaId,
          catalogId: this.catalogId,
          articleId: this.editId,
          contentId

        })
        this.$hideLoading()
//        alert()
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
    padding: 15px;
    font-size: 18px;
    background: #fff;

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
    box-shadow: 0 0 4px 1px  @warn-color inset;
  }
</style>
