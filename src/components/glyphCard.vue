<template>
    <div>
        <h1>{{ value }}</h1>
    </div>
</template>


<script>
    export default {
        data() {
            return {

            }
        },


        props: {
            value: {
                type: String,
                required: true
            }
        },
    }
</script>


<style scoped>
    div {
        width: 1in;
        height: 1in;
        border: 2px solid black;
        display: flex;
        justify-content: center;
        align-items: center;
    }


    h1 {
        font-size: 40px;
    }
</style>