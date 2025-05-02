<template>
    <header-bar h1Text='Results' :activeBtn="2" :selectedGlyphs="this.$route.query.glyphSetIds ? JSON.parse(this.$route.query.glyphSetIds) : []"></header-bar>



    <main>
        <section v-show="glyphSets.length > 0" style="width: 100%;" class="results">
            <transition-group name="fade2" class="setList" tag="div">
                <div class="setSelection resultBox" v-for="(glyphSet, index) in glyphSets" @click="toggleCurve(charts[0].datasets.filter(dataset => dataset.setId == glyphSet.id).map(dataset => dataset.label))" :key="glyphSet.id">
                    <div>
                        <h2 class="setHeader">{{ glyphSet.id.charAt(0).toUpperCase() + glyphSet.id.slice(1) }}</h2>
                        <div class="legend">
                            <div class="curve" v-for="(rotation, curveIndex) in charts[0].datasets.filter(dataset => dataset.setId == glyphSet.id)" :class="rotation.disabled ? '' : 'curveEnabled'" @click.stop="toggleCurve([rotation.label])" v-if="charts[0] && charts.length">
                                <div class="colorCircle" :style="'background-color: ' + (rotation.disabled ? rotation.disabledColor : rotation.backgroundColor)"></div> {{ rotation.rotation }}
                            </div>
                        </div>
                    </div>
                    

                    <glyph-set-info :glyphSet="glyphSet"></glyph-set-info>
                </div>
            </transition-group>
            

            <section class="charts">
                <div class="chart resultBox">
                    <line-chart :datasets="charts[0].datasets.filter(dataset => !dataset.disabled)" :labels="charts[0].labels" v-if="charts.length > 0" :key="lineChartKey"></line-chart>
                </div>

                <div class="chart resultBox">
                    <bar-chart :datasets="charts[1].datasets.filter(dataset => !dataset.disabled)" :labels="charts[1].labels" :annotations="charts[1].annotations.filter(dataset => !dataset.disabled)" :percentageY="true" :titles="['Glyph value', 'Success']" v-if="charts.length > 0" :key="lineChartKey"></bar-chart>
                </div>

                <div class="chart resultBox">
                    <bar-chart :datasets="charts[2].datasets.filter(dataset => !dataset.disabled)" :labels="charts[2].labels" :annotations="charts[2].annotations.filter(dataset => !dataset.disabled)" :percentageY="false" :titles="['Difference', 'Answer count']" v-if="charts.length > 0" :key="lineChartKey"></bar-chart>
                </div>
            </section>
            
        </section>



        <section class="middlePageWarning" v-if="glyphSets.length == 0">
            <h1>No set selected</h1>
            <h2>Select it on the <router-link to="/">home page</router-link></h2>
        </section>
    </main>


    <loader v-if="isLoading"></loader>
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
                isLoading: false
            }
        },



        async mounted() {
            this.isLoading = true


            // re-init glyph sets and get stats
            let chartDatasets2 = []
            let chartLabels2 = []
            let chartAnnotations2 = []

            let chartDatasets3 = []
            let chartLabels3 = []
            let chartAnnotations3 = []



            let x
            let y


            // chart data
            this.chartDatasets = []
            this.chartLabels = []

            const allGlyphSetIds = localStorage.getItem("glyphSetList") ? JSON.parse(localStorage.getItem("glyphSetList")) : [];
            const glyphSetIds = this.$route.query.glyphSetIds ? JSON.parse(this.$route.query.glyphSetIds) : []

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

                console.log(x)

                // all 5 curves for 1 set
                for (let i = 0; i < 5; i++) {
                    const color = `hsla(${colorHue[colorIndex]}, ${colorSaturation[i]}%,${colorLightness[i]}%, 1)`
                    const disabledColor = `hsla(${colorHue[colorIndex]}, ${colorSaturation[i]}%,${colorLightness[i]}%, 0.7)`


                    let rotation = i == 4 ? 'All' : i * 90 + '°'

                    let y = chartData[0][i].map(obj => obj.y)
                    y = y.map(value => isNaN(value) ? null : value)


                    // set with rotations
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

                console.log(chartData)

                const color = `hsla(${colorHue[colorIndex]}, 95%, 55%, 1)`


                let chartDataset = {
                    label: glyphSetId,
                    data: y,
                    borderColor: color,
                    backgroundColor: color,
                    tension: 0.4,
                    disabled: !glyphSetIds.includes(glyphSetId)
                }

                
                let average = y.reduce((a, b) => a + b, 0) / y.length
                average = isNaN(average) ? 0 : average

                console.log(average)
                console.log(y)

                let chartAnnotation = {
                    setId: glyphSetId,
                    type: 'line',
                    yMin: average,
                    yMax: average,
                    borderColor: `hsla(${colorHue[colorIndex]}, 100%, 30%, 1)`,
                    borderWidth: 2,
                    disabled: !glyphSetIds.includes(glyphSetId)
                }

                
                chartDatasets2.push(chartDataset)
                chartAnnotations2.push(chartAnnotation)


                if (x.length > chartLabels2.length) {
                    chartLabels2 = x
                }

                chartLabels2 = [0,10,20,30,40,50,60,70,80,90] 




                // DIFFS AND ANSWER COUNT CHART
                x = chartData[2].map(obj => obj.x)
                y = chartData[2].map(obj => obj.y)



                chartDataset = {
                    label: glyphSetId,
                    data: y,
                    borderColor: color,
                    backgroundColor: color,
                    tension: 0.4,
                    disabled: !glyphSetIds.includes(glyphSetId)
                }

                
                average = y.reduce((a, b) => a + b, 0) / y.length
                average = isNaN(average) ? 0 : average

                chartAnnotation = {
                    setId: glyphSetId,
                    type: 'line',
                    yMin: average,
                    yMax: average,
                    borderColor: `hsla(${colorHue[colorIndex]}, 100%, 30%, 1)`,
                    borderWidth: 2,
                    disabled: !glyphSetIds.includes(glyphSetId)
                }

                
                chartDatasets3.push(chartDataset)
                chartAnnotations3.push(chartAnnotation)


                if (x.length > chartLabels3.length) {
                    chartLabels3 = x
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


            // GET IDEAL X LABEL - for standard lengths - 100, 1000, 10000
            // let prevDistance
            // let idealLabel = []
            // let gamma = this.glyphSets[0].gamma

            // let tempDistance
            // let setLength


            // // get right starting distance
            // this.glyphSets.forEach(set => {
            //     if (isPowerOfTwenty(set.distance)) {
            //         tempDistance = set.distance
            //         setLength = set.glyphs.length
            //     }
            // })


            // // if standard distance wasnt found, use first
            // if (tempDistance == undefined) {
            //     tempDistance = this.glyphSets[0].distance
            // }

            // if (setLength == undefined) {
            //     setLength = this.glyphSets[0].glyphs.length
            // }



            // for (let i = 0; i < lowestLabel.length; i++) {
            //     // dont push duplicates
            //     prevDistance != tempDistance ? idealLabel.push((tempDistance / (setLength / 100)).toFixed(2)) : null
                
            //     // calculate new distance
            //     prevDistance = tempDistance
            //     tempDistance = Math.floor(tempDistance * gamma)
            // }

            // idealLabel = idealLabel.reverse()



            // Push data
            this.charts.push({'datasets': this.chartDatasets, 'labels': lowestLabel})
            this.charts.push({'datasets': chartDatasets2, 'labels': chartLabels2, 'annotations': chartAnnotations2})
            this.charts.push({'datasets': chartDatasets3, 'labels': lowestLabel, 'annotations': chartAnnotations3})



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

            toRaw(toRaw(this.charts)[2].datasets).forEach(dataset => {
                let datasetLength = dataset.data.length

                if (datasetLength < maxLength) {
                    let diff = maxLength - datasetLength

                    for (let i = 0; i < diff; i++) {
                        dataset.data.unshift(null)
                    }
                }
            });


            console.log(this.charts)


            this.isLoading = false
        },


        methods: {
            toggleCurve(labels) {
                console.log(labels)
                console.log(this.charts[0].datasets)
                console.log(this.charts[0].datasets.filter(dataset => dataset.label == labels[0])[0].disabled)



                // Toggle curves in the first chart
                let disabled = labels.every(label => !this.charts[0].datasets.filter(dataset => dataset.label == label)[0].disabled)

                labels.forEach(label => {
                    this.charts[0].datasets.filter(dataset => dataset.label == label)[0].disabled = disabled

                    // Force update
                    this.charts[0].datasets = [...this.charts[0].datasets];

                    this.$nextTick(() => {
                        this.lineChartKey++
                    })
                })



                // Toggle curves in the other charts
                // is the whole set disabled
                let setId = this.charts[0].datasets.filter(dataset => dataset.label == labels[0])[0].setId

                let filteredDatasets = this.charts[0].datasets.filter(dataset => dataset.setId == setId)
                let wholeSetDisabled = filteredDatasets.every(dataset => dataset.disabled)

                console.log(this.charts[1].datasets.filter(dataset => dataset.label == setId)[0])


                // toggle curves in the other charts
                if (wholeSetDisabled) {
                    this.charts[1].datasets.filter(dataset => dataset.label == setId)[0].disabled = true
                    this.charts[2].datasets.filter(dataset => dataset.label == setId)[0].disabled = true

                    this.charts[1].annotations.filter(annotation => annotation.setId == setId)[0].disabled = true
                    this.charts[2].annotations.filter(annotation => annotation.setId == setId)[0].disabled = true
                }

                else if (!wholeSetDisabled) {
                    this.charts[1].datasets.filter(dataset => dataset.label == setId)[0].disabled = false
                    this.charts[2].datasets.filter(dataset => dataset.label == setId)[0].disabled = false

                    this.charts[1].annotations.filter(annotation => annotation.setId == setId)[0].disabled = false
                    this.charts[2].annotations.filter(annotation => annotation.setId == setId)[0].disabled = false
                }


                // Force update
                this.charts[1].datasets = [...this.charts[1].datasets];
                this.charts[2].datasets = [...this.charts[2].datasets];

                this.$nextTick(() => {
                    this.lineChartKey++
                })
            }
        }
    }



    function isPowerOfTwenty(num) {
        if (num < 20 || num % 20 !== 0) return false;
        let divided = num / 2;
        return Number.isInteger(Math.log10(divided));
    }
</script>



<style scoped>
    header {
        margin-bottom: 4rem;
    }


    main {
        max-width: 95%;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10rem;
        flex-wrap: wrap;
        padding-bottom: 3rem;
        margin-top: 5.4rem;
    }

    .results {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        margin-top: 3rem;
        display: flex;
        gap: 3rem;
    }

    .resultBox {
        border-radius: 1.5rem;
        background-color: var(--element-bg);
        box-shadow: 0 0 1.5rem var(--shadow2);
        border: 0.3rem solid var(--border2);
    }

    .setHeader {
        font-size: 2.8rem;
        color: var(--text);
        font-weight: 800;
    }

    h3 {
        font-size: 2.9rem;
        color: var(--text);
        margin-top: 1rem;
        font-weight: 700;
    }

    .setList {
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        gap: 3rem;
        flex-grow: 1;
        position: sticky;
        top: 8.4rem;
        width: 20%;
        height: 100%;
    }

    .setSelection {
        display: flex;     
        flex-direction: column;
        justify-content: space-between;
        padding: 0.5rem 1rem;
        cursor: pointer;
        max-width: 30rem;
        min-width: 27rem;
    }


    .statsWrapper {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        width: 50rem;
    }

    .statsWrapper div {
        flex: 1;
    }


    .charts {
        width: 100%;
        min-height: 100lvh;
        display: flex;
        flex-direction: column;
        gap: 4rem;
    }

    .chart { 
        background-color: #ffffff;
        margin-bottom: 2rem;
        padding: 1.5rem 0.5rem;
        width: 100%;
        height: 100%;
        min-height: calc(75lvh - 10rem);
        max-width: 149rem;
        max-height: 78rem;
        margin: 0 auto;
    }



    .legend {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        margin: 1rem 0 1.2rem 0.5rem;
        flex-wrap: wrap;
    }

    .curve {
        display: flex;
        flex-direction: row;
        font-size: 1.5rem;
        color: var(--text3);
        border: 0.2rem solid var(--border2);
        padding: 0.5rem 1rem;
        border-radius: 3rem;
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
        width: 1.9rem;
        height: 1.9rem;
        border-radius: 50%;
        margin-right: 0.5rem;
        display: inline-block;
        transition: background-color 0.3s ease;
    }




    /* MEDIA QUERIES */

    @media screen and (max-width: 1100px) {
        .setSelection {
            min-width: 20rem;
        }

        .chart {
            padding: 0.2rem 0.5rem;
        }
    }

    @media screen and (max-width: 1000px) {
        .results {
            flex-direction: column;
        }

        .chart {
            max-width: 100%;
            max-height: 100%;
            flex-grow: 1;
            min-height: calc(100lvh - 25rem);
            padding: 1rem 0;
        }

        .setList {
            flex-direction: row;
            gap: 2.5rem;
            width: 100%;
            position: static;
        }

        .setSelection {
            max-width: 42rem;
            min-width: 20rem;
            flex: 1;
        }
    }



    @media screen and (max-width: 800px) {
        .chart {
            min-height: calc(70lvh - 25rem);
        }
    }

    @media screen and (max-width: 430px) {
        .setList {
            align-items: center;
        }

        .setSelection {
            min-width: 40rem;
            max-width: 10000rem;
        }

        .chart {
            height: calc(10lvh - 25rem);
            min-height: 0;
        }
    }
</style>