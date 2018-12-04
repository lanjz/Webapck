<template>
  <div class="code-mirror absolute-full flex direction-column">
    <div class="code-mirror-tags flex align-items-center justify-content-space-between">
      <div>
        <div class="tags-item" @click="editMirror" :class="{'act': editMode !== 2}">Edit file</div>
        <div class="tags-item" @click="prviewsMirror":class="{'act': editMode === 2}">Preview</div>
      </div>
      <div class="tags-item-2 default-btn" @click="editAndPre":class="{'act': editMode === 3}" >Edit | Pre</div>
    </div>
    <div class="flex-1 relative" :class="{'hideSplit': editMode !== 3}">
      <Split v-model="split">
        <div slot="left" class="demo-split-pane">
          <div id="codeMirror"></div>
        </div>
        <div slot="right" class="demo-split-pane">
          <markdown-it-vue class="md-body" :content="markDownValue"/>
        </div>
      </Split>
    </div>
  </div>
</template>

<script lang="ts">
  import MarkdownItVue from 'markdown-it-vue'
  import CodeMirror from 'codemirror'
  import 'codemirror/mode/markdown/markdown'
  import 'codemirror/lib/codemirror.css'

  export default {
    name: 'code-edit',
    model: {
      prop: 'value',
      event: 'input'
    },
    props: {
      value: String
    },
    data() {
      return {
        split: 0.5,
        markDownValue: '',
        editMode: 1 // 编辑模式
      }
    },
    components: {
      MarkdownItVue
    },
    computed: {
    },
    methods: {
      editMirror() {
        this.split = 1
        this.editMode = 1
      },
      editAndPre() {
        if (this.editMode === 3) {
          this.editMirror()
          return
        }
        this.split = 0.5
        this.editMode = 3
      },
      prviewsMirror() {
        this.split = 0
        this.editMode = 2
      }
    },
    mounted() {
      this.editor = CodeMirror(document.getElementById('codeMirror'), {
        mode: 'text/x-markdown',
        styleActiveLine: true,
        lineNumbers: true,
        lineWrapping: true,
        theme: 'github-light',
      });
      this.editor.on('change', (instance, changeObj) => {
        const value = this.editor.getValue()
        this.markDownValue = value
        this.$emit('input', value)
        console.log('changeObj', changeObj)
      })
      window.onresize = () => {
        console.log(this.editor.refresh)
      }
    }
  }
</script>

<style lang="less">
  @mirror-color:#fff;
  .cm-s-github-light{
    font-family: inherit;
    color: #24292e;
    font-size: 12px;
    height: 100%;
    .CodeMirror-gutters{
      background-color: @mirror-color;
      border-right: solid 1px @mirror-color;
    }
    .CodeMirror-linenumber{
      color: #959da5;
      padding: 0 16px;
    }
    .CodeMirror-code{
      padding-right: @padding-size*3;
    }
  }
  .code-mirror{
    .ivu-split-horizontal, .demo-split-pane{
      height: 100%;
    }
    .CodeMirror-hscrollbar{
      overflow-x: auto;
    }
    .hideSplit .ivu-split-trigger-con{
      display: none;
    }
  }
</style>
<style scoped lang="less">
  .showCompileMarkdownBox, #codeMirror{
    width: 100%;
    height: 100%;
  }
  .code-mirror{
    overflow: hidden;
    border: 1px solid #dcdee2;
    .demo-split-pane{
      padding: 10px;
      overflow: auto;
    }
    .showCompileMarkdownBox{
      padding: 0 @padding-size;
      overflow: auto;
      word-break: break-all;
    }
    .ivu-split-horizontal{
      height: 100%;
    }
    .code-mirror-tags{
      background: @bg-color;
      position: relative;
      .tags-item{
        border-bottom: 1px solid #fff;
        position: relative;
        display: inline-block;
        padding: 12px 15px;
        cursor: pointer;
      }
      .tags-item.act{
        color: @font-primary-color;
        background: #fff;
        z-index: 2;
      }
      .tags-item:hover{
        color: @font-pre-color;
      }
      .tags-item-2{
        display: inline-block;
        float: right;
        cursor: pointer;
      }
      .tags-item-2.act{
        background: @primary-color;
        color: #fff;
      }
    }
    .code-mirror-tags:after{
      content: '';
      height: 1px;
      background: @border-color;
      position: absolute;
      width: 100%;
      left: 0;
      z-index: 1;
      bottom: 0;
    }
  }
</style>
