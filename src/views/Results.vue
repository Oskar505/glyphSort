<template>
    <header>
        <h1 @click="clearStorage()">Sort</h1>

        <nav>
            <div @click="this.$router.push({path:'/'})"><h2>Home</h2></div>
            <div @click="this.$router.push({path:'/sort', query: {glyphSetIds: this.$route.query.glyphSetIds}})"><h2>Sort</h2></div>
            <div @click="this.$router.push({path:'/results', query: {glyphSetIds: this.$route.query.glyphSetIds}})"><h2 class="navActive">Results</h2></div>
            <div @click="this.$router.push({path:'/calibration'})" class="secondaryNavBtn"><svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#666"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg></div>
        </nav>
    </header>



    <main>
        <section v-show="glyphSets.length > 0">
            <div class="resultBox stats" v-for="glyphSet in glyphSets" :key="glyphSet.id">
                <h2 class="setHeader">{{ glyphSet.id }}</h2>

                <glyph-set-info style="max-width: 500px;" :glyphSet="glyphSet" :live="false" v-if="glyphSet"/>
                

                <h3>Charts</h3>

                <div class="chartsWrapper">
                    <line-chart :datasets="this.charts[0].datasets" :labels="this.charts[0].labels" :average="glyphSet.successRate"></line-chart>

                    <bar-chart :datasets="this.charts[1].datasets" :labels="this.charts[1].labels" :average="glyphSet.successRate"></bar-chart>
                </div>
            </div>
        </section>
        


        <section class="middlePageWarning" v-if="glyphSets.length == 0">
            <h1>No set selected</h1>
            <h2>Select set on the <a href="/">home page</a></h2>
        </section>
    </main>
</template>


<script>
    import GlyphSet from '../GlyphSetClass.js'



    export default {
        data() {
            return {
                glyphSets: [],
                charts: [],
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
            let lineColors1 = [
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

            let lineColors2 = [...lineColors1]


            // re-init glyph sets and get stats
            let chartDatasets2 = []
            let chartLabels2 = []

            JSON.parse(this.$route.query.glyphSetIds).forEach(glyphSetId => {
                let newGlyphSet = new GlyphSet(glyphSetId)
                newGlyphSet.getStats()
                this.glyphSets.push(newGlyphSet)


                // chart data
                this.chartDatasets = []
                this.chartLabels = []

                let chartData = newGlyphSet.getChartData()

                chartData[0] = chartData[0].reverse()
                let x = chartData[0].map(obj => obj.x)
                let y = chartData[0].map(obj => obj.y)


                let chartDataset = {
                    label: glyphSetId,
                    data: y,
                    borderColor: lineColors1[0],
                    backgroundColor: lineColors1[0],
                    tension: 0.4
                }

                this.chartDatasets.push(chartDataset)
                lineColors1.shift()


                if (x.length > this.chartLabels.length) {
                    this.chartLabels = x
                    // this.chartLabels = this.chartLabels.map(label => label / 10)

                    console.log(this.chartLabels)
                }



                // Acc and val chart
                x = chartData[1].map(obj => obj.x)
                y = chartData[1].map(obj => obj.y)


                chartDataset = {
                    label: glyphSetId,
                    data: y,
                    borderColor: lineColors2[0],
                    backgroundColor: lineColors2[0],
                    tension: 0.4
                }

                
                chartDatasets2.push(chartDataset)
                lineColors2.shift()


                if (x.length > chartLabels2.length) {
                    chartLabels2 = x
                    // this.chartLabels = this.chartLabels.map(label => label / 10)

                    console.log(chartLabels2)
                }


                

            })



            this.charts.push({'datasets': this.chartDatasets, 'labels': this.chartLabels})
            this.charts.push({'datasets': chartDatasets2, 'labels': chartLabels2})

            console.log(this.charts)


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

    .setHeader {
        font-size: 35px;
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