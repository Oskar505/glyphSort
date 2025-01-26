<template>
    <Line
        id="my-chart-id"
        :options="chartOptions"
        :data="chartData"
    />
</template>

<script>
    import { Line } from 'vue-chartjs'
    import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js'

    import chartAnnotation from 'chartjs-plugin-annotation'

    ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, chartAnnotation)

    export default {
        name: 'LineChart',
        components: { Line },

        props: {
            datasets: Array,
            labels: Array,
            average: Number,
        },

        data() {
            return {
                chartData: {
                    labels: this.labels,
                    datasets: this.datasets
                },
                
                chartOptions: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                usePointStyle: true,
                            },
                            display:false,
                        },
                        tooltip: {
                            enabled: true
                        },

                        // annotation: {
                        //     annotations: {
                        //         average: {
                        //             type: 'line',
                        //             yMin: 100 - this.average,
                        //             yMax: 100 -this.average,
                        //             borderColor: 'black',
                        //             borderWidth: 2,
                        //             label: {
                        //                 content: 'Y = 50', // Popis čáry
                        //                 enabled: true,
                        //                 position: 'center',
                        //                 font: {
                        //                     size: 12
                        //                 }
                        //             }
                        //         }
                        //     }
                        // },
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Difference'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Error'
                            },
                            min: 0,
                            max: 100,

                            ticks: {
                                beginAtZero: true,
                                max: 100,
                                callback: function (value) {
                                    return value + '%';
                                }
                            }
                        }
                    }
                }
            }
        },


        watch: {
            datasets: {
                handler(newDatasets) {
                    this.chartData.datasets = newDatasets;
                },
                deep: true,
            },
        },
    }
</script>
