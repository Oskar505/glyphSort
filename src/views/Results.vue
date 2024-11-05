<template>
    <header>
        <h1 @click="clearStorage()">Results</h1>
    </header>



    <main>
        <div class="resultBox stats" v-for="glyphSet in glyphSets" :key="glyphSet.id">
            <h2>{{ glyphSet.id }}</h2>


            <h3>Stats</h3>

            <div class="statsWrapper">
                <div class="infoBox" title="Number of sorted glyphs">
                    <p class="data">{{ glyphSet.sortedCount }}</p>
                    <p class="label">Count</p>
                </div>
                
                <div class="infoBox" title="Average time to sort a pair of glyphs">
                    <p class="data">{{ glyphSet.sortTime }}&nbsp;s</p>
                    <p class="label">Time</p>
                </div>

                <div class="infoBox" title="Success rate">
                    <p class="data">{{ glyphSet.successRate }}&nbsp;%</p>
                    <p class="label">Success</p>
                </div>

                <div class="infoBox" title="Smallest difference between glyph values (0 - 100)">
                    <p class="data">{{ Math.round(glyphSet.smallestDistance / parseFloat(glyphSet.glyphStepsCount) * 100) }}</p>
                    <p class="label">Difference</p>
                </div>

            </div>
            

            <h3>Graphs</h3>

            <div class="graphsWrapper">

            </div>
        </div>
    </main>
</template>


<script>
    import GlyphSet from '../GlyphSetClass.js'



    export default {
        data() {
            return {
                glyphSets: [],

                successRate: null,
                sortedCount: null,
                sortTime: null,
                sessionTime: null,
                distance: null,
                glyphStepsCount: null,
            }
        },



        mounted() {
            // re-init glyph sets and get stats
            JSON.parse(this.$route.query.glyphSetIds).forEach(glyphSetId => {
                let newGlyphSet = new GlyphSet(glyphSetId)
                newGlyphSet.getStats()
                this.glyphSets.push(newGlyphSet)
            })


            // this.successRate = this.$route.query.successRate
            // this.sortedCount = this.$route.query.sortedCount
            // this.sortTime = this.$route.query.sortTime
            // this.sessionTime = this.$route.query.sessionTime
            // this.distance = this.$route.query.distance
            // this.glyphStepsCount = this.$route.query.glyphStepsCount
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

    h2 {
        font-size: 30px;
        color: #444;
        margin: -10px 0 5px -10px;
        font-weight: 800;
    }

    h3 {
        font-size: 29px;
        color: #444;
        margin-top: 10px;
        font-weight: 700;
    }


    .resultBox {
        border-radius: 15px;
        background-color: #fcfcfc;
        box-shadow: 0px 0px 15px #dedede;
        border: 3px solid #999;
        padding: 25px 30px;
        width: 1000px;
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin-top: 6%;
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


    .statsWrapper {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 10px;
        width: 500px;
    }

    .statsWrapper div {
        flex: 1;
    }
</style>