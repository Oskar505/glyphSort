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


        methods: {
            
        }
    }
</script>


<style scoped>
    div {
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