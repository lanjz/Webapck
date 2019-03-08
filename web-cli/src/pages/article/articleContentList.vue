<template>
 <div class="content-list absolute-full">
   <div class="content-list-item"
        v-for="(contents, index) in contentList" v-if="contentList && contentList.length"
        :key="index"
        @click="focusContent(contents)"
        :class="{'act': curContentId === contents._id}"
   >
     <div class="form-layout theme-1" v-if="fields&&fields.length">
       <div class="form-group flex" v-for="(field, index) in fields" :index="index">
         <div class="form-label-layout">
           {{field.name}}：
         </div>
         <div class="flex flex-1 align-items-center form-content-layout markdown-layout" v-if="field.type==='markdown'">
           {{contents[field._id]|| '无'}}
         </div>
         <div class="flex flex-1 align-items-center form-content-layout" v-if="field.type==='input'">
           {{contents[field._id]|| '无'}}
         </div>
         <div class="flex flex-1 align-items-center form-content-layout" v-if="field.type==='textarea'">
           {{contents[field._id]|| '无'}}
         </div>
         <div class="flex flex-1 align-items-center form-content-layout" v-if="field.type==='radio'">
           <div
             class="add-options-item"
             :class="{'act':optionsItem.id === contents[field._id]}"
             v-if="optionsItem.id === contents[field._id]"
             v-for="(optionsItem, optionsIndex) in field.options"
           >
             {{optionsItem.name}}
           </div>
           <div v-if="!contents[field._id]">无</div>
         </div>
         <div class=" form-content-layout flex flex-1 align-items-center " v-if="field.type==='select'">
           <div
             v-for="(optionsItem, optionsIndex) in field.options"
             :class="{
                'act':Object.prototype.toString.call(contents[field._id]) === '[object Array]'&&
                contents[field._id].indexOf(optionsItem.id) > -1
              }"
             v-if="Object.prototype.toString.call(contents[field._id]) === '[object Array]'&&
                contents[field._id].indexOf(optionsItem.id) > -1"
           >
             <div class=" flex align-items-center">
               <div>{{optionsItem.name}}</div>
             </div>
           </div>
           <div v-if="!contents[field._id] || !contents[field._id].length">无</div>
         </div>
       </div>
     </div>
   </div>
   <div class="add-content-box"
        :class="{'act': curContentId === 'new'}"
        @click="todoAddContent">添加内容</div>
 </div>

</template>

<script>
  export default {
    props: ['fields', 'contentList', 'curContentId'],
    methods: {
      todoAddContent() {
        this.$emit('focusContent', )
      },
      focusContent(item) {
        this.$emit('focusContent', { ...item} )
      }
    }
  }
</script>

<style lang="less" scoped>
  .content-list{
    background: #fff;
    /*box-shadow: 1px 0 1px 1px #adabab inset;*/
    font-size: 13px;
    position: relative;
    .content-list-item{
      padding: 10px;
      color: @tree-bg-color;
      border-bottom: solid 1px #adabab;
      position: relative;
      cursor: pointer;
    }
    .content-list-item.act{
      /*box-shadow: 1px 0 1px 1px #adabab inset;*/
      background: #fbfbfb;
    }
    .content-list-item:after{
      content: '';
      width: 3px;
      height: 100%;
      background: transparent;
      left: 0;
      top: 0;
      position: absolute;
      border-radius: 0 2px 2px 0;
      transition: .3s;
    }
    .content-list-item.act:after{
      background: @highlight-color;
    }
    padding-bottom: 60px;
    overflow: auto;
  }
  .add-content-box{
    height: 60px;
    line-height: 60px;
    text-align: center;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 2;
    background: #fbfbfb;
    font-size: 16px;
    color: @tree-color;
    cursor: pointer;
    transition: .3s;
    border-left: solid 3px transparent;
  }
  .add-content-box:hover{
    background: #eee;
  }
  .add-content-box.act{
    border-left: solid 3px @highlight-color;
  }
  .form-label-layout{
    width: auto;
  }
  .form-group:not(:first-child) {
    margin-top: 10px;
  }
</style>
