<template>
    <Bar
        id="my-chart-id"
        :options="chartOptions"
        :data="chartData"
    />
</template>

<script>
    import { Bar } from 'vue-chartjs'
    import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

    import chartAnnotation from 'chartjs-plugin-annotation'

    ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, chartAnnotation)

    export default {
        name: 'BarChart',
        components: { Bar },

        props: {
            datasets: Array,
            labels: Array,
            average: Number
        },

        data() {
            return {
                chartData: {
                    labels: this.labels,
                    datasets: this.datasets
                },
                
                chartOptions: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                usePointStyle: true,
                            }
                        },
                        tooltip: {
                            enabled: true
                        },

                        annotation: {
                            annotations: {
                                average: {
                                    type: 'line',
                                    yMin: this.average,
                                    yMax: this.average,
                                    borderColor: 'black',
                                    borderWidth: 2,
                                    label: {
                                        content: 'Y = 50', // Popis čáry
                                        enabled: true,
                                        position: 'center',
                                        font: {
                                            size: 12
                                        }
                                    }
                                }
                            }
                        },
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Glyph value'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Succes'
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
        }
    }
</script>