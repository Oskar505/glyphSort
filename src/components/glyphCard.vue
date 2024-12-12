<template>
    <div>
        <img :src="value" alt="glyph" :style="{ width: glyphWidth + 'px', height: glyphWidth + 'px', transform: 'rotate(' + rotationValue + 'deg)' }">
    </div>
</template>


<script>
    export default {
        data() {
            return {
                decodedImg: '',
                glyphWidth: 96,
            }
        },

        mounted() {
            const dpi = this.$getCookie('dpi')
            // const dpi = dpiCookie ? dpiCookie : 1

            console.log(dpi)

            if (dpi) {
                this.glyphWidth = dpi
            }
        },


        props: {
            value: {
                type: String,
                required: true
            },

            rotationValue: {
                type: Number,
                default: 0

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
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: white;
    }

    div img {
        width: 1in;
        height: 1in;
        border: 3px solid black;
    }


    h1 {
        font-size: 40px;
    }
</style>