<template>
  <div v-for="(contents, index) in contentList" v-if="contentList && contentList.length">
    <div class="form-layout theme-1" v-if="fields&&fields.length">
      <div class="form-group flex direction-column" v-for="(field, index) in fields" :index="index">
        <div class="form-label-layout">
          {{field.name}}：
        </div>
        <div class="flex flex-1 align-items-center form-content-layout markdown-layout" v-if="field.type==='markdown'">
          {{contents[field._id]}}
        </div>
        <div class="flex flex-1 align-items-center form-content-layout" v-if="field.type==='input'">
          {{contents[field._id]}}
        </div>
        <div class="flex flex-1 align-items-center form-content-layout" v-if="field.type==='textarea'">
          {{contents[field._id]}}
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

</template>

<script>
  export default {
    props: ['fields', 'contentList']
  }
</script>
