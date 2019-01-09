<template>
  <div
    class="flex align-items-center catalogs-item-layout"
    @click.left="chooseCatalog(item, index)"
    @click.right.stop.prevent="(e) => showOperateMenu(e, item, index)"
    :class="{'act': curCatalog['_id'] === item['_id']}"
    v-click-outside="closeMenu"
  >
    <div class="iconfont">
      <svg class="icon icon-close" aria-hidden="true">
        <use xlink:href="#icon-wenjian2"></use>
      </svg>
      <svg class="icon  icon-open" aria-hidden="true">
        <use xlink:href="#icon-wenjian-"></use>
      </svg>
    </div>
    <div v-if="!renameCatalog" class="catalogs-name line-ellipsis">{{item.name}}</div>
    <input :value="item.name"
           class="edit-catalogs-input line-ellipsis"
           @focus="e => focusEditCatalog(e)"
           autofocus="true"
           @blur="renameCatalog=false"
           v-else />
    <div class="catalog-operate-layout" :style="operateMenuStyle" v-if="operateMenuStyle.left !== -1">
      <div class="catalog-operate-item">新建</div>
      <div class="catalog-operate-item">删除</div>
      <div class="catalog-operate-item" @click="rename">重命名</div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'TreeItem',
    props: {
      curCatalog: {
        type: Object,
        default: function () {
          return {}
        }
      },
      item: {
        type: Object,
        require: true
      },
      index: {
        type: Number,
        require: true
      },
    },
    data() {
      return {
        renameCatalog: false,
        operateMenuStyle: { left: -1, top: '50%'}
      }
    },
    methods: {
      chooseCatalog(data, index) {
        this.$emit('emitChooseCatalog', data, index)
      },
      showOperateMenu(e) {
        const { clientX, clientY } = e
        this.operateMenuStyle = {
          top: `${clientY}px`,
          left: `${clientX}px`
        }
      },
      closeMenu() {
        this.operateMenuStyle.left = -1
      },
      rename() {
        this.closeMenu()
        this.renameCatalog = true
      },
      focusEditCatalog(e) {
        console.log(e)
        e.currentTarget.select();
      }
    },
    mounted() {
      document.addEventListener('click', (e) => {
        !this.$el.contains(e.target)
      })
    }
  }
</script>
<style lang="less" scoped>
  .iconfont{
    font-size: 25px;
    margin-right: 5px;
    position: relative;
    z-index: 1;
  }
  .catalogs-item-layout{
    cursor:pointer;
    padding: 7px 25px;
    position: relative;
    transition: .3s;
    .icon-open{
      display: none;
    }
    .icon-close{
      display: block;
    }
  }
  .catalogs-item-layout:after{
    content: '';
    background: transparent;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    left: -100%;
    transition: .3s;
  }
  .catalogs-item-layout:hover{
    background: @border-color
  }
  .catalogs-item-layout:hover:after{
    background: @border-color;
  }
  .catalogs-item-layout.act{
    background: @bg-second-color;
    color: #fff;
    .icon-open{
      display: block;
    }
    .icon-close{
      display: none;
    }
  }
  .catalogs-item-layout.act:hover{
    background: @bg-second-color;
  }
  .catalogs-item-layout.act:hover:after{
    background: @bg-second-color;
  }
  .catalogs-item-layout.act:after{
    background: @bg-second-color;
  }
  .catalogs-name{
    position: relative;
    z-index: 1;
    max-width: 150px;
  }
  .edit-catalogs-input{
    position: relative;
    z-index: 1;
    max-width: 150px;
    background: transparent;
    vertical-align: bottom;
    border: none;
    color: inherit;
    font-size: inherit;
    height: 28px;
    padding: 0 10px;
  }
  // 右键类型菜单
  .catalog-operate-layout{
    position: fixed;
    background: rgba(0,0,0,0.8);
    left: 50%;
    top: 50%;
    color: #fff;
    z-index: 999;
    border-radius: 5px;
    overflow: hidden;
    .catalog-operate-item{
      width: 150px;
      padding: 10px 20px;
    }
    .catalog-operate-item:not(:last-child){
      border-bottom: solid 1px @border-color;
    }
  }

</style>
