<template>
    <CodeEdit v-model="codeValue"></CodeEdit>
</template>

<script>
  import CodeEdit from '../components/CodeEdit'

  export default {
    name: 'hello-world',
    data() {
      return {
        codeValue: '#Test'
      }
    },
    components: {
      CodeEdit
    },
    watch: {
      codeValue(value) {
        console.log('value', value)
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
