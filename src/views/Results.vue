<template>
    <header>
        <h1 @click="clearStorage()">Results</h1>

        <nav>
            <div @click="this.$router.push({path:'/', query: {glyphSetIds: this.$route.query.glyphSetIds}})"><h2>Home</h2></div>
            <div @click="this.$router.push({path:'/sort', query: {glyphSetIds: this.$route.query.glyphSetIds}})"><h2>Sort</h2></div>
            <div @click="this.$router.push({path:'/results', query: {glyphSetIds: this.$route.query.glyphSetIds}})"><h2 class="navActive">Results</h2></div>
            <div @click="this.$router.push({path:'/calibration', query: {glyphSetIds: this.$route.query.glyphSetIds}})" class="secondaryNavBtn"><svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" style="fill: var(--text2);"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg></div>
        </nav>
    </header>



    <main>
        <section v-show="glyphSets.length > 0" style="width: 100%;" class="results">
            <div class="resultBox stats" v-for="(glyphSet, index) in glyphSets" :key="glyphSet.id">
                <h2 class="setHeader">{{ glyphSet.id.charAt(0).toUpperCase() + glyphSet.id.slice(1) }}</h2>

                <glyph-set-info style="max-width: 500px;" :glyphSet="glyphSet" :live="false" v-if="glyphSet"/>
                

                <h3>Charts</h3>

                <div class="chartsWrapper">
                    <div class="chart">
                        <line-chart :datasets="[...charts[0].datasets[index]]" :labels="charts[0].labels[index]" :average="glyphSet.successRate" v-if="charts.length > 0"></line-chart>
                    </div>
                    
                    <div class="chart">
                        <bar-chart :datasets="[charts[1].datasets[index]]" :labels="charts[1].labels" :average="glyphSet.successRate" v-if="charts.length > 0"></bar-chart>
                    </div>
                    
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
    import { toRaw } from 'vue'



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



        async mounted() {
            // chart line colors
            


            // re-init glyph sets and get stats
            let chartDatasets2 = []
            let chartLabels2 = []


            let x
            let y


            // chart data
            this.chartDatasets = []
            this.chartLabels = []

            for (const glyphSetId of JSON.parse(this.$route.query.glyphSetIds)) {
                let lineColors1 = [
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 112, 188, 0.5)',
                    'rgba(75, 192, 192, 0.5)', 
                    'rgba(255, 159, 64, 0.5)',
                    'rgba(255, 0, 0, 1)',
                ];


                let newGlyphSet = new GlyphSet(glyphSetId)
                await newGlyphSet.getStats()
                this.glyphSets.push(newGlyphSet)

                let chartData = await newGlyphSet.getChartData()




                console.log(chartData[0][0])

                x = chartData[0][0].map(obj => obj.x)

                console.log(x)

                let rotations = []

                for (let i = 0; i < 5; i++) {
                    let color = lineColors1[0]
                    lineColors1.shift()

                    let label = i == 4 ? 'All' : i * 90 + '°'

                    let y = chartData[0][i].map(obj => obj.y)
                    y = y.map(value => isNaN(value) ? null : value)


                    if ((i != 4 && !y.every(value => value === null)) || (i == 4 && rotations.length != 1)) {
                        let chartDataset = {
                            label: label,
                            data: y,
                            borderColor: color,
                            backgroundColor: color,
                            tension: 0.4
                        }

                        rotations.push(chartDataset)
                    }

                    else if (i == 4 && rotations.length == 1) {
                        rotations[0].borderColor = 'rgba(54, 162, 235, 1)'
                        rotations[0].backgroundColor = 'rgba(54, 162, 235, 1)'
                    }
                }

                this.chartDatasets.push(rotations)

                
                // lineColors1.shift()


                // Labels
                this.chartLabels.push(x)

                // if (x.length > this.chartLabels.length) {
                //     this.chartLabels = x
                //     // this.chartLabels = this.chartLabels.map(label => label / 10)

                //     console.log(this.chartLabels)
                // }




                // Acc and val chart
                console.log(chartData)

                x = chartData[1].map(obj => obj.x)
                y = chartData[1].map(obj => obj.y)


                let chartDataset = {
                    label: glyphSetId,
                    data: y,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 1)',
                    tension: 0.4
                }

                
                chartDatasets2.push(chartDataset)


                if (x.length > chartLabels2.length) {
                    chartLabels2 = x
                    // this.chartLabels = this.chartLabels.map(label => label / 10)

                    console.log(chartLabels2)
                }
            }


            

            this.charts.push({'datasets': this.chartDatasets, 'labels': this.chartLabels})
            this.charts.push({'datasets': chartDatasets2, 'labels': chartLabels2})


            // Fix dataset length
            // let datasetLengths = []

            // toRaw(toRaw(this.charts)[0].datasets).forEach(dataset => {
            //     datasetLengths.push(dataset.data.length)
            // });


            // let maxLength = Math.max(...datasetLengths)

            // toRaw(toRaw(this.charts)[0].datasets).forEach(dataset => {
            //     let datasetLength = dataset.data.length

            //     if (datasetLength < maxLength) {
            //         let diff = maxLength - datasetLength

            //         for (let i = 0; i < diff; i++) {
            //             dataset.data.unshift(null)
            //         }
            //     }
            // });



            console.log(toRaw(toRaw(this.charts)[0].datasets))
            console.log(this.charts)

            
        },


        methods: {

        }
    }
</script>



<style scoped>
    main {
        width: 1800px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 100px;
        flex-wrap: wrap;
    }

    .results {
        width: 100%;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr 1fr;
        align-items: center;
        justify-content: center;
        gap: 40px;
        flex-wrap: wrap;
        /* margin: 0 100px; */
    }

    .setHeader {
        font-size: 35px;
        color: var(--text);
        margin: -10px 0 5px -10px;
        font-weight: 800;
    }

    h3 {
        font-size: 29px;
        color: var(--text);
        margin-top: 10px;
        font-weight: 700;
    }


    .resultBox {
        border-radius: 15px;
        background-color: var(--element-bg);
        box-shadow: 0px 0px 15px var(--shadow2);
        border: 3px solid var(--border2);
        padding: 25px 30px;
        width: 100%;
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


    .chart { 
        background-color: #ffffff;
        margin-bottom: 20px;
        padding: 20px 5px;
    }





    /* MEDIA QUERIES */

    @media screen and (max-width: 1100px) {
        main {
            width: 700px;
        }
    }
</style>