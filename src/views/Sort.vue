<template>
    <header>
        <h1 @click="clearStorage()">Sort</h1>

        <nav>
            <div @click="this.$router.push({path:'/', query: {glyphSetIds: JSON.stringify(selectedGlyphs)}})"><h2>Home</h2></div>
            <div @click="this.$router.push({path:'/sort', query: {glyphSetIds: JSON.stringify(glyphSetIds)}})"><h2 class="navActive">Sort</h2></div>
            <div @click="this.$router.push({path:'/results', query: {glyphSetIds: JSON.stringify(glyphSetIds)}})"><h2>Results</h2></div>
            <div @click="this.$router.push({path:'/calibration', query: {glyphSetIds: JSON.stringify(selectedGlyphs)}})" class="secondaryNavBtn"><svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#666"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg></div>
        </nav>
    </header>

    <main>
        <section v-show="glyphSets.length > 0">
            <div class="sortWrapper" :class="borderFeedback">
                <div class="glyphCardWrapper">
                    <glyph-card :value="img1" :class="animationClass"></glyph-card>
                    <glyph-card :value="img2" :class="animationClass"></glyph-card>
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


            <!-- <glyph-set-info :glyphSet="glyphSets[pickedSet]" :live="true" style="margin-top: 6%;" v-if="glyphSets[pickedSet]"/> -->
        </section>
        

        
        <section class="middlePageWarning" v-if="glyphSets.length == 0">
            <h1>No set selected</h1>
            <h2>Select set on the <a href="/">home page</a></h2>
        </section>
    </main>


    <div class="floatingBtn" @click="this.$router.push({path:'/results', query: {glyphSetIds: JSON.stringify(glyphSetIds)}})">
        <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#444"><path d="M662.82-440.39H145.87v-79.22h516.95L423.87-758.57 480-814.7 814.7-480 480-145.87l-56.13-55.56 238.95-238.96Z"/></svg>
    </div>
    
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

                glyphName: "a",
                distance: undefined,
                val1: 0,
                val2: 0,

                img1: '',
                img2: '',

                btnsOrder: 0,

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



        async mounted() {
            window.addEventListener('keydown', this.handleKeydown)


            // get glyph sets
            console.log(this.$route.query.glyphSetIds + ' test')
            let setIds = this.$route.query.glyphSetIds ? JSON.parse(this.$route.query.glyphSetIds) : []
            console.log(setIds);  // ["Cool line"]

            // let setIds = JSON.parse(JSON.stringify(this.glyphSetStore.glyphSets))

            console.log(setIds)
            
            for (const id of setIds) {
                let newGlyphSet = new GlyphSet(id);
                await newGlyphSet.init();

                console.log(newGlyphSet)

                this.glyphSets.push(newGlyphSet);
            }


            console.log(this.glyphSets)

            let glyphSets = toRaw(this.glyphSets)

            console.log(glyphSets, 'test')

            // get sets data
            if (glyphSets.length > 0) {
                this.glyphSetIds = glyphSets.map(glyphSet => glyphSet.id)
                let newGlyphData = await glyphSets[0].getGlyphPair(undefined, true)
                this.distance = newGlyphData.distance
                this.val1 = newGlyphData.val1
                this.val2 = newGlyphData.val2

                let pickedSet = glyphSets[this.pickedSet]


                this.img1 = await pickedSet.decodeGlyph(pickedSet.glyphs[this.val1])
                this.img2 = await pickedSet.decodeGlyph(pickedSet.glyphs[this.val2])

                // get stats
                glyphSets[0].getStats()

                console.log(glyphSets[this.pickedSet])
            }


            // btns order
            this.btnsOrder = Number(this.$getCookie('sortingBtnsOrder')) ? Number(this.$getCookie('sortingBtnsOrder')) : 0
            
        },

        beforeUnmount() {
            window.removeEventListener('keydown', this.handleKeydown)
        },



        methods: {
            checkAnswer(buttonId, glyphSet, inverted) {
                // check
                if (inverted) {
                    if (buttonId == 0) {
                        this.lastCorrect = this.val1 < this.val2

                        // show neutral feedback
                        this.btn0Feedback = "neutralBtn"
                        this.borderFeedback = "neutralBorder"
                    }

                    else if (buttonId == 1) {
                        this.lastCorrect = this.val1 == this.val2

                        // show neutral feedback
                        this.btn1Feedback = "neutralBtn"
                        this.borderFeedback = "neutralBorder"
                    }

                    else if (buttonId == 2) {
                        this.lastCorrect = this.val1 > this.val2

                        // show neutral feedback
                        this.btn2Feedback = "neutralBtn"
                        this.borderFeedback = "neutralBorder"
                    }
                }


                else {
                    if (buttonId == 0) {
                        this.lastCorrect = this.val1 > this.val2

                        // show neutral feedback
                        this.btn0Feedback = "neutralBtn"
                        this.borderFeedback = "neutralBorder"
                    }

                    else if (buttonId == 1) {
                        this.lastCorrect = this.val1 == this.val2

                        // show neutral feedback
                        this.btn1Feedback = "neutralBtn"
                        this.borderFeedback = "neutralBorder"
                    }

                    else if (buttonId == 2) {
                        this.lastCorrect = this.val1 < this.val2

                        // show neutral feedback
                        this.btn2Feedback = "neutralBtn"
                        this.borderFeedback = "neutralBorder"
                    }
                }
                
                console.log(this.lastCorrect, inverted)


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

                this.animationClass = 'newGlyphs'


                // reset feedbacks and get new glyphs
                setTimeout(async () => {
                    this.btn0Feedback = ''
                    this.btn1Feedback = ''
                    this.btn2Feedback = ''
                    this.borderFeedback = ''


                    // this.newGlyphs()

                    let newGlyphData = await glyphSet.getGlyphPair(this.distance, this.lastCorrect)
                    this.distance = newGlyphData.distance
                    this.val1 = newGlyphData.val1
                    this.val2 = newGlyphData.val2

                    let pickedSet = this.glyphSets[this.pickedSet]

                    this.img1 = await pickedSet.decodeGlyph(pickedSet.glyphs[this.val1])
                    this.img2 = await pickedSet.decodeGlyph(pickedSet.glyphs[this.val2])

                    this.animationClass = ''
                }, 500);
            },


            handleKeydown(e) {
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
                console.log("clearing storage");

                localStorage.clear();
                sessionStorage.clear();
            },
        },

    }
</script>


<style scoped>
    main {
       max-width: 700px;
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
        padding: 50px 90px;
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
        transition: 0.3s ease;
    }

    .floatingBtn:hover {
        border-color: #4a90e2;
        background-color: #4a90e2;
        transition: 0.3s ease;
    }

    .floatingBtn:hover svg{
        fill: #fff;
        transition: 0.3s ease;
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


    @keyframes neutralBtnKeyframe {
        0% {
            background-color: transparent;
            border: 3px solid #444
        }

        50% {
            background-color: #4a90e2;
            border: 3px solid #4a90e2;
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


    @keyframes neutralBorderKeyframe {
        0% {
            border: 3px solid #999
        }

        50% {
            border: 3px solid #4a90e2;
        }

        100% {
            border: 3px solid #999
        }
    }



    @keyframes newGlyphPairKeyFrame {
        0% {
            transform: scale(1);
        }

        50% {
            transform: scale(1.05);
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
        background-color: #fcfcfc !important;
    }
    
    .wrongBorder {
        animation: wrongBorderKeyframe 500ms ease-in;
        background-color: #fcfcfc !important;
    }

    .neutralBorder {
        animation: neutralBorderKeyframe 500ms ease-in;
        background-color: #fcfcfc !important;
    }


    .newGlyphs {
        animation: newGlyphPairKeyFrame 400ms ease-in;
    }
</style>