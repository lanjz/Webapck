<template>
  <div class="flex">
    <div class="">
      <div>自定义字段</div>
    </div>
    <div class="flex flex-1 direction-column">
      <div class="schema-title">
        测试测试测试
      </div>
      <div class="schema-content">
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
          <div class="form-group flex" v-if="schema.type === 'radio' || 'select'">
            <div class="form-label-layout">
              选项：
            </div>
            <div class="flex flex-1 align-items-center form-content wrap">
              <div class="add-options-item"
                   v-for="(item, index) in schema.options"
                   contenteditable="true">
                {{item}}
              </div>
              <input type="text" class="form-input add-options-input" v-focus:select>
              <div class="add-options-item" @click="doAddSchemaOption">add</div>
            </div>
          </div>
          <div class="form-group flex" v-if="schema.type === 'input' || 'textarea'">
            <div class="form-label-layout">
              默认值：
            </div>
            <div class="flex flex-1 align-items-center">
              <input type="text" class="form-input">
            </div>
          </div>
          <div class="form-group flex" v-if="schema.type === 'radio'&&schema.options.length">
            <div class="form-label-layout">
              默认值：
            </div>
            <div class="flex flex-1 align-items-center">
              <div class="add-options-item" v-for="(item, index) in schema.options">
                <input type="radio" v-model="schema.default">{{item.name}}
              </div>
            </div>
          </div>
          <div class="form-group flex" v-if="schema.type === 'radio'&&schema.options.length">
            <div class="form-label-layout">
              默认值：
            </div>
            <div class="flex flex-1 align-items-center">
              <div class="add-options-item" v-for="(item, index) in schema.options">
                <input type="checkBox" v-model="schema.arrDefault">{{item.name}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        schema: {
          type: 'input',
          name: '',
          options: [],
          default: '',
          arrDefault: [],
        },
        optionsIdAsc: 0,
        temOptions: {
          id: 1,
          name: ''
        },
        typeList: [
          {alias: '单行文本', name: 'input'},
          {alias: '多行文本', name: 'textarea'},
          {alias: '单选', name: 'radio'},
          {alias: '多选', name: 'select'},
          {alias: '日期', name: 'time'},
        ]
      }
    },
    methods: {
      doClearSchemaDefault() {
        this.schema.default = ''
        this.schema.arrDefault = []
      },
      doAddSchemaOption() {
        this.temOptions.id = this.optionsIdAsc + 1
        let nameIndex = this.temOptions.id
        let tempName = `未命名选项${nameIndex}`
        while (this.schema.options.indexOf(tempName) > -1){
          nameIndex += 1
          tempName = `未命名选项${nameIndex}`
        }
        while (this.schema.options.findIndex(item => item.name === tempName) > -1){
          nameIndex += 1
          tempName = `未命名选项${nameIndex}`
        }
        this.temOptions.name = tempName
        this.schema.options.push('选项')
      }
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

  .add-options-input {
    width: 100%;
  }
  .form-content{
    max-width: 500px;
  }
</style>
