<template>
    <header>
        <h1 @click="clearStorage()">Sort</h1>
    </header>

    <main>
        <div class="sortWrapper" :class="borderFeedback">
            <div class="glyphCardWrapper">
                <glyph-card :value="val1"></glyph-card>
                <glyph-card :value="val2"></glyph-card>
            </div>
            

            <div class="answerBtnWrapper">
                <div class="answerBtn" id="lessBtn" :class="btn0Feedback" @click="checkAnswer(0, glyphSets[pickedSet])">
                    <p><</p>
                </div>

                <div class="answerBtn" id="lessBtn" :class="btn1Feedback" @click="checkAnswer(1, glyphSets[pickedSet])">
                    <p>=</p>
                </div>

                <div class="answerBtn" id="lessBtn" :class="btn2Feedback" @click="checkAnswer(2, glyphSets[pickedSet])">
                    <p>></p>
                </div>
            </div>
        </div>


        <div class="infoWrapper" v-if="glyphSets[pickedSet]">
            <div class="infoBox" title="Number of sorted glyphs">
                <p class="data">{{ glyphSets[pickedSet].sortedCount }}</p>
                <p class="label">Count</p>
            </div>
            
            <div class="infoBox" title="Average time to sort a pair of glyphs">
                <p class="data">{{ glyphSets[pickedSet].sortTime }}&nbsp;s</p>
                <p class="label">Time</p>
            </div>

            <div class="infoBox" title="Success rate">
                <p class="data">{{ glyphSets[pickedSet].successRate }}&nbsp;%</p>
                <p class="label">Success</p>
            </div>

            <div class="infoBox" title="Difference between glyph values (0 - 100)">
                <p class="data">{{ Math.round(glyphSets[pickedSet].actualDistance / parseFloat(glyphSets[pickedSet].glyphStepsCount) * 100) }}</p>
                <p class="label">Difference</p>
            </div>
        </div>
    </main>


    <div class="floatingBtn" @click="this.$router.push({path:'/results', query: {successRate: successRate, sortedCount: sortedCount, sortTime: sortTime, distance: distance, sessionTime: sessionTime, glyphStepsCount: glyphStepsCount}})">
        <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#444"><path d="M662.82-440.39H145.87v-79.22h516.95L423.87-758.57 480-814.7 814.7-480 480-145.87l-56.13-55.56 238.95-238.96Z"/></svg>
    </div>
    
</template>


<script>
    import GlyphSet from '../GlyphSetClass.js'


    export default {
        data() {
            return {
                glyphSets: [],
                pickedSet: 0,


                glyphName: "a",
                distance: undefined,
                val1: 0,
                val2: 0,
                gamma: 0.7,
                lastCorrect: true,
                glyphStepsCount: 100,
                equalChance: 1, // 1 = 10%

                successRate: 0,
                sortedCount: 0,
                sortTime: 0,
                sessionTime: 0,

                clickCooldown: false,

                btn0Feedback: '',
                btn1Feedback: '',
                btn2Feedback: '',
                borderFeedback: '',
            }
        },



        mounted() {
            window.addEventListener('keydown', this.handleKeydown)
            

            //TEST: define class
            this.glyphSets = [new GlyphSet("a")]

            let newGlyphData = this.glyphSets[0].getGlyphPair(undefined, true)
            this.distance = newGlyphData.distance
            this.val1 = newGlyphData.val1
            this.val2 = newGlyphData.val2



            // get stats
            let allAnswers = JSON.parse(localStorage.getItem("allAnswers")) || []
            let sessionAnswers = JSON.parse(sessionStorage.getItem("sessionAnswers")) || []
            this.glyphSets[0].getStats(allAnswers, sessionAnswers)

            console.log(this.glyphSets[this.pickedSet])
        },

        beforeUnmount() {
            window.removeEventListener('keydown', this.handleKeydown)
        },



        methods: {
            checkAnswer(buttonId, glyphSet) {
                // check
                if (buttonId == 0) {
                    this.lastCorrect = this.val1 < this.val2

                    // show feedback
                    if (this.lastCorrect) {
                        this.btn0Feedback = "correctBtn"
                        this.borderFeedback = "correctBorder"
                    }

                    else {
                        this.btn0Feedback = "wrongBtn"
                        this.borderFeedback = "wrongBorder"
                    }
                }

                else if (buttonId == 1) {
                    this.lastCorrect = this.val1 == this.val2

                    // show feedback
                    if (this.lastCorrect) {
                        this.btn1Feedback = "correctBtn"
                        this.borderFeedback = "correctBorder"
                    }

                    else {
                        this.btn1Feedback = "wrongBtn"
                        this.borderFeedback = "wrongBorder"
                    }
                }

                else if (buttonId == 2) {
                    this.lastCorrect = this.val1 > this.val2

                    // show feedback
                    if (this.lastCorrect) {
                        this.btn2Feedback = "correctBtn"
                        this.borderFeedback = "correctBorder"
                    }

                    else {
                        this.btn2Feedback = "wrongBtn"
                        this.borderFeedback = "wrongBorder"
                    }
                }



                // Save new answer
                let answerData = {
                    "val1": this.val1,
                    "val2": this.val2,
                    "correct": this.lastCorrect,
                    'distance': this.distance,
                    "time": Date.now()
                }

                glyphSet.addAnswer(answerData)


                glyphSet.getStats()


                // reset feedbacks and get new glyphs
                setTimeout(() => {
                    this.btn0Feedback = ''
                    this.btn1Feedback = ''
                    this.btn2Feedback = ''
                    this.borderFeedback = ''


                    // this.newGlyphs()

                    let newGlyphData = glyphSet.getGlyphPair(this.distance, this.lastCorrect)
                    this.distance = newGlyphData.distance
                    this.val1 = newGlyphData.val1
                    this.val2 = newGlyphData.val2
                }, 500);
            },


            handleKeydown(e) {
                // ignore if cooldown
                if (this.clickCooldown) return;


                if (e.key == "ArrowLeft" || e.key == "a") {
                    this.checkAnswer(0, this.glyphSets[this.pickedSet])
                }

                else if (e.key == "ArrowDown" || e.key == "s") {
                    this.checkAnswer(1, this.glyphSets[this.pickedSet])
                }

                else if (e.key == "ArrowRight" || e.key == "d") {
                    this.checkAnswer(2, this.glyphSets[this.pickedSet])
                }


                // set cooldown
                this.clickCooldown = true;
                setTimeout(() => {
                    this.clickCooldown = false;
                }, 500);
            },


            clearStorage() {
                console.log("clearing storage");

                localStorage.clear();
                sessionStorage.clear();
            },
        },

    }
</script>


<style scoped>
    main {
       max-width: 500px;
       width: 100%;
       margin: 0 auto;
       display: flex;
       flex-direction: column;
       align-items: center;
    }


    .sortWrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 50px;
        border-radius: 15px;
        background-color: #fcfcfc;
        box-shadow: 0px 0px 15px #dedede;
        border: 3px solid #999;
        margin-top: 13%;
        padding: 30px 80px;
        user-select: none;
    }

    .glyphCardWrapper {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 100px;
    }

    .answerBtnWrapper {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 40px;
    }


    .answerBtn {
        font-size: 49px;
        font-weight: 500;
        border: 3px solid #444;
        color: #444;
        padding: 0 25px;
        border-radius: 15px;
        background-color: white;
    }



    .infoWrapper {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        gap: 20px;
        width: 110%;
        margin-top: 6%;
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



    .floatingBtn {
        position: fixed;
        bottom: 60px;
        right: 60px;
        background-color: transparent;
        border: 3px solid #444;
        border-radius: 50%;
        padding: 7px;
        cursor: pointer;
        transition: 0.2s;
        background-color: #fcfcfc;
        box-shadow: 0px 0px 10px #ddd;
    }

    

    /* Animations */

    @keyframes correctBtnKeyframe {
        0% {
            background-color: transparent;
            border: 3px solid #444
        }

        50% {
            background-color: #2dba3a;
            border: 3px solid #279f33;
        }

        100% {
            background-color: transparent;
            border: 3px solid #444
        }
    }

    @keyframes wrongBtnKeyframe {
        0% {
            background-color: transparent;
            border: 3px solid #444
        }

        50% {
            background-color: #ff0000;
            border: 3px solid #ae0000;
        }

        100% {
            background-color: transparent;
            border: 3px solid #444
        }
    }


    @keyframes correctBorderKeyframe {
        0% {
            border: 3px solid #999
        }

        50% {
            border: 4px solid #2dba3a;
        }

        100% {
            border: 3px solid #999
        }
    }

    @keyframes wrongBorderKeyframe {
        0% {
            border: 3px solid #999
        }

        50% {
            border: 4px solid #ff0000;
        }

        100% {
            border: 3px solid #999
        }
    }


    .correctBtn {
        animation: correctBtnKeyframe 500ms ease-in;
    }

    .wrongBtn {
        animation: wrongBtnKeyframe 500ms ease-in;
    }


    .correctBorder {
        animation: correctBorderKeyframe 500ms ease-in;
        background-color: #fcfcfc !important;
    }
    
    .wrongBorder {
        animation: wrongBorderKeyframe 500ms ease-in;
        background-color: #fcfcfc !important;
    }
</style>