<template>
    <h1 @click="clearStorage()">Home</h1>
    <p @click="this.$router.push({path:'/sort', query: {setIds: JSON.stringify(['Cool line'])}})">Sort</p>
    <p>{{ glyphSetList }}</p>
    <file-input class="fileInput"/>
</template>



<script>
    export default {
        data() {
            return {
                glyphSetList: [],
            }
        },

        methods: {
            clearStorage() {
                console.log("clearing storage");

                localStorage.clear();
                sessionStorage.clear();
            },
        },

        mounted() {
            this.glyphSetList = localStorage.getItem("glyphSetList") ? JSON.parse(localStorage.getItem("glyphSetList")) : [];
        }
    }
</script>



<style scoped>
    .fileInput {
        margin: 2% auto;
    }
</style>