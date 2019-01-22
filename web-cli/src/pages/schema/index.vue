<template>
  <div class="flex flex-1">
    <div class="catalogs-layout">
      <div
        class="flex align-items-center catalogs-item-layout"
        v-for="(item, index) in schemaListArr"
        :class="{'act': actSchema === item._id}"
      >
        <div class="iconfont">
          <svg class="icon icon-close" aria-hidden="true">
            <use xlink:href="#icon-wenjian2"></use>
          </svg>
        </div>
        <div class="catalogs-name line-ellipsis">{{item.name}}</div>
      </div>
    </div>
    <div class="flex flex-1 direction-column">
      <div class="schema-title flex justify-content-space-between">
        <div>{{actSchemaObj.name}}</div>
        <div class="schema-operate" v-if="actSchema">
          <span class="btn" v-if="!curSchema" @click="doShowEdit(null)">添加</span>
          <span class="btn warn">删除</span>
        </div>
      </div>
      <div class="schema-content flex-1 flex">
        <div class="panel-bg flex-1 flex" v-if="!curSchema">
          <table class="table-layout" v-if="actSchemaObj.fields">
            <thead>
            <tr>
              <th><div class="th-p">别名</div></th>
              <th><div class="th-p">类型</div></th>
              <th><div class="th-p">默认值</div></th>
              <th><div class="th-p">选项</div></th>
              <th style="width: 150px"><div class="th-p"></div></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in actSchemaObj.fields">
              <td><div class="td-p">{{item.name}}</div></td>
              <td><div class="td-p">{{item.type}}</div></td>
              <td><div class="td-p">{{item.default || '-'}}</div></td>
              <td>
                <div class="td-p" v-if="item.options&&item.options.length">
                  <span
                    class="option-label"
                    v-for="(optionsItem, index) in item.options"
                  >
                    {{optionsItem.name}}
                  </span>
                </div>
                <div class="td-p" v-else>-</div>
              </td>
              <td>
                <div class="td-p">
                  <span class="table-btn" @click="doShowEdit(item)">编辑</span>
                  <span class="table-btn warn">删除</span>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <div class="panel-bg flex flex-1" v-if="curSchema">
          <EditSchema
            :curSchema="curSchema"
            @emitCloseEdit="doHideEdit"
          ></EditSchema>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
  import { mapState, mapGetter, mapMutations, mapActions } from 'vuex'
  import * as MUTATIONS from '../../store/const/mutaions'
  import * as ACTIONS from '../../store/const/actions'
  import EditSchema from './editSchema'
  export default {
    components: {
      EditSchema
    },
    data() {
      return {
        actSchema: '',
        curSchema: null
      }
    },
    computed: {
      ...mapState({
        schemaList: state => state.schema.list
      }),
      schemaListArr: function () {
        return [ ...this.schemaList.values() ]
      },
      actSchemaObj: function () {
        return this.schemaList.get(this.actSchema) || {}
      }
    },
    methods: {
      ...mapActions([
        ACTIONS.SCHEMA_LIST_GET
      ]),
      async getData(){
        const result = await this[ACTIONS.SCHEMA_LIST_GET]()
        if(!result.err) {

        }
        if(result.data.list.length) {
          this.actSchema = result.data.list[0]._id
        }
      },
      /**
       * tar有值则为编辑，否则是添加
       * */
      doShowEdit(tar) {
        console.log('tart', tar)
        this.curSchema = tar || {}
      },
      doHideEdit() {
        this.curSchema = null
      },
      init(){
        this.getData()
      }
    },
    mounted() {
      this.init()
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
    background: @bg-panel-color;
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
