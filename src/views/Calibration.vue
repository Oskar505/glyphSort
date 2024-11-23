<template>
    <header>
        <h1 @click="clearStorage()">Calibration</h1>

        <nav>
            <div @click="this.$router.push({path:'/'})"><h2>Home</h2></div>
            <div @click="this.$router.push({path:'/sort', query: {glyphSetIds: JSON.stringify(selectedGlyphs)}})"><h2>Sort</h2></div>
            <div @click="this.$router.push({path:'/results', query: {glyphSetIds: JSON.stringify(selectedGlyphs)}})"><h2>Results</h2></div>
        </nav>
    </header>


    <main>
        <div class="cardCalibrationWrapper">
            <div class="instructions">
                <h2>Adjust this rectangle to match your credit card</h2>
                <p>If you don't have a credit card, you can measure the width with a ruler. It should be 8.56cm wide.</p>
            </div>

            <div class="cardContainer">
                <div class="card" :style="{width: `${cardWidth}px`, height: `${cardHeight}px`}">
                    <p>{{ cardWidth }}px</p>
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
            }
        },


        methods: {
            adjustWidth() {
                let width = document.getElementById('slider').value

                console.log(width)

                this.cardWidth = width
                this.cardHeight = width / 1.58577
            },


            calculateDPI() {
                const pixelWidth = parseInt(this.cardWidth, 10); // digital widt in px
                const cardWidthCm = 8.56; // real width in cm

                // calculate DPI
                const dpi = pixelWidth / (cardWidthCm / 2.54);

                console.log(`${dpi.toFixed(2)} DPI`);
                
                // save cokie
                document.cookie = `dpi=${dpi}; path=/; max-age=31536000; SameSite=Strict`;

                this.$router.push({path:'/'})
            },
        },
    }
</script>



<style scoped>
    .cardCalibrationWrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 15px;
        background-color: #fcfcfc;
        box-shadow: 0px 0px 15px #dedede;
        border: 3px solid #999;
        margin-top: 3%;
        padding: 30px 80px;
        user-select: none;
        max-width: 90%;
        margin: 0 auto;
    }

    .instructions {
        text-align: center;
        color: #666;
        font-size: 22px;
    }

    h2 {
        color: #444;
        font-size: 33px;
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