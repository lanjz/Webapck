<template>
  <div class="flex flex-1">
    <bookShelveNav></bookShelveNav>
    <div class="flex-1">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
  import bookShelveNav from './coms/bookShelveNav.vue'
  export default {
    components: {
      bookShelveNav
    }
  }
</script>
