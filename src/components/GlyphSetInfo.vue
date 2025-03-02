<template>
    <div class="infoWrapper" v-if="glyphSet">
        <div class="infoBox" title="Number of sorted glyphs">
            <p class="data">{{ glyphSet.sortedCount }}</p>
            <p class="label">Count</p>
        </div>
        
        <div class="infoBox" title="Average time to sort a pair of glyphs">
            <p class="data">{{ time }}s</p>
            <p class="label">Time</p>
        </div>

        <div class="infoBox" title="Success rate">
            <p class="data">{{ glyphSet.successRate }}%</p>
            <p class="label">Success</p>
        </div>
    </div>
</template>


<script>
import { nextTick } from 'vue';

export default {
    props: {
        glyphSet: Object
    },
    
    data() {
        return {
            difference: 0,
            time: 0,
        }
    },


    mounted() {
        // get stats
        this.glyphSet.getStats()

        console.log(this.glyphSet.sortTime, isNaN(this.glyphSet.sortTime))

        if (isNaN(this.glyphSet.sortTime)) {
            this.time = 0
        }

        else {
            this.time = this.glyphSet.sortTime
        }


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
        gap: 0.8rem;
        width: 100%;
    }


    .infoBox {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 0.1rem;
        flex: 1;
        border: 0.2rem solid var(--border2);
        border-radius: 1.5rem;
        padding: 0.4rem;
        cursor: help;
        background-color: var(--element-bg);
    }

    .infoBox .data {
        font-size: 2.2rem;
        color: var(--text2);
        font-weight: 500;
    }

    .infoBox .label {
        font-size: 1.8rem;
        color: var(--text3);
    }
</style>