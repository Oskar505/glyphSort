<template>
    <div>
        <!-- <h1>{{ value }}</h1> -->
        <img :src="value" alt="glyph">
    </div>
</template>


<script>
    export default {
        data() {
            return {
                decodedImg: ''
            }
        },


        props: {
            value: {
                type: String,
                required: true
            }
        },

        // watch: {
        //     value(newValue) {
        //         this.decodedImg = atob(newValue)
        //         console.log(this.decodedImg)
        //     }
        // },

        methods: {
            test() {
                console.log(atob(this.value))
            }
        }
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

    div img {
        width: 1in;
        height: 1in;
    }


    h1 {
        font-size: 40px;
    }
</style>