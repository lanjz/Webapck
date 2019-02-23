<template>
  <div class="flex flex-1">
    <div class="catalogs-layout">
      <div
        class="flex align-items-center catalogs-item-layout add-catalogs-layout"
        @click="todoAddSchema"
      >
        <i class="iconfont icon-tianjiajiahaowubiankuang"></i>
        <div class="catalogs-name line-ellipsis">新字段组</div>
      </div>
      <div
        v-if="showAddInput"
        class="flex align-items-center catalogs-item-layout">
        <input
          v-model.trim="newSchemaName"
          class="edit-catalogs-input line-ellipsis"
          @blur="toAddSchema"
          v-focus:select

        />
      </div>
      <div
        class="flex align-items-center catalogs-item-layout"
        v-for="(item, index) in schemaListArr"
        :class="{'act': actSchema === item._id}"
        @click="chooseSchema(item)"
      >
        <div class="iconfont">
          <i class="iconfont icon-ziduan"></i>
        </div>
        <div class="catalogs-name line-ellipsis">{{item.name}}</div>
      </div>
    </div>
    <div class="flex flex-1 direction-column">
      <div class="schema-title flex justify-content-space-between">
        <div class="flex-1 schema-title-layout relative">
          <input class="full-input" v-model="cacheName" @blur="todoSchemaRename"/>
        </div>
        <div class="schema-operate" v-if="actSchema">
          <span class="btn" v-if="!curField" @click="doShowEdit(null)">添加</span>
          <span class="btn warn" @click="todoDelete">删除</span>
        </div>
      </div>
      <div class="schema-content flex-1 flex">
        <div class="panel-bg flex-1 flex" v-if="!curField">
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
                  <span class="table-btn warn" @click="todoDeleteField(item)">删除</span>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <div class="panel-bg flex flex-1" v-if="curField">
          <EditField
            :curField="curField"
            :curSchemataInfo="actSchemaObj"
            @emitCloseEdit="doHideEdit"
          ></EditField>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
  import { mapState, mapGetter, mapMutations, mapActions } from 'vuex'
  import * as MUTATIONS from '../../store/const/mutaions'
  import * as ACTIONS from '../../store/const/actions'
  import EditField from './editSchema'
  export default {
    components: {
      EditField
    },
    data() {
      return {
        actSchema: '',
        curField: null,
        cacheName: '',
        showAddInput: false,
        newSchemaName: ''
      }
    },
    computed: {
      ...mapState({
        schemaList: state => state.schema.list
      }),
      schemaListArr: function () {
        return Object.values(this.schemaList).filter(item => item._id !== 'markdown')
      },
      actSchemaObj: function () {
        return this.schemaList[this.actSchema] || {}
      }
    },
    methods: {
      ...mapActions([
        ACTIONS.SCHEMA_LIST_GET,
        ACTIONS.SCHEMA_PUT,
        ACTIONS.SCHEMA_POST,
        ACTIONS.SCHEMA_DELETE,
        ACTIONS.SCHEMA_FIELD_DELETE
      ]),
      todoAddSchema() {
        let tempName = ''
        let i = 0
        do{
          ++i
          tempName = '未命名' + i
        } while ((this.schemaListArr.find(item => item.name === tempName)))
        this.newSchemaName = tempName
        this.showAddInput = true
      },
      async toAddSchema() {
        const isReatName = this.schemaListArr.find(item => item.name === this.newSchemaName)
        if(isReatName){
          this.$alert({
            title: `${this.newSchemaName}不存在`
          })
          return
        }
        this.$showLoading()
        const result = await this[ACTIONS.SCHEMA_POST](
          {
            name: this.newSchemaName
          }
        )
        this.showAddInput = false
        this.newSchemaName = ''
        await this.getData()
        this.initCurSchema()
        this.$hideLoading()
      },
      initCurSchema() {
        if(this.schemaListArr.length) {
          this.actSchema = this.schemaListArr[0]._id
          this.cacheName = this.schemaListArr[0].name
        }
      },
      async getData(force = true){
        const result = await this[ACTIONS.SCHEMA_LIST_GET]({ force })
      },
      /**
       * tar有值则为编辑，否则是添加
       * */
      doShowEdit(tar) {
        this.curField = JSON.parse(JSON.stringify(tar)) || {}
      },
      doHideEdit(force) {
        console.log('force', force)
        this.curField = null
        this.getData(force)
      },
      chooseSchema(item) {
        this.actSchema = item._id
        this.cacheName = item.name
      },
      async todoSchemaRename() {
        if(!this.cacheName) {
          this.cacheName = this.actSchemaObj.name
          return
        }
        if(this.actSchemaObj.name === this.cacheName) return
        let isRepeatName = false
        this.schemaListArr.some((item, index) => {
          if(item._id !== this.actSchemaObj._id && item.name === this.cacheName) {
            alert(`${this.cacheName}已存在`)
            isRepeatName = true
            return true
          }
          return false
        })
        if(isRepeatName) {
          this.cacheName = this.actSchemaObj.name
          return
        }
        this.$showLoading()
        const result = await this[ACTIONS.SCHEMA_PUT]({
          _id: this.actSchemaObj._id,
          name: this.cacheName
        })
        if(result.err) return
        await this.getData()
        this.$hideLoading()
      },
      async init(){
        this.$showLoading()
        await this.getData(false)
        this.initCurSchema()
        this.$hideLoading()
      },
      todoDelete() {
        this.$alert({
          title: '弹窗测试',
          content: `你确认要删除"${this.cacheName}"`,
        })
          .then(async res => {
            if(res) {
              this.doDeleteSchema()
            }
          })
      },
      async doDeleteSchema() {
        this.$showLoading()
        const result = await this[ACTIONS.SCHEMA_DELETE]({ _id: this.actSchemaObj._id })
        if(!result.err) {
          await this.getData(true)
          this.initCurSchema()
        }
        this.$hideLoading()
      },
      todoDeleteField(item) {
        this.$alert({
          title: '弹窗测试',
          content: '你确认要删除此字段',
          showCancel: false
        })
          .then(res => {
            if(res) {
              this.doDeleteField(item)
            }
          })
      },
      async doDeleteField(item) {
        this.$showLoading()
        const result = this[ACTIONS.SCHEMA_FIELD_DELETE]({
          schemataId: this.actSchemaObj._id,
          fieldId: item._id
        })
        if(!result.err) {
          await this.getData(true)
        }
        this.$hideLoading()
      }
    },
    mounted() {
      this.init()
    }
  }
</script>
<style lang="less" scoped>

  .schema-title {
    border-bottom: solid 1px @border-color;
    padding: 15px;
    font-size: 18px;
  }

  .schema-content {
    padding: 15px;
    background: @bg-panel-color;
  }

  .catalogs-layout{
    width: 200px;
    border-right: solid 1px @border-color;
  }
  .catalogs-item-layout{
    padding: 10px 20px;
    cursor: pointer;
    font-size: 14px;
    position: relative;
    .iconfont{
      margin-right: 2px;
      font-size: 22px;
    }
  }
  .catalogs-item-layout.act{
    background: @bg-panel-color;
    .iconfont{
      color:  @highlight-color;
    }
  }
  .catalogs-item-layout.act:after{
    content: '';
   /* background: @bg-second-color;
    color: #fff;*/
    background: @highlight-color;
    position: absolute;
    height: 100%;
    width: 4px;
    right: 0;
    top: 0;
  }
  .schema-operate{
    font-size: 15px;
  }
  .schema-title-layout{
    padding: 0 10px;
  }
  .add-catalogs-layout{
    border-bottom: solid 5px @bg-panel-color;
    padding: 16px 20px;
    .iconfont{
      margin-right: 2px;
      font-size: 25px;
      color: #398dee;
    }
  }
</style>
