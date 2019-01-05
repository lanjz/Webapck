<template>
  <div class="flex-1 flex">
    <BookLayout></BookLayout>
    <articles></articles>
  </div>
</template>

<script>
  import BookLayout from './bookSlider.vue'
  import articles from './article.vue'
  export default {
    components: {
      BookLayout,
      articles
    },
    mounted() {
      this.$toast('我是弹出消息1')
    }
  }
</script>
