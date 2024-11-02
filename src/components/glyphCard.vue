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
                type: Number,
                required: true
            }
        },
    }
</script>


<style scoped>
    div {
        width: 1in;
        height: 1in;
        border: 3px solid black;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: white;
    }


    h1 {
        font-size: 40px;
    }
</style>