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
            <div class="setList">
                <div class="setSelection resultBox" v-for="(glyphSet, index) in glyphSets" @click="toggleCurve(charts[0].datasets.filter(dataset => dataset.setId == glyphSet.id).map(dataset => dataset.label))" :key="glyphSet.id">
                    <h2 class="setHeader">{{ glyphSet.id.charAt(0).toUpperCase() + glyphSet.id.slice(1) }}</h2>
                    <div class="legend">
                        <div class="curve" v-for="(rotation, curveIndex) in charts[0].datasets.filter(dataset => dataset.setId == glyphSet.id)" :class="rotation.disabled ? '' : 'curveEnabled'" @click.stop="toggleCurve([rotation.label])" v-if="charts[0] && charts.length">
                            <div class="colorCircle" :style="'background-color: ' + (rotation.disabled ? rotation.disabledColor : rotation.backgroundColor)"></div> {{ rotation.rotation }}
                        </div>
                    </div>
                </div>
            </div>
            

            <div class="chart resultBox">
                <line-chart :datasets="charts[0].datasets.filter(dataset => !dataset.disabled)" :labels="charts[0].labels" v-if="charts.length > 0" :key="lineChartKey"></line-chart>
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

                lineChartKey: 0,
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

            const allGlyphSetIds = localStorage.getItem("glyphSetList") ? JSON.parse(localStorage.getItem("glyphSetList")) : [];
            const glyphSetIds = JSON.parse(this.$route.query.glyphSetIds)

            glyphSetIds.forEach((setId, index) => {
                if (!allGlyphSetIds.includes(setId)) {
                    glyphSetIds.splice(index, 1)
                }
            })


            let colorIndex = -1

            for (const [index, glyphSetId] of allGlyphSetIds.entries()) {
                let lineColors1 = [
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 112, 188, 0.5)',
                    'rgba(75, 192, 192, 0.5)', 
                    'rgba(255, 159, 64, 0.5)',
                    'rgba(255, 0, 0, 1)',
                ];


                colorIndex = colorIndex == 7 ? 0 : colorIndex + 1
                console.log(colorIndex)

                let colorHue = [240, 0, 120, 30, 270, 60, 180]
                let colorSaturation = [95, 90, 85, 50, 100]
                let colorLightness = [85, 75, 65, 55, 45]


                let newGlyphSet = new GlyphSet(glyphSetId)
                await newGlyphSet.getStats()
                this.glyphSets.push(newGlyphSet)

                let chartData = await newGlyphSet.getChartData()



                x = chartData[0][0].map(obj => obj.x)
                let rotations = []

                for (let i = 0; i < 5; i++) {
                    let color = `hsla(${colorHue[colorIndex]}, ${colorSaturation[i]}%,${colorLightness[i]}%, 1)`
                    let disabledColor = `hsla(${colorHue[colorIndex]}, ${colorSaturation[i]}%,${colorLightness[i]}%, 0.7)`


                    let rotation = i == 4 ? 'All' : i * 90 + '°'

                    let y = chartData[0][i].map(obj => obj.y)
                    y = y.map(value => isNaN(value) ? null : value)


                    if ((i != 4 && !y.every(value => value === null)) || (i == 4 && rotations.length != 1)) {
                        let chartDataset = {
                            setId: glyphSetId,
                            rotation: rotation,
                            label: `${glyphSetId}: ${rotation}`,
                            data: y,
                            borderColor: color,
                            backgroundColor: color,
                            disabledColor: disabledColor,
                            tension: 0.4,
                            disabled: !(i == 4 && glyphSetIds.includes(glyphSetId))
                        }

                        rotations.push(chartDataset)
                    }


                    // no rotations
                    else if (i == 4 && rotations.length == 1) {
                        rotations[0].borderColor = color
                        rotations[0].backgroundColor = color
                        rotations[0].disabledColor = disabledColor
                        rotations[0].disabled = !glyphSetIds.includes(glyphSetId)
                    }
                }

                this.chartDatasets.push(rotations)



                // Labels
                this.chartLabels.push(x)




                // ACC AND VAL CHART
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
                }
            }



            // unpack sets
            let unpackedDatasets = []

            this.chartDatasets.forEach(set => {
                unpackedDatasets.push(...set)
            })

            this.chartDatasets = unpackedDatasets
            


            // get labels for all sets
            let lowestLabel

            this.chartLabels.forEach(label => {
                if (!lowestLabel || lowestLabel.length < label.length) {
                    lowestLabel = label
                }
            })

            this.chartLabels = lowestLabel


            // Push data
            this.charts.push({'datasets': this.chartDatasets, 'labels': this.chartLabels})
            this.charts.push({'datasets': chartDatasets2, 'labels': chartLabels2})



            // Fix dataset length
            let datasetLengths = []

            toRaw(toRaw(this.charts)[0].datasets).forEach(dataset => {
                datasetLengths.push(dataset.data.length)
            });


            let maxLength = Math.max(...datasetLengths)

            toRaw(toRaw(this.charts)[0].datasets).forEach(dataset => {
                let datasetLength = dataset.data.length

                if (datasetLength < maxLength) {
                    let diff = maxLength - datasetLength

                    for (let i = 0; i < diff; i++) {
                        dataset.data.unshift(null)
                    }
                }
            });
        },


        methods: {
            toggleCurve(labels) {
                let disabled = labels.every(label => !this.charts[0].datasets.filter(dataset => dataset.label == label)[0].disabled)

                labels.forEach(label => {
                    this.charts[0].datasets.filter(dataset => dataset.label == label)[0].disabled = disabled

                    // Force update
                    this.charts[0].datasets = [...this.charts[0].datasets];

                    this.$nextTick(() => {
                        this.lineChartKey++
                    })
                })
            }
        }
    }
</script>



<style scoped>
    header {
        margin-bottom: 40px;
    }


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
        padding-bottom: 50px;
        display: flex;
        gap: 30px;
    }

    .resultBox {
        border-radius: 15px;
        background-color: var(--element-bg);
        box-shadow: 0px 0px 15px var(--shadow2);
        border: 3px solid var(--border2);
        flex-grow: 3;
    }

    .setHeader {
        font-size: 28px;
        color: var(--text);
        font-weight: 800;
    }

    h3 {
        font-size: 29px;
        color: var(--text);
        margin-top: 10px;
        font-weight: 700;
    }

    .setList {
        display: grid;
        grid-template-columns: 1fr;
        gap: 30px;
        margin-bottom: 30px;
        flex-grow: 1;
        max-height: 100px;
    }

    .setSelection {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 5px 10px;
        cursor: pointer;
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
        padding: 15px 5px 20px 5px;
        width: 85%;
        max-height: 780px;
        margin: 0 auto;
    }



    .legend {
        display: flex;
        flex-direction: row;
        gap: 10px;
        margin-bottom: 10px;
        margin-left: 5px;
    }

    .curve {
        display: flex;
        flex-direction: row;
        font-size: 15px;
        color: var(--text3);
        border: 2px solid var(--border2);
        padding: 5px 10px;
        border-radius: 30px;
        cursor: pointer;
        background-color: var(--page-bg);
        transition: border-color 0.3s ease, color 0.3s ease;
        user-select: none;
    }

    .curveEnabled {
        border-color: var(--enabled);
        color: var(--text);
        transition: border-color 0.3s ease, color 0.3s ease;
    }

    .colorCircle {
        width: 19px;
        height: 19px;
        border-radius: 50%;
        margin-right: 5px;
        display: inline-block;
        transition: background-color 0.3s ease;
    }




    /* MEDIA QUERIES */

    @media screen and (max-width: 1100px) {
        main {
            width: 700px;
        }
    }
</style>