<template>
    <header>
        <h1 @click="clearStorage()">Results</h1>
    </header>



    <main>
        <div class="resultBox stats" v-for="glyphSet in glyphSets" :key="glyphSet.id">
            <h2>{{ glyphSet.id }}</h2>

            <div class="statsWrapper">
                <div class="infoBox" title="Number of sorted glyphs">
                    <p class="data">{{ glyphSet.sortedCount }}</p>
                    <p class="label">Count</p>
                </div>
                
                <div class="infoBox" title="Average time to sort a pair of glyphs">
                    <p class="data">{{ glyphSet.sortTime }}s</p>
                    <p class="label">Time</p>
                </div>

                <div class="infoBox" title="Success rate">
                    <p class="data">{{ glyphSet.successRate }}%</p>
                    <p class="label">Success</p>
                </div>

                <div class="infoBox" title="Smallest difference between glyph values (0 - 100)">
                    <p class="data">{{ Math.round(glyphSet.smallestDistance / parseFloat(glyphSet.glyphStepsCount) * 100) }}</p>
                    <p class="label">Difference</p>
                </div>

            </div>
            

            <h3>Charts</h3>

            <div class="chartsWrapper">
                <line-chart :datasets="this.chartDatasets" :labels="this.chartLabels"></line-chart>
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
                chartDatasets: [],
                chartLabels: [],

                successRate: null,
                sortedCount: null,
                sortTime: null,
                sessionTime: null,
                distance: null,
                glyphStepsCount: null,
            }
        },



        mounted() {
            // chart line colors
            let lineColors = [
                'rgba(54, 162, 235, 1)', // Modrá
                'rgba(255, 99, 132, 1)', // Červená
                'rgba(75, 192, 192, 1)', // Zelená
                'rgba(255, 159, 64, 1)', // Oranžová
                'rgba(153, 102, 255, 1)', // Fialová
                'rgba(63, 191, 191, 1)', // Tyrkysová
                'rgba(255, 0, 0, 1)', // Tmavě červená
                'rgba(255, 255, 0, 1)', // Žlutá
                'rgba(255, 105, 180, 1)', // Růžová
                'rgba(25, 25, 112, 1)'  // Tmavě modrá
            ];

            let labelCount = 0



            // re-init glyph sets and get stats
            JSON.parse(this.$route.query.glyphSetIds).forEach(glyphSetId => {
                let newGlyphSet = new GlyphSet(glyphSetId)
                newGlyphSet.getStats()
                this.glyphSets.push(newGlyphSet)


                // chart data
                let diffsAndErrs = newGlyphSet.getChartData()
                let chartDataset = {
                    label: glyphSetId,
                    data: Object.values(diffsAndErrs),
                    borderColor: lineColors[0],
                    backgroundColor: lineColors[0],
                    tension: 0.4
                }

                this.chartDatasets.push(chartDataset)
                lineColors.shift()


                if (Object.keys(diffsAndErrs).length > this.chartLabels.length) {
                    this.chartLabels = Object.keys(diffsAndErrs)
                    // this.chartLabels = this.chartLabels.map(label => label / 10)

                    console.log(this.chartLabels)
                }

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