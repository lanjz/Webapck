<template>
  <div class="flex-1 flex">
    <BookLayout></BookLayout>
    <!--<articles></articles> -->
    <schema></schema>
  </div>
</template>

<script>
  import BookLayout from './bookSlider.vue'
  import articles from './article.vue'
  import schema from '../schema.vue'
  export default {
    components: {
      BookLayout,
      articles,
      schema
    },
    mounted() {
      this.$toast('我是弹出消息1')
    }
  }
</script>
