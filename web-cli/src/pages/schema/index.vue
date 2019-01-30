<template>
  <div class="flex flex-1">
    <div class="catalogs-layout">
      <div
        class="flex align-items-center catalogs-item-layout"
        @click="todoAddSchema"
      >
        <div class="iconfont">
          <svg class="icon icon-close" aria-hidden="true">
            <use xlink:href="#icon-wenjian2"></use>
          </svg>
        </div>
        <div class="catalogs-name line-ellipsis">+add</div>
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
          <svg class="icon icon-close" aria-hidden="true">
            <use xlink:href="#icon-wenjian2"></use>
          </svg>
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
            :curSchemataId="actSchemaObj"
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
        return Object.values(this.schemaList)
      },
      actSchemaObj: function () {
        console.log('this.schemaList', this.schemaList)
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
        let tempName = '未命名'
        let i = 1
        do{
          tempName += i
        } while ((this.schemaListArr.find(item => item.name === tempName)))
        this.newSchemaName = tempName
        this.showAddInput = true
      },
      async toAddSchema() {
        const isReatName = this.schemaListArr.find(item => item.name === this.newSchemaName)
        if(isReatName){
          alert(`${this.newSchemaName}不存在`)
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
        this.$hideLoading()

      },
      async getData(){
        const result = await this[ACTIONS.SCHEMA_LIST_GET]()
        if(!result.err) {

        }
        if(result.data.list.length) {
          this.actSchema = result.data.list[0]._id
          this.cacheName = result.data.list[0].name
        }
      },
      /**
       * tar有值则为编辑，否则是添加
       * */
      doShowEdit(tar) {
        console.log('tart', tar)
        this.curField = tar || {}
      },
      doHideEdit() {
        this.curField = null
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
        const result = await this[ACTIONS.SCHEMA_PUT]({
          _id: this.actSchemaObj._id,
          name: this.cacheName
        })
        if(result.err) return
        this.getData()
      },
      async init(){
        this.$showLoading()
        await this.getData()
        this.$hideLoading()
      },
      todoDelete() {
        this.$alert({
          title: '弹窗测试',
          content: `你确认要删除"${this.cacheName}"`,
          showCancel: false
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
          await this.getData()
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
          fieldId: this.actSchemaObj._id,
          schemataId: item._id
        })
        if(!result.err) {
          await this.getData()
        }
        this.$hideLoading()
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
    cursor: pointer;
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
  .schema-title-layout{
    padding: 0 10px;
  }
</style>
