<template>
    <header>
        <h1 @click="clearStorage()">Results</h1>
    </header>



    <main>
        <div class="resultBox stats">
            <h2>Statistics</h2>

            <div class="infoBox" title="Number of sorted glyphs">
                <p class="data">{{ sortedCount }}</p>
                <p class="label">Count</p>
            </div>
            
            <div class="infoBox" title="Average time to sort a pair of glyphs">
                <p class="data">{{ sortTime }}&nbsp;s</p>
                <p class="label">Time</p>
            </div>

            <div class="infoBox" title="Success rate">
                <p class="data">{{ successRate }}&nbsp;%</p>
                <p class="label">Success</p>
            </div>

            <div class="infoBox" title="Difference between glyph values (0 - 100)">
                <p class="data">{{ Math.round(parseFloat(distance) / parseFloat(glyphStepsCount) * 100) }}</p>
                <p class="label">Difference</p>
            </div>
        </div>

        
        <div class="resultBox graphs">
            <h2>Graphs</h2>
        </div>
    </main>
</template>


<script>
    export default {
        data() {
            return {
                successRate: null,
                sortedCount: null,
                sortTime: null,
                sessionTime: null,
                distance: null,
                glyphStepsCount: null,
            }
        },



        mounted() {
            this.successRate = this.$route.query.successRate
            this.sortedCount = this.$route.query.sortedCount
            this.sortTime = this.$route.query.sortTime
            this.sessionTime = this.$route.query.sessionTime
            this.distance = this.$route.query.distance
            this.glyphStepsCount = this.$route.query.glyphStepsCount

            console.log(this.successRate, this.sortedCount, this.sortTime, this.sessionTime, this.distance, this.glyphStepsCount)
            console.log(Math.round(parseFloat(this.distance) / parseFloat(this.glyphStepsCount) * 100))
        },


        methods: {

        }
    }
</script>



<style scoped>
    main {
        width: 1000px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 100px;
        flex-wrap: wrap;
    }


    .resultBox {
        border-radius: 15px;
        background-color: #fcfcfc;
        box-shadow: 0px 0px 15px #dedede;
        border: 3px solid #999;
        padding: 20px 30px;
    }


    .infoBox {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 4px;
        flex: 1;
        border: 2px solid #444;
        border-radius: 15px;
        padding: 10px;
        cursor: help;
        background-color: #fcfcfc;
    }

    .infoBox .data {
        font-size: 30px;
        color: #444;
        font-weight: 500;
    }

    .infoBox .label {
        font-size: 20px;
        color: #666;
    }
</style>