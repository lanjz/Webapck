<template>
  <div>
    <TreeItem
      v-for="(item, index) in catalogList"
      :key="item._id"
      :curNode="item"
      :treeChain="[item['_id']]"
    ></TreeItem>
  </div>
</template>
<script>
  import TreeItem from './TreeItem'
  export default {
    name: 'Tree',
    components: {
      TreeItem
    },
    data() {
      return {
        catalogList: [
          {  name: '最近文档', hasChild: false, icon: 'icon-wendang' },
          { _id: 'root', name: '我的文件夹', hasChild: true, icon: 'icon-wenjianjia' },
        ]
      }
    },
  }
</script>
<style lang="less" scoped>

</style>
