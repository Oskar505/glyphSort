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
            annotations: Array,
            average: Number,
            percentageY: Boolean,
            titles: Array,
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

                            display: false,
                        },
                        tooltip: {
                            enabled: true
                        },

                        annotation: {
                            annotations: this.annotations
                        },
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: this.titles[0]
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: this.titles[1]
                            },

                            min: 0,
                            // max: 100,

                            ticks: !this.percentageY ? {} : {
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