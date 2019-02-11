<template>
  <div class="article-layout flex-1 flex direction-column">
    <div class="article-title flex">
      <div class="flex-1 schema-title-layout relative">
        <input class="full-input" v-model.trim="articleName"/>
      </div>
      <div class="schema-operate">
        <span class="btn"
              :class="{'disable-btn': !articleName}"
              @click="todoSave">保存</span>
        <span class="btn warn" @click="todoDelete">删除</span>
      </div>
    </div>
    <div class="article-content">
      <div class="form-layout theme-1" v-if="editMeta.fields&&editMeta.fields.length">
        <div class="form-group flex" v-for="(field, index) in editMeta.fields" :index="index">
          <div class="form-label-layout">
            {{field.name}}-{{field.type}}：
          </div>
          <div class="flex flex-1 align-items-center" v-if="field.type==='markdown'">
            <textarea type="text" class="form-input" v-model="contents[field._id]"/>
          </div>
          <div class="flex flex-1 align-items-center" v-if="field.type==='input'">
            <input class="form-input" v-model="contents[field._id]"/>
          </div>
          <div class="flex flex-1 align-items-center" v-if="field.type==='textarea'">
            <textarea type="text" class="form-input"  />
          </div>
          <div class="flex flex-1 align-items-center" v-if="field.type==='radio'">
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
          <div class="flex flex-1 align-items-center"
               v-if="field.type==='select'">
            <div
              class="add-options-item radio-style"
              v-for="(optionsItem, optionsIndex) in field.options"
              :class="{
                'act':Object.prototype.toString.call(contents[field._id]) === '[object Array]'&&
                contents[field._id].indexOf(optionsItem.id) > -1
              }"
            >
              {{optionsItem.name}}
              <input type="checkBox"
                     class="form-radio"
                     :value="optionsItem.id"
                     @change="changeSelect(field._id, optionsItem)"
                     :key="optionsItem.id" >
            </div>
          </div>
        </div>
      </div>
      <div v-if="Object.values(contents)">{{contents}}</div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapGetter, mapMutations, mapActions } from 'vuex'
  import * as MUTATIONS from '../../store/const/mutaions'
  import * as ACTIONS from '../../store/const/actions'
  export default {
    props: {
      editMeta: {
        type: Object,
      }
    },
    data: function () {
      return {
        articleName:'',
        contents: {},
      }
    },
    computed: {
      ...mapState({
        catalogs: state => state.catalogs.list,
        bookList: state => state.books.list,
      })
    },
    watch: {
      editMeta: function (val) {
        const tempObj = {}
        const { MOCK } = process.env
        if(val.fields && val.fields.length) {
          val.fields.forEach((item) => {
            if(MOCK && item.type === 'select') {
              tempObj[item._id] = []
            } else {
              tempObj [item._id] = item.default ?　item.default :  ''
            }
          })
        }
        this.contents = tempObj
      }
    },
    components: {
    },
    methods: {
      ...mapMutations([
        MUTATIONS.BOOK_CUR_UPDATE
      ]),
      ...mapActions([
        ACTIONS.ARTICLE_DES_GET,
      ]),
      changeSelect(id, tar) {
        if(Object.prototype.toString.call(this.contents[id]) !== '[object Array]') {
          this.contents[id] = []
        }
        const findIndex = this.contents[id].indexOf(tar.id)
        if(findIndex > -1) {
          this.contents[id].splice(findIndex, 1)
          return
        }
        this.contents[id].push(tar.id)
      },
      todoDelete() {

      },
      todoSave() {
        if(!this.articleName) return
      },
      async getData(id) {
        this.$showLoading()
        const result = await this[ACTIONS.ARTICLE_DES_GET]({
          _id: id
        })
        if(!result.err) {
          const { bookId, catalogId } = result.data
          this[MUTATIONS.BOOK_CUR_UPDATE](bookId)
        }
        this.$hideLoading()
      },
      async init() {
        const { id } = this.$route.params
        if(id) {
          await this.getData(id)
        }
      }
    },
    mounted() {
      this.init()
    }
  }
</script>
<style lang="less">
  .article-layout{
    padding: 0 7px;
  }
  .article-title{
    border-bottom: solid 1px @border-color;
    padding: 15px;
    font-size: 18px;
  }
  .article-content{
    padding: 15px;
  }

</style>
