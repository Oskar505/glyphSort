<template>
    <div class="infoWrapper" v-if="glyphSet" :style="live ? 'gap: 20px' : 'gap: 15px'">
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

        <div class="infoBox" title="Difference between glyph values (0 - 100)" v-if="live">
            <p class="data">{{ difference }}</p>
            <p class="label">Difference</p>
        </div>


        <div class="infoBox" title="Smallest difference between glyph values (0 - 100)" v-if="!live">
            <p class="data">{{ difference }}</p>
            <p class="label">Difference</p>
        </div>
    </div>
</template>


<script>
import { nextTick } from 'vue';

export default {
    props: {
        glyphSet: Object,
        live: Boolean
    },
    
    data() {
        return {
            difference: 0
        }
    },


    mounted() {
        // get stats
        this.glyphSet.getStats()


        nextTick(() => {
            if (this.live) {
                this.difference = (this.glyphSet.actualDistance / parseFloat(this.glyphSet.glyphStepsCount) * 100).toFixed(2)
            }

            else {
                this.difference = (this.glyphSet.smallestDistance / parseFloat(this.glyphSet.glyphStepsCount) * 100).toFixed(2)
            }


            if (!isFinite(this.difference)) {
                this.difference = 0
            }
        })
        
    },
}
</script>


<style scoped>
    .infoWrapper {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        gap: 20px;
        width: 110%;
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
</style>