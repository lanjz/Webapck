<template>
  <div class="code-mirror absolute-full flex direction-column markdown-layout">
<!--    <div class="code-mirror-tags flex align-items-center justify-content-space-between">
      <div>
        <div class="tags-item" @click="editMirror" :class="{'act': editMode !== 2}">Edit file</div>
        <div class="tags-item" @click="prviewsMirror":class="{'act': editMode === 2}">Preview</div>
      </div>
      <div class="tags-item-2 default-btn" @click="editAndPre":class="{'act': editMode === 3}" >Edit | Pre</div>
    </div>-->
    <div class="flex-1 flex relative" :class="{'hideSplit': editMode !== 3}">
      <div class="flex-1 relative" v-if="isEdit">
        <div class="markdown-operate-layout">
          <div class="icon-layout" @click="toggleEdit"  :class="{'act': isEdit}"><i class="iconfont icon-bianji2" ></i></div>
          <div class="icon-layout" @click="togglePreview" :class="{'act': isPreview}"><i class="iconfont icon-yulan"  ></i></div>
        </div>
        <textarea class="markdown-edit-box box-shadow-inset" v-model="markDownValue"></textarea>
      </div>
      <div class="flex-1 md-body-layout edit-layout relative" v-if="isPreview">
        <div class="markdown-operate-layout">
          <div class="icon-layout" @click="toggleEdit" :class="{'act': isEdit}" ><i class="iconfont icon-bianji2" ></i></div>
          <div class="icon-layout" @click="togglePreview" :class="{'act': isPreview}" ><i class="iconfont icon-yulan" ></i></div>
        </div>
        <markdown-it-vue class="md-body" :content="markDownValue"/>
      </div>
    </div>
  </div>
</template>

<script>
  import MarkdownItVue from 'markdown-it-vue'

  export default {
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
        markDownValue: '23',
        editMode: 1, // 编辑模式
        isEdit: true,
        isPreview: true
      }
    },
    components: {
      MarkdownItVue
    },
    computed: {
    },
    methods: {
      toggleEdit() {
        this.isEdit = !this.isEdit
        if(!this.isEdit) {
          this.isPreview = true
        }
      },
      togglePreview() {
        this.isPreview = !this.isPreview
        if(!this.isPreview) {
          this.isEdit = true
        }
      }
    },
    mounted() {

    }
  }
</script>
<style scoped lang="less">
  .showCompileMarkdownBox, #codeMirror{
    width: 100%;
    height: 100%;
  }
  .code-mirror{
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
  .markdown-layout{
    .markdown-edit-box{
      width: 100%;
      height: 100%;
      overflow: auto;
      padding: 20px;
      background: @bg-color;
      color: @tree-color;
      border: none;
      outline: none;
      font-size: 14px;
    }
    .md-body-layout{
      overflow: auto;
      padding: 20px;
      background: #e7eaef;
      box-shadow: 0 0 4px 1px #e7eaef inset;
    }
    .markdown-operate-layout{
      position: absolute;
      z-index: 2;
      right: 20px;
      top: 10px;
      color: #fff;
      .icon-layout{
        display: inline-block;
        background: rgba(0,0,0,0.7);
        padding: 3px 5px;
        cursor: pointer;
        border-radius: 3px;
        text-align: center;
      }
      .icon-layout.act{
        background: rgba(57,141,238,0.7);
      }
    }
  }
</style>
