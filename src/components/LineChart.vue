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

    // Zaregistrujeme prvky pro čárový graf
    ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

    export default {
        name: 'LineChart',
        components: { Line },

        props: {
            datasets: Array,
            labels: Array
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
                        }
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
