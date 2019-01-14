<template>
  <div class="flex">
    <div class="">
      <div>自定义字段</div>
    </div>
    <div class="flex flex-1 direction-column">
      <div class="schema-content">
        <table class="table-layout">
          <thead>
          <tr>
            <th><div class="th-p">别名</div></th>
            <th><div class="th-p">类型</div></th>
            <th><div class="th-p">默认值</div></th>
            <th><div class="th-p">选项</div></th>
            <th><div class="th-p"></div></th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td><div class="td-p">别名</div></td>
            <td><div class="td-p">类型</div></td>
            <td><div class="td-p">默认值</div></td>
            <td><div class="td-p">选项</div></td>
            <td><div class="td-p"><span>编辑</span><span>删除</span></div></td>
          </tr>
          </tbody>
        </table>
        <!--<EditSchema></EditSchema>-->
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
