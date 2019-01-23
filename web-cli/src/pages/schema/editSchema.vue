<template>
  <div class="flex">
    <div class="flex flex-1 direction-column">
      <div class="flex-1 form-bg bg-fff">
        <div class="form-layout">
          <div class="form-group flex">
            <div class="form-label-layout">
              别名：
            </div>
            <div class="flex flex-1 align-items-center">
              <input class="form-input" v-model="field.name"/>
            </div>
          </div>
          <div class="form-group flex">
            <div class="form-label-layout">
              类型：
            </div>
            <div class="flex flex-1 align-items-center">
              <select class="from-select" v-model="field.type" @change="doClearSchemaDefault">
                <option
                  v-for="(item, index) in typeList"
                  :value="item.name"
                >{{item.alias}}
                </option>
              </select>
            </div>
          </div>
          <div class="form-group flex" v-if="field.type === 'radio' || field.type === 'select'">
            <div class="form-label-layout">
              选项：
            </div>
            <div class="flex flex-1 form-content wrap direction-column">
              <div class="flex align-items-center wrap">
                <div class="add-options-item"
                     v-for="(item, index) in field.options"
                     @blur="e => todoOptionRename(e, index)"
                     contenteditable="true">
                  {{item.name}}
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
          <div class="form-group flex" v-if="field.type === 'input'">
            <div class="form-label-layout">
              默认值：
            </div>
            <div class="flex flex-1 align-items-center">
              <input type="text" class="form-input" v-model="field.default">
            </div>
          </div>
          <!--多行默认值-->
          <div class="form-group flex"
               v-if="field.type === 'textarea' || field.type === 'markdown'"
          >
            <div class="form-label-layout">
              默认值：
            </div>
            <div class="flex flex-1 align-items-center">
              <textarea type="text" class="form-input" v-model="field.default" />
            </div>
          </div>
          <!--radios默认值-->
          <div class="form-group flex" v-if="field.type === 'radio'&&field.options.length">
            <div class="form-label-layout">
              默认值：
            </div>
            <div class="flex flex-1 align-items-center">
              <div
                class="add-options-item radio-style"
                :class="{'act':!field.default}"
                @click="field.default = ''"
              >
                无
              </div>
              <div
                class="add-options-item radio-style"
                v-for="(item, index) in field.options"
                :class="{'act':item.id === field.default}"
              >
                <input type="radio" class="form-radio" :value="item.id" :key="item.id" v-model="field.default">{{item.name}}
              </div>
            </div>
          </div>
          <!--select默认值-->
          <div class="form-group flex" v-if="field.type === 'select'&&field.options.length">
            <div class="form-label-layout">
              默认值：
            </div>
            <div class="flex flex-1 align-items-center">
              <div
                class="add-options-item radio-style"
                v-for="(item, index) in field.options"
                :class="{'act':field.arrDefault.indexOf(item.id) > -1}"
              >
                <input type="checkbox" class="form-radio" :value="item.id" :key="item.id" v-model="field.arrDefault">{{item.name}}
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
      curField: {
        type: Object,
        default: function () {
          return {}
        }
      },
      curSchemataId: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data() {
      return {
        field: { ...initSchema },
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
        this.field.default = ''
        this.field.arrDefault = []
      },
      doAddSchemaOption() {
        if(!this.newOptionValue) return
        if (this.field.options.findIndex(item => item.name === this.newOptionValue) > -1){
          window.alert(`${this.newOptionValue}已存在`)
          return
        }
        let temIndex = this.optionsIdAsc + 1
        let temId = `option_${temIndex}`
        while (this.field.options.findIndex(item => item.id === temId) > -1){
          temIndex += 1
          temId = `option_${temIndex}`
        }
        this.field.options.push({
          name: this.newOptionValue,
          id: temId
        })
        this.newOptionValue = ''
      },
      todoSaveSchema() {
        if(!this.field.name) {
          window.alert('请输入别名')
          return
        }
        if(this.field.type === 'select') {
          this.field.default = this.field.arrDefault
        }
        let validErr = null
        const validType = Object.prototype.toString.call(this.field.default)
        switch (this.field.type) {
          case 'input':
          case 'textarea':
          case 'markdown':
          case 'time':
          case 'radio':
            if(this.field.default && validType !== '[object String]') {
              validErr = new TypeError('类型值不是String类型')
            }
            break
          case 'select':
            if(this.field.default && validType !== '[object Array]') {
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
        let result  = null
        if(this.field._id) {
          result = await this[ACTIONS.SCHEMA_FIELD_PUT]({
            schemataId: this.curSchemataId._id,
            _id: this.field._id,
            fields: this.field
          })
        } else {
          result = await this[ACTIONS.SCHEMA_FIELD_POST](this.field)
        }
        if(result.err) return
        this.todoCloseEdit()
      },
      todoCloseEdit() {
        this.$emit('emitCloseEdit')
      },
      todoOptionRename(e, index){
        this.field.options[index].name = e.target.innerText
      }
    },
    mounted() {
      if(this.curField._id) {
        this.field = { ...this.field, ...this.curField }
      }
    },
    beforeDestroy() {
      console.log('beforeDestroy')
      this.field = initSchema
    }

  }
</script>
<style lang="less">
  .field-layout {
    padding: 0 7px;
  }

  .field-title {
    border-bottom: solid 1px @border-color;
    padding: 15px;
    font-size: 18px;
  }

  .field-content {
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
