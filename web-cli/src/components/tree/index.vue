<template>
  <div>
    <TreeItem
      v-for="(item, index) in catalogs['root']"
      :key="index"
      :curNode="item"
      :treeChain="[item['_id']]"
    ></TreeItem>
  </div>
</template>
<script>
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
  import * as MUTATIONS from '../../store/const/mutaions'
  import * as ACTIONS from '../../store/const/actions'
  import TreeItem from './TreeItem'
  export default {
    name: 'Tree',
    components: {
      TreeItem
    },
    data() {
      return {
        operateMenuStyle: { left: -1, top: '50%'},
      }
    },
    computed: {
      ...mapState({
        catalogs: state => state.catalogs.list
      })
    },
    watch: {
      catalogs: function () {
        console.log('catalogs', this.catalogs)
      }
    },
    methods: {
      ...mapActions([
        ACTIONS.CATALOGS_GET
      ]),
      async getDate(){
        await this[ACTIONS.CATALOGS_GET]({ parentId: 'root' })
      },
      async init() {
        this.$showLoading()
        await this.getDate()
        this.$hideLoading()
      },
    },
    mounted() {
      this.init()
    }
  }
</script>
<style lang="less" scoped>

</style>
