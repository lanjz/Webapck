<template>
  <div class="flex">
    <div class="flex flex-1 direction-column">
      <div class="flex-1 form-bg bg-fff">
        {{schema}}
        <div class="form-layout">
          <div class="form-group flex">
            <div class="form-label-layout">
              别名：
            </div>
            <div class="flex flex-1 align-items-center">
              <input class="form-input" v-model="schema.name"/>
            </div>
          </div>
          <div class="form-group flex">
            <div class="form-label-layout">
              类型：
            </div>
            <div class="flex flex-1 align-items-center">
              <select class="from-select" v-model="schema.type" @change="doClearSchemaDefault">
                <option
                  v-for="(item, index) in typeList"
                  :value="item.name"
                >{{item.alias}}
                </option>
              </select>
            </div>
          </div>
          <div class="form-group flex" v-if="schema.type === 'radio' || schema.type === 'select'">
            <div class="form-label-layout">
              选项：
            </div>
            <div class="flex flex-1 form-content wrap direction-column">
              <div class="flex align-items-center wrap">
                <div class="add-options-item"
                     v-for="(item, index) in schema.options"
                     contenteditable="true">
                  {{item}}
                </div>
              </div>
              <div flex align-items-center wrap>
                <input type="text" class="form-input add-options-input" v-focus:select v-model="newOptionValue">
                <div
                  class="add-options-item add-options-btn"
                  :class="{'disable-btn': !newOptionValue}"
                  @click.trim="doAddSchemaOption">
                  add
                </div>
              </div>
            </div>
          </div>
          <!--单选默认值-->
          <div class="form-group flex" v-if="schema.type === 'input'">
            <div class="form-label-layout">
              默认值：
            </div>
            <div class="flex flex-1 align-items-center">
              <input type="text" class="form-input" v-model="schema.default">
            </div>
          </div>
          <!--多行默认值-->
          <div class="form-group flex"
               v-if="schema.type === 'textarea' || schema.type === 'markdown'"
          >
            <div class="form-label-layout">
              默认值：
            </div>
            <div class="flex flex-1 align-items-center">
              <textarea type="text" class="form-input" v-model="schema.default" />
            </div>
          </div>
          <!--radios默认值-->
          <div class="form-group flex" v-if="schema.type === 'radio'&&schema.options.length">
            <div class="form-label-layout">
              默认值：
            </div>
            <div class="flex flex-1 align-items-center">
              <div
                class="add-options-item radio-style"
                :class="{'act':!schema.default}"
                @click="schema.default = ''"
              >
                无
              </div>
              <div
                class="add-options-item radio-style"
                v-for="(item, index) in schema.options"
                :class="{'act':item.id === schema.default}"
              >
                <input type="radio" class="form-radio" :value="item.id" :key="item.id" v-model="schema.default">{{item.name}}
              </div>
            </div>
          </div>
          <!--select默认值-->
          <div class="form-group flex" v-if="schema.type === 'select'&&schema.options.length">
            <div class="form-label-layout">
              默认值：
            </div>
            <div class="flex flex-1 align-items-center">
              <div
                class="add-options-item radio-style"
                v-for="(item, index) in schema.options"
                :class="{'act':schema.arrDefault.indexOf(item.id) > -1}"
              >
                <input type="checkbox" class="form-radio" :value="item.id" :key="item.id" v-model="schema.arrDefault">{{item.name}}
              </div>
            </div>
          </div>
          <div class="form-group submit-layout">
            <div class="btn" @click="todoSaveSchema">提交</div>
            <div class="btn second-btn" @click="todoCloseEdit">返回</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapState, mapGetter, mapMutations, mapActions } from 'vuex'
  import * as MUTATIONS from '../../store/const/mutaions'
  import * as ACTIONS from '../../store/const/actions'
  const initSchema = {
    type: 'input',
    name: '',
    options: [],
    default: '',
    arrDefault: [],
  }
  export default {
    props: {
      curSchema: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data() {
      return {
        schema: { ...initSchema },
        optionsIdAsc: 0,
        typeList: [
          {alias: '单行文本', name: 'input', type: 'String'},
          {alias: '多行文本', name: 'textarea', type: 'String'},
          {alias: 'markdown', name: 'markdown', type: 'markdown'},
          {alias: '单选', name: 'radio', type: 'String'},
          {alias: '多选', name: 'select', type: 'Array'},
          {alias: '日期', name: 'time', type: 'String'},
          {alias: '标签', name: 'label', type: 'Array'},
        ],
        newOptionValue: ''
      }
    },
    methods: {
      ...mapActions([
        ACTIONS.SCHEMA_FIELD_POST,
        ACTIONS.SCHEMA_FIELD_PUT
      ]),
      doClearSchemaDefault() {
        this.schema.default = ''
        this.schema.arrDefault = []
      },
      doAddSchemaOption() {
        if(!this.newOptionValue) return
        if (this.schema.options.findIndex(item => item.name === this.newOptionValue) > -1){
          window.alert(`${this.newOptionValue}已存在`)
          return
        }
        let temIndex = this.optionsIdAsc + 1
        let temId = `option_${temIndex}`
        while (this.schema.options.findIndex(item => item.id === temId) > -1){
          temIndex += 1
          temId = `option_${temIndex}`
        }
        this.schema.options.push({
          name: this.newOptionValue,
          id: temId
        })
        this.newOptionValue = ''
      },
      todoSaveSchema() {
        if(!this.schema.name) {
          window.alert('请输入别名')
          return
        }
        let validErr = null
        const validType = Object.prototype.toString.call(this.schema.default)
        switch (this.schema.type) {
          case 'input':
          case 'textarea':
          case 'markdown':
          case 'time':
          case 'radio':
            if(this.schema.default && validType !== '[object String]') {
              validErr = new TypeError('类型值不是String类型')
            }
            break
          case 'select':
            if(this.schema.default && validType !== '[object Array]') {
              validErr = new TypeError('类型值不是Array类型')
            }
            break
        }
        if(validErr) {
          window.alert(validErr.message)
          return
        }
        this.doSaveSchema()
      },
      async doSaveSchema() {
        if(this.schema.type === 'select') {
          this.schema.default = this.schema.arrDefault
        }
        let result  = null
        if(this.schema._id) {
          result = await this[ACTIONS.SCHEMA_FIELD_PUT]({
            schemataId: this.schema._id,
            fields: this.schema
          })
        } else {
          result = await this[ACTIONS.SCHEMA_FIELD_POST](this.schema)
        }
        if(result.err) return

        console.log('this.schema', this.schema)
      },
      todoCloseEdit() {
        this.$emit('emitCloseEdit')
      }
    },
    mounted() {
      if(this.curSchema._id) {
        this.schema = { ...this.curSchema }
      }
    },
    beforeDestroy() {
      console.log('beforeDestroy')
      this.schema = initSchema
    }

  }
</script>
<style lang="less">
  .schema-layout {
    padding: 0 7px;
  }

  .schema-title {
    border-bottom: solid 1px @border-color;
    padding: 15px;
    font-size: 18px;
  }

  .schema-content {
    padding: 15px;
  }

  .add-options-item {
    padding: 4px 12px;
    display: inline-block;
    color: #fff;
    background: #24292e;
    border-radius: 2px;
    margin-right: 7px;
    margin-bottom: 7px;
  }
  .add-options-btn{
    margin: 0;
    transition: .4s;
  }

  .add-options-input {
    width: 140px;
    margin-right: 10px;
  }
  .form-content{
    max-width: 500px;
  }
  .form-bg{
    padding:10px;
  }
  .submit-layout{
    text-align: right;
    width: 350px;
  }
</style>
