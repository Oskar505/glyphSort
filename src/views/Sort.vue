<template>
    <header-bar h1Text='Evaluate' :activeBtn="1" :selectedGlyphs="glyphSetIds" :showNav="false"></header-bar>

    <main>
        <section v-show="glyphSets.length > 0">
            <div class="sortWrapper">
                
                    <div class="glyphCardWrapper">
                        <glyph-card :value="img1" :rotationValue="rotationValue1" :class="animationClass" :isLoading="isLoading"></glyph-card>
                        <glyph-card :value="img2" :rotationValue="rotationValue2" :class="animationClass" :isLoading="isLoading"></glyph-card>

                        <loader :sort="true" v-if="isLoading"></loader>
                    </div>


                <div class="answerBtnWrapper" v-if="btnsOrder === 0">
                    <div class="answerBtn" :class="btn0Feedback" @click="checkAnswer(0, glyphSets[pickedSet], false)">
                        <p>></p>
                    </div>

                    <div class="answerBtn" :class="btn1Feedback" @click="checkAnswer(1, glyphSets[pickedSet], false)">
                        <p>=</p>
                    </div>

                    <div class="answerBtn" :class="btn2Feedback" @click="checkAnswer(2, glyphSets[pickedSet], false)">
                        <p><</p>
                    </div>
                </div>

                <div class="answerBtnWrapper" v-if="btnsOrder === 1">
                    <div class="answerBtn" :class="btn0Feedback" @click="checkAnswer(0, glyphSets[pickedSet], true)">
                        <p><</p>
                    </div>

                    <div class="answerBtn" :class="btn1Feedback" @click="checkAnswer(1, glyphSets[pickedSet], true)">
                        <p>=</p>
                    </div>

                    <div class="answerBtn" :class="btn2Feedback" @click="checkAnswer(2, glyphSets[pickedSet], true)">
                        <p>></p>
                    </div>
                </div>
            </div>

            <div class="finishedWrapper">
                <div class="finishedBtn btn" @click="this.$router.push({path:'/results', query: {glyphSetIds: JSON.stringify(glyphSetIds)}})">
                    Finished
                </div>
            </div>
            


            <!-- <glyph-set-info :glyphSet="glyphSets[pickedSet]" :live="true" style="margin-top: 6%;" v-if="glyphSets[pickedSet]"/> -->
        </section>



        <section class="log" id="log" v-if="showLog">

        </section>
        

        
        <section class="middlePageWarning" v-if="glyphSets.length == 0">
            <h1>No set selected</h1>
            <h2>Select it on the <router-link to="/">home page</router-link></h2>
        </section>
    </main>
</template>


<script>
    import GlyphSet from '../GlyphSetClass.js'
    import { toRaw } from 'vue'


    export default {
        data() {
            return {
                glyphSets: [],
                glyphSetIds: [],
                pickedSet: 0,
                animationClass: '',

                distance: undefined,
                val1: 0,
                val2: 0,

                img1: '',
                img2: '',

                btnsOrder: 0,

                rotation: false,
                rotationValue1: 0,
                rotationValue2: 0,

                lastCorrect: true,

                isLoading: true,

                btn0Feedback: '',
                btn1Feedback: '',
                btn2Feedback: '',
                borderFeedback: '',

                log: [],
                showLog: false,

                newGlyphTimestamp: 0,
            }
        },



        async mounted() {
            this.isLoading = true


            window.addEventListener('keydown', this.handleKeydown)


            // get glyph sets
            const allGlyphSetIds = localStorage.getItem("glyphSetList") ? JSON.parse(localStorage.getItem("glyphSetList")) : [];
            const glyphSetIds = this.$route.query.glyphSetIds ? JSON.parse(this.$route.query.glyphSetIds) : []

            glyphSetIds.forEach((setId, index) => {
                if (!allGlyphSetIds.includes(setId)) {
                    glyphSetIds.splice(index, 1)
                }
            })
            


            for (const id of glyphSetIds) {
                let newGlyphSet = new GlyphSet(id);
                await newGlyphSet.init();

                this.glyphSets.push(newGlyphSet);
            }


            let glyphSets = toRaw(this.glyphSets)

            logMessage(`Testing ${glyphSets.length} sets`)


            // get sets data
            if (glyphSets.length > 0) {
                this.glyphSetIds = glyphSets.map(glyphSet => glyphSet.id)

                let newGlyphData = await glyphSets[0].getGlyphPair(undefined, true, false)

                this.val1 = newGlyphData.val1
                this.val2 = newGlyphData.val2
                this.rotation = newGlyphData.rotation
                this.rotationValue1 = newGlyphData.rotationValue1
                this.rotationValue2 = newGlyphData.rotationValue2

                let pickedSet = glyphSets[this.pickedSet]

                let index1 = pickedSet.getClosestIndex(this.val1)
                let index2 = pickedSet.getClosestIndex(this.val2)

                this.img1 = await pickedSet.decodeGlyph(pickedSet.glyphs[index1])
                this.img2 = await pickedSet.decodeGlyph(pickedSet.glyphs[index2])


                this.newGlyphTimestamp = Date.now()

                // get stats
                glyphSets[0].getStats()
            }


            // btns order
            this.btnsOrder = Number(this.$getCookie('sortingBtnsOrder')) ? Number(this.$getCookie('sortingBtnsOrder')) : 0
            


            this.isLoading = false
        },

        beforeUnmount() {
            window.removeEventListener('keydown', this.handleKeydown)
        },



        methods: {
            checkAnswer(buttonId, glyphSet, inverted) {
                let correct = false
                let logBtnId
                let equalValues = this.val1 == this.val2


                // check
                if (inverted) {
                    if (buttonId == 0) {
                        correct = this.val1 < this.val2

                        // show neutral feedback
                        this.btn0Feedback = "neutralBtn"
                        this.borderFeedback = "neutralBorder"

                        logBtnId = "<"
                    }

                    else if (buttonId == 1) {
                        correct = this.val1 == this.val2

                        // show neutral feedback
                        this.btn1Feedback = "neutralBtn"
                        this.borderFeedback = "neutralBorder"

                        logBtnId = "="
                    }

                    else if (buttonId == 2) {
                        correct = this.val1 > this.val2

                        // show neutral feedback
                        this.btn2Feedback = "neutralBtn"
                        this.borderFeedback = "neutralBorder"

                        logBtnId = ">"
                    }
                }


                else {
                    if (buttonId == 0) {
                        correct = this.val1 > this.val2

                        // show neutral feedback
                        this.btn0Feedback = "neutralBtn"
                        this.borderFeedback = "neutralBorder"

                        logBtnId = ">"
                    }

                    else if (buttonId == 1) {
                        correct = this.val1 == this.val2

                        // show neutral feedback
                        this.btn1Feedback = "neutralBtn"
                        this.borderFeedback = "neutralBorder"

                        logBtnId = "="
                    }

                    else if (buttonId == 2) {
                        correct = this.val1 < this.val2

                        // show neutral feedback
                        this.btn2Feedback = "neutralBtn"
                        this.borderFeedback = "neutralBorder"
                        logBtnId = "<"
                    }
                }
                
                console.log(glyphSet.actualDistance)

                

                // Save new answer
                let answerData = {
                    "val1": this.val1,
                    "val2": this.val2,
                    "btnId": logBtnId,
                    "correct": correct,
                    'distance': glyphSet.actualDistance,
                    "time": Date.now() - this.newGlyphTimestamp,
                    "rotation": this.rotation,
                    "rotationValue1": this.rotationValue1,
                    "rotationValue2": this.rotationValue2
                }

                console.log(this.val1, parseFloat((this.val1 / glyphSet.glyphStepsCount * 100).toFixed(2)), parseFloat((this.val1 / glyphSet.glyphStepsCount * 100)))
                console.log(glyphSet.glyphStepsCount)
                console.log(answerData)


                glyphSet.addAnswer(answerData)


                glyphSet.getStats()

                this.animationClass = 'newGlyphs'


                logMessage(`ANSWER: ${glyphSet.id} – ${glyphSet.actualDistance.toFixed(2)} (${this.val1.toFixed(2)} – ${this.val2.toFixed(2)}) – button: ${logBtnId} – ${correct ? '✓' : '✗'}`)


                // reset feedbacks and get new glyphs
                setTimeout(async () => {
                    this.btn0Feedback = ''
                    this.btn1Feedback = ''
                    this.btn2Feedback = ''
                    this.borderFeedback = ''


                    // Select a new set
                    this.pickedSet = getRandomInt(0, this.glyphSets.length -1)
                    let newGlyphSet = toRaw(this.glyphSets[this.pickedSet])

                    let lastCorrect
                    let distance

                    try {
                        if (newGlyphSet.answers.length == 0) {
                            distance = undefined
                            lastCorrect = true
                        }

                        else {
                            distance = newGlyphSet.answers[newGlyphSet.answers.length - 1].distance
                            lastCorrect = newGlyphSet.answers[newGlyphSet.answers.length - 1].correct
                        }
                    }

                    catch (error) {
                        distance = undefined
                        lastCorrect = true

                        console.error('Could not get last correct and distance from new glyph set', error)
                    }
                    

                    let newGlyphData = await newGlyphSet.getGlyphPair(distance, lastCorrect, equalValues)

                    this.val1 = newGlyphData.val1
                    this.val2 = newGlyphData.val2
                    this.rotation = newGlyphData.rotation
                    this.rotationValue1 = newGlyphData.rotationValue1
                    this.rotationValue2 = newGlyphData.rotationValue2

                    let index1 = newGlyphSet.getClosestIndex(this.val1)
                    let index2 = newGlyphSet.getClosestIndex(this.val2)

                    console.log(index1, index2)

                    this.img1 = await newGlyphSet.decodeGlyph(newGlyphSet.glyphs[index1])
                    this.img2 = await newGlyphSet.decodeGlyph(newGlyphSet.glyphs[index2])


                    this.newGlyphTimestamp = Date.now()

                    this.animationClass = ''
                }, 500);
            },


            handleKeydown(e) {
                // toggle log
                if (e.shiftKey && e.key == "L") {
                    this.showLog = !this.showLog
                    console.log(this.showLog)
                }



                // ignore if cooldown
                if (this.clickCooldown) return;

                if (this.btnsOrder === 0) {
                    if (e.key == "ArrowLeft" || e.key == "a") {
                        this.checkAnswer(0, this.glyphSets[this.pickedSet], false)
                    }

                    else if (e.key == "ArrowDown" || e.key == "s") {
                        this.checkAnswer(1, this.glyphSets[this.pickedSet], false)
                    }

                    else if (e.key == "ArrowRight" || e.key == "d") {
                        this.checkAnswer(2, this.glyphSets[this.pickedSet], false)
                    }
                }


                else {
                    if (e.key == "ArrowLeft" || e.key == "a") {
                        this.checkAnswer(0, this.glyphSets[this.pickedSet], true)
                    }

                    else if (e.key == "ArrowDown" || e.key == "s") {
                        this.checkAnswer(1, this.glyphSets[this.pickedSet], true)
                    }

                    else if (e.key == "ArrowRight" || e.key == "d") {
                        this.checkAnswer(2, this.glyphSets[this.pickedSet], true)
                    }
                }
                


                // set cooldown
                this.clickCooldown = true;
                setTimeout(() => {
                    this.clickCooldown = false;
                }, 500);
            },


            clearStorage() {
                console.info("clearing storage");

                localStorage.clear();
                sessionStorage.clear();
            },
        },

    }



    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }


    export function logMessage(message) {
        let logEl = document.getElementById("log")

        if (logEl == null) return


        const currentTime = new Date()
        const timeString = currentTime.getHours().toString().padStart(2, '0') + ":" + 
            currentTime.getMinutes().toString().padStart(2, '0') + ":" + 
            currentTime.getSeconds().toString().padStart(2, '0');
        
        let newLine = document.createElement("div")

        if (message == '-') {
            newLine.textContent = '–––––––––'
        }

        else {
            newLine.textContent = `[${timeString}] ${message}`
        }
        
        logEl.appendChild(newLine)


        logEl.scrollTop = logEl.scrollHeight
    }

    
</script>


<style scoped>
    main {
       max-width: 70rem;
       width: 100%;
       margin: 0 auto;
       margin-top: 5.4rem;
       display: flex;
       flex-direction: column;
       align-items: center;
    }


    .sortWrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 4rem;
        border-radius: 1.5rem;
        background-color: var(--element-bg);
        margin-top: 13%;
        padding: 5rem 9rem;
        user-select: none;

        background-color: white;
    }

    .glyphCardWrapper {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 10rem;
    }

    .answerBtnWrapper {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 4rem;
    }


    .answerBtn {
        font-size: 4.5rem;
        font-weight: 500;
        border: 0.3rem solid #444;
        color: #444;
        padding: 0 2.5rem;
        border-radius: 1.5rem;
        background-color: #fcfcfc;
        cursor: pointer;
    }



    .finishedWrapper {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-end;
        margin: 3rem 0rem;
    }

    .finishedBtn {
        font-size: 2.5rem;
        font-weight: 500;
        border: 0.2rem solid var(--text2);
        color: var(--text2);
        padding: 0.2rem 1.3rem;
        border-radius: 1rem;
        background-color: var(--element-bg);
        cursor: pointer;
    }






    .log{
        background-color: var(--element-bg);
        padding: 1rem;
        border-radius: 1.5rem;
        color: var(--text);
        font-size: 1.7rem;
        min-height: 20rem;
        max-height: 30rem;
        width: 80rem;
        overflow-y: scroll;
        border: 0.3rem solid var(--border2);
        margin-top: 5rem;
    }

    

    /* Animations */

    @keyframes correctBtnKeyframe {
        0% {
            background-color: transparent;
            border: 0.3rem solid var(--text)
        }

        50% {
            background-color: #2dba3a;
            border: 0.3rem solid #279f33;
        }

        100% {
            background-color: transparent;
            border: 0.3rem solid var(--text)
        }
    }

    @keyframes wrongBtnKeyframe {
        0% {
            background-color: transparent;
            border: 0.3rem solid var(--text)
        }

        50% {
            background-color: #ff0000;
            border: 0.3rem solid #ae0000;
        }

        100% {
            background-color: transparent;
            border: 0.3rem solid var(--text)
        }
    }


    @keyframes neutralBtnKeyframe {
        0% {
            background-color: transparent;
            border: 0.3rem solid #444
        }

        50% {
            background-color: var(--enabled);
            border: 0.3rem solid var(--enabled);
        }

        100% {
            background-color: transparent;
            border: 0.3rem solid #444
        }
    }


    @keyframes correctBorderKeyframe {
        0% {
            border: 0.3rem solid var(--border2)
        }

        50% {
            border: 0.4rem solid #2dba3a;
        }

        100% {
            border: 0.3rem solid var(--border2)
        }
    }

    @keyframes wrongBorderKeyframe {
        0% {
            border: 0.3rem solid var(--border2)
        }

        50% {
            border: 0.4rem solid #ff0000;
        }

        100% {
            border: 0.3rem solid var(--border2)
        }
    }


    @keyframes neutralBorderKeyframe {
        0% {
            border: 0.3rem solid var(--border2)
        }

        50% {
            border: 0.3rem solid var(--enabled);
        }

        100% {
            border: 0.3rem solid var(--border2)
        }
    }



    @keyframes newGlyphPairKeyFrame {
        0% {
            transform: scale(1);
        }

        50% {
            transform: scale(1.1);
        }

        100% {
            transform: scale(1);
        }
    }





    .correctBtn {
        animation: correctBtnKeyframe 500ms ease-in;
    }

    .wrongBtn {
        animation: wrongBtnKeyframe 500ms ease-in;
    }

    .neutralBtn {
        animation: neutralBtnKeyframe 500ms ease-in;
    }


    .correctBorder {
        animation: correctBorderKeyframe 500ms ease-in;
        background-color: var(--element-bg) !important;
    }
    
    .wrongBorder {
        animation: wrongBorderKeyframe 500ms ease-in;
        background-color: var(--element-bg) !important;
    }

    .neutralBorder {
        animation: neutralBorderKeyframe 500ms ease-in;
        background-color: #fff !important;
    }


    .newGlyphs {
        animation: newGlyphPairKeyFrame 400ms ease-in;
    }



    .fade2-enter-active,
    .fade2-leave-active {
        transition: opacity 3s ease;
    }

    .fade2-enter-from,
    .fade2-leave-to {
        opacity: 0;
    }






    @media only screen and (max-width: 600px) {
        .sortWrapper {
            padding: 2rem 5rem;
            gap: 3rem;
        }
    }
</style>