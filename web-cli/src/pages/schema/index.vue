<template>
  <div class="flex flex-1">
    <div class="catalogs-layout">
      <div class="flex align-items-center catalogs-item-layout">
        <div class="iconfont">
          <svg class="icon icon-close" aria-hidden="true">
            <use xlink:href="#icon-wenjian2"></use>
          </svg>
        </div>
        <div class="catalogs-name line-ellipsis">偶的看来</div>
      </div>
      <div class="flex align-items-center catalogs-item-layout act">
        <div class="iconfont">
          <svg class="icon icon-close" aria-hidden="true">
            <use xlink:href="#icon-wenjian2"></use>
          </svg>
        </div>
        <div class="catalogs-name line-ellipsis">偶的看来</div>
      </div>
    </div>
    <div class="flex flex-1 direction-column">
      <div class="schema-title flex justify-content-space-between">
        <div>测试测试测试</div>
        <div class="schema-operate">
          <span class="btn">编辑</span>
          <span class="btn warn">删除</span>
        </div>
      </div>
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
  .catalogs-layout{
    width: 200px;
    border-right: solid 1px @border-color;
  }
  .catalogs-item-layout{
    padding: 5px 20px;
  }
  .iconfont{
    font-size: 25px;
    margin-right: 2px;
    position: relative;
  }
  .catalogs-item-layout.act{
    background: @bg-second-color;
    color: #fff;
  }
  .schema-operate{
    font-size: 15px;
  }
</style>
