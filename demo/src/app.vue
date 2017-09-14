
<template>
    <div id="example">
        <h1 class="hello">DEMO</h1>
        <h1>{{ msg }}</h1>
        <ul>
            <li v-for="n in 5">{{ n }}</li>
        </ul>
        <h1>{{this.$onePageLine}}</h1>
        <h1 @click="getIP()">IP：{{this.$dataIp2}}</h1>

    </div>
</template>

<script>
    export default {
        data () {
            return {
                msg: 'Hello Wo3rld!'
            }
        }
    }
</script>

<style scoped>
    @import "app.css";
    #example {
        background: red;
        height: 100vh;
    }
    h1{
        border: solid 1px #000;
    }
</style>