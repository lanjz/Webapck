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
        <EditSchema></EditSchema>
      </div>
    </div>
  </div>
</template>
<script>
  import EditSchema from './editSchema'
  export default {
    components: {
      EditSchema
    },
    data() {
      return {
      }
    },
    methods: {

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
</style>
