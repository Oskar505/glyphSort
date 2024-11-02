<template>
    <header>
        <h1>Sort</h1>
    </header>

    
    <div class="sortWrapper" :class="borderFeedback">
        <div class="glyphCardWrapper">
            <glyph-card :value="val1"></glyph-card>
            <glyph-card :value="val2"></glyph-card>
        </div>
        

        <div class="answerBtnWrapper">
            <div class="answerBtn" id="lessBtn" :class="btn0Feedback" @click="checkAnswer(0)">
                <p><</p>
            </div>

            <div class="answerBtn" id="lessBtn" :class="btn1Feedback" @click="checkAnswer(1)">
                <p>=</p>
            </div>

            <div class="answerBtn" id="lessBtn" :class="btn2Feedback" @click="checkAnswer(2)">
                <p>></p>
            </div>
        </div>
        
    </div>
</template>


<script>
    export default {
        data() {
            return {
                distance: undefined,
                val1: 0,
                val2: 0,
                gamma: 0.7,
                lastCorrect: true,
                glyphStepsCount: 100,
                equalChance: 1, // 1 = 10%

                clickCooldown: false,

                btn0Feedback: '',
                btn1Feedback: '',
                btn2Feedback: '',
                borderFeedback: '',
            }
        },



        mounted() {
            window.addEventListener('keydown', this.handleKeydown)       
        },

        beforeUnmount() {
            window.removeEventListener('keydown', this.handleKeydown)
        },



        methods: {
            newGlyphs() {
                // set first distance to 20%
                if (this.distance == undefined) {
                    this.distance = this.glyphStepsCount * 0.2
                }
                
                // if last response was correct, decrease distance, otherwise increase distance
                else {
                    this.distance = this.lastCorrect ? this.distance * this.gamma : this.distance / this.gamma;
                }


                // if distance is too small, start over
                if (this.distance < 1) {
                    this.distance = 20
                    console.warn("distance too small, starting over");
                }

                // distance cannot be higher than the starting distance
                else if (this.distance > this.glyphStepsCount * 0.2) {
                    this.distance = this.glyphStepsCount * 0.2 
                    console.warn("distance too high, starting over");
                }



                // chance of getting equal values
                if (getRandomInt(0, 9) > this.equalChance) {
                    let offset = this.distance / 2

                    // Get the middle value. After adding or subtracting the offset, it cannot be lower than 0 or higher than the highest glyph.
                    let midVal = getRandomInt(offset, this.glyphStepsCount - offset)


                    // higher of lower
                    if (getRandomInt(0,1) == 0) {
                        this.val1 = Math.round(midVal - offset);
                        this.val2 = Math.round(midVal + offset);
                    }

                    else {
                        this.val1 = Math.round(midVal + offset);
                        this.val2 = Math.round(midVal - offset);
                    }
                }


                else {
                    this.val1 = getRandomInt(0, this.glyphStepsCount);
                    this.val2 = this.val1;
                }


                console.log(this.val1, this.val2);
            },



            checkAnswer(buttonId) {
                // check
                if (buttonId == 0) {
                    this.lastCorrect = this.val1 < this.val2

                    // show feedback
                    if (this.lastCorrect) {
                        console.log("correct");
                        this.btn0Feedback = "correctBtn"
                        this.borderFeedback = "correctBorder"
                    }

                    else {
                        console.log("wrong");
                        this.btn0Feedback = "wrongBtn"
                        this.borderFeedback = "wrongBorder"
                    }
                }

                else if (buttonId == 1) {
                    this.lastCorrect = this.val1 == this.val2

                    // show feedback
                    if (this.lastCorrect) {
                        console.log("correct");
                        this.btn1Feedback = "correctBtn"
                        this.borderFeedback = "correctBorder"
                    }

                    else {
                        console.log("wrong");
                        this.btn1Feedback = "wrongBtn"
                        this.borderFeedback = "wrongBorder"
                    }
                }

                else if (buttonId == 2) {
                    this.lastCorrect = this.val1 > this.val2

                    // show feedback
                    if (this.lastCorrect) {
                        console.log("correct");
                        this.btn2Feedback = "correctBtn"
                        this.borderFeedback = "correctBorder"
                    }

                    else {
                        console.log("wrong");
                        this.btn2Feedback = "wrongBtn"
                        this.borderFeedback = "wrongBorder"
                    }
                }


                // reset feedbacks and get new glyphs
                setTimeout(() => {
                    this.btn0Feedback = ''
                    this.btn1Feedback = ''
                    this.btn2Feedback = ''
                    this.borderFeedback = ''


                    this.newGlyphs()
                }, 500);

                
            },


            handleKeydown(e) {
                // ignore if cooldown
                if (this.clickCooldown) return;


                if (e.key == "ArrowLeft" || e.key == "a") {
                    this.checkAnswer(0)
                }

                else if (e.key == "ArrowDown" || e.key == "s") {
                    this.checkAnswer(1)
                }

                else if (e.key == "ArrowRight" || e.key == "d") {
                    this.checkAnswer(2)
                }


                // set cooldown
                this.clickCooldown = true;
                setTimeout(() => {
                    this.clickCooldown = false;
                }, 500);
            },
        },

    }




    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }

</script>


<style scoped>
    header {
        padding: 10px 100px;
        border-bottom: 1px solid #ddd;
        background-color: #00ace6;
        background-color: #fff;
        box-shadow: 0px 0px 10px #eee;
        background-color: #fcfcfc;
    }

    h1 {
        font-size: 37px;
        color: #444;
    }


    .sortWrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 50px;
        border-radius: 15px;
        background-color: #fcfcfc;
        box-shadow: 0px 0px 15px #eee;
        border: 3px solid #999;
        max-width: 500px;
        margin: 0 auto;
        margin-top: 6%;
        padding: 30px 40px;
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