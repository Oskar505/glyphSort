<template>
    <header>
        <h1 @click="clearStorage()">Settings</h1>

        <nav>
            <div @click="this.$router.push({path:'/', query: {glyphSetIds: JSON.stringify(glyphSetIds)}})"><h2>Home</h2></div>
            <div @click="this.$router.push({path:'/sort', query: {glyphSetIds: JSON.stringify(glyphSetIds)}})"><h2>Sort</h2></div>
            <div @click="this.$router.push({path:'/results', query: {glyphSetIds: JSON.stringify(glyphSetIds)}})"><h2>Results</h2></div>
            <div @click="this.$router.push({path:'/calibration', query: {glyphSetIds: JSON.stringify(glyphSetIds)}})" class="secondaryNavBtn"><svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#666"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg></div>
        </nav>
    </header>


    <main>
        
        <div class="generalSettingsWrapper settingsWrapper">
            <h2>Settings</h2>

            <div class="sortingBtns">
                <h3 class="strong">Sorting buttons order</h3>
                <div class="answerBtnWrapper" @click="saveSortingBtnsOrder(1)" :style="{ 'border-color': btnsOrder === 1 ? '#4a90e2' : '' }">
                    <div class="answerBtn">
                        <p><</p>
                    </div>

                    <div class="answerBtn">
                        <p>=</p>
                    </div>

                    <div class="answerBtn">
                        <p>></p>
                    </div>
                </div>

                <div class="answerBtnWrapper" @click="saveSortingBtnsOrder(0)" :style="{ 'border-color': btnsOrder === 0 ? '#4a90e2' : '' }">
                    <div class="answerBtn">
                        <p>></p>
                    </div>

                    <div class="answerBtn">
                        <p>=</p>
                    </div>

                    <div class="answerBtn">
                        <p><</p>
                    </div>
                </div>
            </div>
            
        </div>



        <div class="cardCalibrationWrapper settingsWrapper">
            <div class="instructions">
                <h2>Calibration</h2>
                <p><span class="strong">Adjust this rectangle to match your credit card.</span class="strong"> <br> If you don't have a credit card, use a ruler to measure the width. It should be 8.56cm wide.</p>
            </div>

            <div class="cardContainer">
                <div class="card" :style="{width: `${cardWidth}px`, height: `${cardHeight}px`}">
                    <p>{{ cardWidth.toFixed(0) }}px</p>
                </div>
            </div>

            <div class="userInput">
                <input type="range" id="slider" min="50" max="500" :value=cardWidth @input="adjustWidth()">
                <button id="confirmBtn" @click="calculateDPI()">Confirm</button>
            </div>
        </div>
    </main>
</template>


<script>
    export default {
        data() {
            return {
                cardWidth: 300,
                cardHeight: 189.18,
                dpi: null,
                btnsOrder: 0,
                glyphSetIds: [],
            }
        },


        mounted() {
            this.dpi = parseFloat(this.$getCookie('dpi'))

            if (this.dpi) {
                this.cardWidth = 3.375 * this.dpi
                this.cardHeight = this.cardWidth / 1.58577
            }


            this.btnsOrder = Number(this.$getCookie('sortingBtnsOrder'))



            this.glyphSetIds = this.$route.query.glyphSetIds ? JSON.parse(this.$route.query.glyphSetIds) : []
        },


        methods: {
            adjustWidth() {
                let width = parseFloat(document.getElementById('slider').value)

                this.cardWidth = width
                this.cardHeight = width / 1.58577
            },


            calculateDPI() {
                const pixelWidth = parseInt(this.cardWidth, 10); // digital widt in px
                const cardWidthCm = 8.56; // real width in cm

                // calculate DPI
                const dpi = pixelWidth / (cardWidthCm / 2.54);
                
                // save cokie
                document.cookie = `dpi=${dpi}; path=/; max-age=31536000; SameSite=Strict`;

                this.$router.push({path:'/'})
            },


            saveSortingBtnsOrder(order) {
                this.btnsOrder = order
                document.cookie = `sortingBtnsOrder=${order}; path=/; max-age=31536000; SameSite=Strict`;
            }
        },
    }
</script>



<style scoped>
    main {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 40px;
        padding: 0 50px;
    }


    .settingsWrapper {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 15px;
        background-color: #fcfcfc;
        box-shadow: 0px 0px 15px #dedede;
        border: 3px solid #999;
        margin-top: 3%;
        padding: 15px 30px;
        user-select: none;
        max-width: 90%;
        margin: 0 auto;
    }



    .generalSettingsWrapper {
        justify-content: start;
        align-items: start;
    }


    .sortingBtns {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin: 20px 5px;
    }

    .sortingBtns h3 {
        margin-bottom: 0px;
    }


    .answerBtnWrapper {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 30px;
        border: 3px solid #999;
        padding: 10px;
        border-radius: 15px;
    }


    .answerBtn {
        font-size: 40px;
        font-weight: 500;
        border: 3px solid #444;
        color: #444;
        padding: 0 18px;
        border-radius: 15px;
        background-color: white;
    }



    .instructions {
        text-align: left;
        color: #666;
        font-size: 22px;
    }

    h2 {
        color: #444;
        font-size: 32px;
        margin: 0;
    }

    .instructions p {
        margin-left: 5px;
    }

    .strong {
        font-weight: 700;
        color: #666;
        font-size: 25px;
    }


    .cardContainer {
        width: 501px;
        height: 317px;
        margin: 20px 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .card {
        width: 200px;
        height: 200px;
        padding-bottom: 5px;
        background-color: #888;
        display: flex;
        align-items: flex-end;
        justify-content: center;
    }

    .card p {
        color: #fff;
    }


    .userInput {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 20px;
    }

    #slider {
        width: 300px;
        background: #4a90e2;
    }

    #slide[type='range'] {
        color: #4a90e2;
    }


    #confirmBtn {
        font-size: 27px;
        font-weight: 700;
        color: #444;
        background-color: #fcfcfc;
        border: 3px solid #444;
        border-radius: 27px;
        cursor: pointer;
        padding: 0.3em 0.7em;
        margin-bottom: 15px;
        transition: 0.3s ease;
    }


    #confirmBtn:hover {
        border-color: #4a90e2;
        background-color: #4a90e2;
        color: #fff;
        transition: 0.3s ease;
    }
</style>