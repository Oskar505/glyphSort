<template>
    <header-bar :activeBtn="0" :selectedGlyphs="selectedGlyphs"></header-bar>


    <section class="pickSets" v-if="glyphSetList.length > 0">
        <div class="savedSetsWrapper" :class="glyphSetList.length == 1 ? 'smallSavedSetsWrapper' : ''">
            <div class="setPreviewWrapper" v-for="(glyphSet, index) in glyphSetList" :key="glyphSet.id" @click="handleSetSelection(glyphSet.id)" :class="selectedGlyphs.includes(glyphSet.id) ? 'selected' : 'notSelected'">
                <h2>{{ glyphSet.name }}</h2>
                <h3>{{ glyphSet.id }}</h3>


                <div class="infoContent">
                    <div class="infoWrapper">
                        <div>
                            <p class="info"><span class="lessImportant">Author: </span>{{ glyphSet.author }}</p>
                            <p class="info"><span class="lessImportant">Image count: </span>{{ glyphSet.glyphs.length }}</p>
                            <p class="info"><span class="lessImportant">Version: </span>{{ glyphSet.version }}</p>
                        </div>
                        

                        <div class="setBtnWrapper">
                            <svg class="deleteBtn" @click.stop="deleteSet(glyphSet)" xmlns="http://www.w3.org/2000/svg" height="2.8rem" viewBox="0 -960 960 960" width="2.8rem" fill="var(--text)">
                                <title>Delete set</title>
                                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                            </svg>

                            <svg :class="glyphSet.data.answers.length == 0 ? 'disabledBtn' : 'deleteBtn'" @click.stop="glyphSet.deleteAnswers()" xmlns="http://www.w3.org/2000/svg" height="2.8rem" viewBox="0 -960 960 960" width="2.8rem" fill="var(--text)">
                                <title>Delete answers</title>
                                <path d="M240-800v200-200 640-9.5 9.5-640Zm0 720q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v174q-19-7-39-10.5t-41-3.5v-120H520v-200H240v640h254q8 23 20 43t28 37H240Zm396-20-56-56 84-84-84-84 56-56 84 84 84-84 56 56-83 84 83 84-56 56-84-83-84 83Z"/>
                            </svg>

                            <svg :class="glyphSet.data.answers.length == 0 ? 'disabledBtn' : 'normalBtnOff'" @click.stop="glyphSet.downloadAnswers()" xmlns="http://www.w3.org/2000/svg" height="2.8rem" viewBox="0 -960 960 960" width="2.8rem" fill="var(--text)">
                                <title>Download answers</title>
                                <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/>
                            </svg>
                        </div>
                    </div>

                    <img :src="previewImages[index]" alt="preview image" class="previewImage">
                </div>
            </div>
            

            <div class="centerFileInput" :class="glyphSetList.length == 1 ? 'rightFileInput' : 'centerFileInput'">
                <file-input class="fileInput" @setSaved="reloadSets"/>
            </div>
        </div>
        

        
    </section>


    <section class="middlePageWarning" v-if="glyphSetList.length == 0">
        <h1>Nothing's here yet!</h1>
        <h2>Import your sets below.</h2>

        <file-input class="fileInput" @setSaved="reloadSets"/>
    </section>


    
    
    <div class="floatingBtnWrapper" @mouseover="floatingBtnHover = true; canFloat = true" @mouseleave="floatingBtnHover = false">
        <transition name="fade">
            <div class="floatingBtn" 
                v-show="JSON.parse(JSON.stringify(selectedGlyphs.length)) > 0" 
                @click="handleFloatingBtnClick(selectedGlyphs)"
            >
                <svg xmlns="http://www.w3.org/2000/svg" height="4rem" viewBox="0 -960 960 960" width="4rem" fill="var(--text)"><path d="M662.82-440.39H145.87v-79.22h516.95L423.87-758.57 480-814.7 814.7-480 480-145.87l-56.13-55.56 238.95-238.96Z"/></svg>
            </div>
        </transition>

        <transition name="fade">
            <div class="rotationSelect" v-show="floatingBtnHover && JSON.parse(JSON.stringify(selectedGlyphs.length)) > 0">
                <div class="rotationChoice" :class="rotationMode === 1 ? 'choiceSelected' : ''" @click="toggleRotationModes(1)">Rotate</div>
                <div class="rotationChoice" :class="rotationMode === 2 ? 'choiceSelected' : ''" @click="toggleRotationModes(2)">Rotate 180°</div>
                <div class="rotationChoice" :class="rotationMode === 3 ? 'choiceSelected' : ''" @click="toggleRotationModes(3)">Rotate same</div>
            </div>
        </transition>
    </div>
</template>



<script>
    import GlyphSet from '../GlyphSetClass.js'
    import pako from 'pako'


    export default {
        data() {
            return {
                setIdList: [],
                glyphSetList: [],
                selectedGlyphs: [],
                previewImages: [],
                rotationHover: false,
                floatingBtnHover: false,
                floatingBtnClicks: 0,
                rotationMode: 0,
            }
        },

        methods: {
            async getSavedSets() {
                this.setIdList = localStorage.getItem("glyphSetList") ? JSON.parse(localStorage.getItem("glyphSetList")) : [];
                this.glyphSetList = []


                this.setIdList.forEach(async glyphSetId => {
                    try {
                        let glyphSet = new GlyphSet(glyphSetId)
                        await glyphSet.init()

                        this.glyphSetList.push(glyphSet)
                        await glyphSet.getStats()

                        let previewImage = await glyphSet.decodeGlyph(glyphSet.glyphs[glyphSet.glyphs.length - 1])

                        if (!this.previewImages.includes(previewImage)) {
                            this.previewImages.push(previewImage)
                        }


                        // get rotation settings
                        if (this.selectedGlyphs.includes(glyphSetId)) {
                            this.rotationMode = glyphSet.rotation
                        }
                    }


                    catch (error) {
                        console.error(error)
                    } 
                })
            },


            getDecodedImage(glyphSet) {
                let compressedImage = glyphSet.glyphs[glyphSet.glyphs.length - 1];

                let compressedBinary = Uint8Array.from(atob(compressedImage), c => c.charCodeAt(0)); // Base64 to binary
                let decompressedBinary = pako.ungzip(compressedBinary); // decompress
                let base64Image = btoa(String.fromCharCode(...decompressedBinary)); // back to Base64

                return `data:image/png;base64,${base64Image}`
            },


            goToSort(pickedSets) {
                this.$router.push({path:'/sort', query: {setIds: JSON.stringify(pickedSets)}})
            },


            handleSetSelection(setId) {
                this.selectedGlyphs = JSON.parse(JSON.stringify(this.selectedGlyphs))


                if (this.selectedGlyphs.includes(setId)) {
                    this.selectedGlyphs.splice(this.selectedGlyphs.indexOf(setId), 1)
                } 
                
                else {
                    this.selectedGlyphs.push(setId)
                }
            },


            deleteSet(glyphSet) {
                let setId = glyphSet.id

                localStorage.removeItem(setId)

                this.setIdList = localStorage.getItem("glyphSetList") ? JSON.parse(localStorage.getItem("glyphSetList")) : [];
                this.setIdList.splice(this.setIdList.indexOf(setId), 1)
                localStorage.setItem("glyphSetList", JSON.stringify(this.setIdList))

                glyphSet.deleteFromIndexedDB()

                this.getSavedSets()
                
                // remove from selected
                this.selectedGlyphs = JSON.parse(JSON.stringify(this.selectedGlyphs))
                this.selectedGlyphs.splice(this.selectedGlyphs.indexOf(setId), 1)
            },


            deleteAnswers(glyphSet) {
                glyphSet.deleteAnswers()
            },


            reloadSets() {
                this.setIdList = localStorage.getItem("glyphSetList") ? JSON.parse(localStorage.getItem("glyphSetList")) : [];

                this.getSavedSets()
            },


            toggleRotationModes(mode) {
                if (this.rotationMode === mode) {
                    this.rotationMode = 0
                }

                else {
                    this.rotationMode = mode
                }
                
                console.log(this.rotationMode)

                this.glyphSetList.forEach(glyphSet => {
                    glyphSet.toggleRotation(this.rotationMode)
                })
            },



            handleFloatingBtnClick(selectedGlyphs) {
                // if (this.floatingBtnClicks = 1) {
                //     console.log('true')
                //     this.$router.push({path:'/sort', query: {glyphSetIds: JSON.stringify(selectedGlyphs)}})
                //     this.floatingBtnClicks = 0
                // }

                // else {
                //     console.log('false')
                //     this.floatingBtnHover = true
                //     this.floatingBtnClicks = 1
                // }

                
                this.$router.push({path:'/sort', query: {glyphSetIds: JSON.stringify(selectedGlyphs)}})
            }
        },



        mounted() {
            this.setIdList = localStorage.getItem("glyphSetList") ? JSON.parse(localStorage.getItem("glyphSetList")) : [];
            

            // selected sets
            this.selectedGlyphs = this.$route.query.glyphSetIds ? JSON.parse(this.$route.query.glyphSetIds) : []

            this.selectedGlyphs.forEach((setId, index) => {
                if (!this.setIdList.includes(setId)) {
                    this.selectedGlyphs.splice(index, 1)
                }
            })



            this.getSavedSets()
        }
    }
</script>



<style scoped>
    .pickSets {
        display: flex;
        flex-direction: row;
        align-items: start;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8rem;
        width: 95%;
        max-width: 1824px;
        margin: 0 auto;
    }

    .savedSetsWrapper {
        flex: 4;
        display: grid;
        gap: 3rem;
        justify-items: center;
        grid-template-columns: repeat(3, 1fr);
        grid-template-columns: repeat(auto-fit, minmax(45.5rem, 1fr));
    }

    .smallSavedSetsWrapper {
        grid-template-columns: repeat(auto-fit, 1fr);
        max-width: 112rem;
    }

    .setPreviewWrapper {
        width: 100%;
        width: clamp(43rem, 100%, 52rem);
        max-width: 55rem;
        border-radius: 1.5rem;
        background-color: var(--element-bg);
        box-shadow: 0px 0px 1.5rem var(--shadow2);
        border: 0.3rem solid var(--border2);
        padding: 0.5rem 1.5rem 1.5rem 1.5rem;
        flex: 1;
        cursor: pointer;
    }

    .centerFileInput {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .rightFileInput {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: center;
    }

    .infoContent {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        /* gap: 5rem; */
    }

    .setPreviewWrapper h2 {
        color: var(--text);
        font-size: 3rem;
        margin-left: -0.5rem;
    }

    .setPreviewWrapper h3 {
        color: var(--text);
        font-size: 2.5rem;
        font-weight: 500;
        margin-top: -0.3rem;
        margin-bottom: 1.5rem;
    }

    .infoWrapper {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 70%;
    }

    .info {
        color: var(--text);
        font-size: 2rem;
        font-weight: 500;
    }

    .lessImportant {
        font-weight: 400;
    }

    .previewImageWrapper {
        display: flex;
        width: 100%;
        height: 100%;
        justify-content: end;
    }

    .previewImage {
        width: 18rem;
        height: 18rem;
        border: 0.3rem solid var(--preview-img-border);
        border-radius: 1.5rem;
    }


    .setBtnWrapper {
        width: 40%;
        width: clamp(10rem, 37%, 12.5rem);
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .deleteBtn {
        cursor: pointer;
        transition: fill 0.3s ease;
    }

    .deleteBtn:hover {
        fill: red;
        transition: fill 0.3s ease;
    }


    .normalBtnOff {
        cursor: pointer;
        transition: fill 0.3s ease;
    }

    .normalBtnOn {
        cursor: pointer;
        transition: fill 0.3s ease;
        fill: var(--enabled);
    }

    .disabledBtn {
        cursor: not-allowed;
        fill: var(--border2);
    }

    .normalBtnOff:hover {
        fill: var(--enabled);
        transition: fill 0.3s ease;
    }

    .normalBtnOn:hover {
        fill: var(--text);
        transition: fill 0.3s ease;
    }


    .selected {
        border-color: var(--enabled);
        transition: border-color 0.4s ease;
    }

    .notSelected {
        border-color: var(--border2);
        transition: border-color 0.4s ease;
    }


    .floatingBtnWrapper {
        position: fixed;
        bottom: 6rem;
        right: 4rem;
        right: clamp(1rem, 3.2vw, 6rem);
        display: flex;
        flex-direction: column-reverse;
        align-items: center;
        gap: 1rem;
        width: 15.5rem;
        padding: 1rem;
        padding-bottom: 0;
    }

    .floatingBtn {
        border: 0.3rem solid var(--text);
        border-radius: 50%;
        padding: 0.7rem;
        cursor: pointer;
        transition: 0.2s;
        background-color: var(--element-bg);
        box-shadow: 0px 0px 1rem var(--shadow2);
        transition: 0.3s ease;
        width: 6rem;
    }

    .floatingBtn:hover {
        border-color: var(--enabled);
        background-color: var(--enabled);
        transition: 0.3s ease;
    }

    .floatingBtn:hover svg{
        fill: var(--page-bg);
        transition: 0.3s ease;
    }

    .rotationSelect {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .rotationChoice {
        border: 0.2rem solid var(--border3);
        border-radius: 10.2rem;
        padding: 0.5rem 0.8rem;
        cursor: pointer;
        font-size: 2rem;
        width: 100%;
        margin-bottom: 0.7rem;
        color: var(--text2);
        background-color: var(--element-bg);
        transition: border-color 0.3s ease, color 0.3s ease, font-weight 0.3s ease;
    }

    .choiceSelected {
        border-color: var(--enabled);
        color: var(--text);
        font-weight: 500;
        transition: border-color 0.3s ease, color 0.3s ease, font-weight 0.3s ease;
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.4s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }





    @media only screen and (max-width: 1600px) {
        
    }


    @media only screen and (max-width: 600px) {
        .pickSets{
            width: 83%;
        }

        .previewImage {
            width: 16rem;
            height: 16rem;
        }

        .floatingBtnWrapper {
            right: clamp(1rem, 2vw, 6rem);
        }
    }
</style>