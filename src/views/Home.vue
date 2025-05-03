<template>
    <header-bar :activeBtn="0" :selectedGlyphs="selectedGlyphs" dash=""></header-bar>


    <main>
        <section class="sidebar">
            <div class="sidebarPadding sidebarSettings">
                <h2>Jitter</h2>

                <div class="settings">
                    <div class="setting">
                        <p>Shift</p>
                        
                        <span class="inputAndUnit">
                            <input type="text" class="textInput">
                            <p>%</p>
                            <input type="checkbox" class="sidebarCheckbox">
                        </span>
                        
                    </div>

                    <div class="setting">
                        <p>Rotate</p>
                        
                        <span class="inputAndUnit">
                            <input type="text" class="textInput">
                            <p>°</p>
                            <input type="checkbox" class="sidebarCheckbox">
                        </span>
                        
                    </div>
                </div>



                <h2>Rotation</h2>

                <div class="settings">
                    <div class="setting">
                        <p>Rotate</p>
                        <input type="checkbox" class="sidebarCheckbox" @click="toggleRotationModes(1)" :checked="rotationMode === 1">
                    </div>

                    <div class="setting">
                        <p>Rotate 180°</p>
                        <input type="checkbox" class="sidebarCheckbox" @click="toggleRotationModes(2)" :checked="rotationMode === 2">
                    </div>

                    <div class="setting">
                        <p>Rotate same</p>
                        <input type="checkbox" class="sidebarCheckbox" @click="toggleRotationModes(3)" :checked="rotationMode === 3">
                    </div>
                </div>



                <h2>DPI Calibration</h2>

                <div class="settings">
                    <div class="setting">
                        <p>DPI value: {{ dpi !== null ? dpi : this.$getCookie('dpi') }}</p>
                        <svg class="calibrationBtn" @click="showCalibrationFunction()" xmlns="http://www.w3.org/2000/svg" height="2.8rem" viewBox="0 -960 960 960" width="2.8rem" style="fill: var(--text2);"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg>
                    </div>
                </div>
            </div>
            

            
            <div class="sidebarBtns">
                <div class="evalBtn btn" @click="handleFloatingBtnClick(selectedGlyphs)">Evaluate</div>

                <div class="splitter"></div>

                <div class="downloadBtn btn" @click="exportData(exportGlyphs)">Download data</div>
                <div class="downloadBtn deleteBtn" @click="showDeleteWarning = true">Clear data</div>
            </div>
        </section>




        <transition-group name="fade2" tag="section" class="pickSets savedSetsWrapper" v-if="glyphSetList.length > 0">
            <div class="setPreviewWrapper" v-for="(glyphSet, index) in glyphSetList" :key="glyphSet.id" @click="handleSetSelection(glyphSet.id)" :class="selectedGlyphs.includes(glyphSet.id) ? 'selected' : 'notSelected'">
                <div class="infoContent">
                    <img :src="previewImages[index]" alt="preview image" class="previewImage">


                    <div class="infoWrapper">
                        <h2>{{ glyphSet.name }}</h2>
                        <h3>{{ glyphSet.id }}</h3>

                        <div>
                            <p class="info"><span class="lessImportant">Author: </span>{{ glyphSet.author }}</p>
                            <p class="info"><span class="lessImportant">Version: </span>{{ glyphSet.version }}</p>
                            <p class="info"><span class="lessImportant">Image count: </span>{{ glyphSet.glyphs.length }}</p>
                        </div>
                    </div>


                    <div class="setBtnWrapper">
                        <svg class="deleteIcon" @click.stop="deleteSet(glyphSet)" xmlns="http://www.w3.org/2000/svg" height="3.5rem" viewBox="0 -960 960 960" width="3.5rem" fill="var(--text)">
                            <title>Delete set</title>
                            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                        </svg>
                    </div>
                </div>
            </div>
            
            

            <div class="centerFileInput" :class="glyphSetList.length == 1 ? 'rightFileInput' : 'centerFileInput'" key="fileInput">
                <file-input class="fileInput" @setSaved="reloadSets"/>
            </div>
        </transition-group>



        <transition name="modalFade">
            <div class="modalWrapper" v-if="showCalibration">
                <div class="modalBackdrop" @click="cancelCalibration()" key="backdrop"></div>

                <div class="calibrationWindow modal" key="modal">
                    <div class="instructions">
                        <h2>Calibration</h2>
                        <p><span class="strong">Adjust this rectangle to match your credit card.</span class="strong"> <br> If you don't have a credit card, use a ruler to measure the 1 inch square (2.54 cm).</p>
                    </div>

                    <div class="cardContainer">
                        <div class="card" :style="{width: `${cardWidth}px`, height: `${cardHeight}px`}">
                            <div class="inch" :style="{width: `${dpi}px`, height: `${dpi}px`}">
                                <p>1 inch</p>
                            </div>
                            <p class="cardWidth">{{ cardWidth.toFixed(0) }}px</p>
                        </div>
                    </div>

                    <div class="userInput">
                        <input type="range" id="slider" min="200" max="1800" step="10" :value=cardWidth @input="adjustWidth()">
                        <p class="dpiNum">DPI: {{ dpi }}</p>
                    </div>


                    <div class="modalBtnWrapper">
                        <div class="cancelBtn neutralBtn" @click="cancelCalibration()"><p>Cancel</p></div>
                        <div class="saveBtn btn" @click="showCalibration = false"><p>Save</p></div>
                    </div>
                </div>
            </div>
        </transition>


        <transition name="modalFade">
            <div class="modalWrapper" v-if="showDeleteWarning">
                <div class="modalBackdrop" @click="showDeleteWarning = false" key="backdrop"></div>

                <div class="deleteWarning modal" key="modal">
                    <h2>Clear Data or Delete Sets</h2>
                    <p>Do you want to clear evaluation data or delete all sets?</p>

                    <div class="warningBtnWrapper">
                        <div class="cancelBtn neutralBtn" @click="showDeleteWarning = false">Cancel</div>

                        <div class="deleteBtnWrapper">
                            <div class="deleteBtnAlert deleteBtn disabled" @click="clearStorage()">Clear evaluation data</div>
                            <div class="deleteBtnAlert deleteBtn" @click="clearStorage()">Delete all sets</div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </transition>
        
                    

        <section class="middlePageWarning" v-if="glyphSetList.length == 0">
            <h1>Nothing's here yet!</h1>
            <h2>Import your sets below.</h2>

            <file-input class="fileInput" @setSaved="reloadSets"/>
        </section>
    </main>



    <loader v-if="isLoading"></loader>
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

                isLoading: false,

                showCalibration: false,
                cardWidth: 300,
                cardHeight: 189.18,
                dpi: null,
                startDpi: null,

                showDeleteWarning: false,
            }
        },

        methods: {
            async getSavedSets() {
                this.setIdList = localStorage.getItem("glyphSetList") ? JSON.parse(localStorage.getItem("glyphSetList")) : [];
                this.glyphSetList = []


                let imageTest = []


                for (const glyphSetId of this.setIdList) {
                    try {
                        let glyphSet = new GlyphSet(glyphSetId)
                        await glyphSet.init()

                        this.glyphSetList.push(glyphSet)
                        await glyphSet.getStats()

                        console.log(glyphSet.glyphs[glyphSet.glyphs.length - 1])

                        let previewImage = await glyphSet.decodeGlyph(glyphSet.glyphs[glyphSet.glyphs.length - 1])

                        this.previewImages.push(previewImage)
                        imageTest.push(glyphSet.id)


                        // get rotation settings
                        if (this.selectedGlyphs.includes(glyphSetId)) {
                            this.rotationMode = glyphSet.rotation
                        }
                    }


                    catch (error) {
                        console.error(error)
                    } 
                }


                console.log(this.previewImages)
                console.log(imageTest)
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

                console.log(this.rotationMode)
            },



            handleFloatingBtnClick(selectedGlyphs) {
                if (matchMedia('(hover: hover)').matches || this.floatingBtnClicks == 1) {
                    console.log('true')
                    this.$router.push({path:'/sort', query: {glyphSetIds: JSON.stringify(selectedGlyphs)}})
                    this.floatingBtnClicks = 0
                }


                // on touchscreens
                else {
                    console.log('false')
                    this.floatingBtnHover = true
                    this.floatingBtnClicks = 1
                }
            },



            // CALIBRATION

            showCalibrationFunction() {
                this.showCalibration = true

                this.dpi = parseFloat(this.$getCookie('dpi')).toFixed(0)

                if (!this.dpi) {
                    this.dpi = 95
                }

                this.startDpi = this.dpi

                this.cardWidth = 3.375 * this.dpi
                this.cardHeight = this.cardWidth / 1.58577
            },

            adjustWidth() {
                let width = parseFloat(document.getElementById('slider').value)

                this.cardWidth = width
                this.cardHeight = width / 1.58577

                this.calculateDPI()
            },


            calculateDPI(saveCookie=true) {
                const pixelWidth = parseInt(this.cardWidth, 10); // digital widt in px
                const cardWidthCm = 8.56; // real width in cm

                // calculate DPI
                this.dpi = (pixelWidth / (cardWidthCm / 2.54)).toFixed(0);
                
                // save cokie
                if (saveCookie) {
                    document.cookie = `dpi=${this.dpi}; path=/; max-age=31536000; SameSite=Strict`;
                }
            },

            cancelCalibration() {
                this.showCalibration = false

                this.dpi = this.startDpi
                document.cookie = `dpi=${this.dpi}; path=/; max-age=31536000; SameSite=Strict`;
            },




            async exportData(exportGlyphs) {
                // Init DB
                this.db = await new Promise((resolve, reject) => {
                    let request = indexedDB.open("glyphSortDB", 2)
                    request.onupgradeneeded = (event) => {
                        let db = event.target.result
            
                        if (!db.objectStoreNames.contains("glyphSetStore")) {
                            let objectStore = db.createObjectStore("glyphSetStore", { keyPath: "id" })
                            objectStore.createIndex("setId", "id", { unique: false })
                        }
                    }
        
                    request.onsuccess = (event) => resolve(event.target.result)
                    request.onerror = (event) => reject(event.target.error)
                })



                // Get all data
                let data = await new Promise((resolve, reject) => {
                    let transaction = this.db.transaction("glyphSetStore", "readonly")
                    let objectStore = transaction.objectStore("glyphSetStore")
                    let getRequest = objectStore.getAll()
        
                    getRequest.onsuccess = (event) => resolve(event.target.result)
                    getRequest.onerror = (event) => reject(event.target.error)
                })


                // remove glyphs
                if (!exportGlyphs) {
                    data.forEach(glyphSet => {
                        glyphSet.glyphs = []
                    });
                }


                const jsonString = JSON.stringify(data, null, 4)
                const blob = new Blob([jsonString], { type: 'application/json' })
                const url = URL.createObjectURL(blob)

                const a = document.createElement('a')
                a.href = url
                a.download = 'glyphSortData.json'
                a.click()

                URL.revokeObjectURL(url)
            },


            async clearStorage() {
                localStorage.clear();
                sessionStorage.clear();


                let db = await new Promise((resolve, reject) => {
                    let request = indexedDB.open("glyphSortDB", 2);
                    request.onsuccess = (event) => resolve(event.target.result);
                    request.onerror = (event) => reject(event.target.error);
                });

                let transaction = db.transaction("glyphSetStore", "readwrite");
                let objectStore = transaction.objectStore("glyphSetStore");

                objectStore.clear();

                transaction.oncomplete = () => {
                    console.info("glyphSetStore cleared.");
                };

                transaction.onerror = (event) => {
                    console.error("Error clearing glyphSetStore:", event.target.error);
                };
            },
        },



        async mounted() {
            this.isLoading = true

            this.setIdList = localStorage.getItem("glyphSetList") ? JSON.parse(localStorage.getItem("glyphSetList")) : [];
            

            // selected sets
            this.selectedGlyphs = this.$route.query.glyphSetIds ? JSON.parse(this.$route.query.glyphSetIds) : []

            this.selectedGlyphs.forEach((setId, index) => {
                if (!this.setIdList.includes(setId)) {
                    this.selectedGlyphs.splice(index, 1)
                }
            })



            await this.getSavedSets()

            this.isLoading = false
        }
    }
</script>



<style scoped>
    main {
        display: flex;
        flex-direction: row;
        margin-top: 5.4rem;
        position: relative;
    }


    .sidebar {
        width: 30rem;
        border-right: 0.1rem solid var(--border2);
        background-color: var(--element-bg);
        height: calc(100dvh - 5.4rem);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: fixed;
        z-index: 10;
    }

    .sidebarPadding {
        padding: 2rem 3rem 0rem 3rem;
    }

    .sidebarSettings {
        border-bottom: 1px solid var(--border2);
    }

    .sidebar h2 {
        color: var(--text);
        font-size: 2.5rem;
        margin-left: -0.5rem;
        margin-bottom: 1rem;
        user-select: none;
    }

    .sidebar .settings {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 2.5rem;
    }

    .sidebar .setting {
        font-size: 2rem;
        color: var(--text);
        display: flex;
        justify-content: space-between;
        align-items: center;
        user-select: none;
    }

    .sidebar input {
        background-color: var(--element-bg);
    }

    .inputAndUnit {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.4rem;
    }

    .inputAndUnit input {
        margin-left: 1.5rem;
    }

    .inputAndUnit .textInput {
        width: 6rem;
        margin: 0;
        font-size: 2rem;
        color: var(--text);
        border: 1px solid var(--border2);
        border-radius: 0.3rem;
        padding: 0.1em 0.2em;
    }

    .inputAndUnit p {
        width: 1.5rem;
    }


    .sidebarCheckbox {
        accent-color: var(--enabled);
        width: 2rem;
        height: 2rem;
    }

    .calibrationBtn {
        cursor: pointer;
    }


    .calibrationWindow {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 1.5rem;
        background-color: var(--element-bg);
        border: 0.3rem solid var(--border2);
        padding: 1.5rem 2rem 2rem 2rem;
        user-select: none;
    }


    .instructions {
        text-align: left;
        color: var(--text2);
        font-size: 2.2rem;
        width: 100%;
    }

    h2 {
        color: var(--text);
        font-size: 3.2rem;
        margin: 0;
    }

    .instructions p {
        margin-left: 0.5rem;
        margin-top: 0.5rem;
    }

    .strong {
        font-weight: 700;
        color: var(--text);
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
    }


    .cardContainer {
        width: 100%;
        height: 380px;
        overflow: hidden;
        margin: 2rem 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .card {
        width: 200px;
        height: 200px;
        padding-bottom: 0.5rem;
        background-color: #888;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 1.4rem;
        position: relative;
    }

    .cardWidth {
        color: var(--page-bg);
        position: absolute;
        bottom: 2%;
    }

    .inch {
        border: 0.2rem solid var(--text);
        width: 1in;
        height: 1in;
        text-align: center;
        align-content: center;
        color: var(--page-bg);
    }


    .userInput {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        /* gap: 2rem; */
    }

    #slider {
        width: 30rem;
        background: var(--enabled);
    }

    #slide[type='range'] {
        color: var(--enabled);
    }

    .dpiNum {
        color: var(--text);
        font-size: 1.7rem;
        margin-top: 1rem;
    }


    .modalBtnWrapper {
        position: absolute;
        bottom: 2rem;
        right: 2rem;
        /* transform: translateX(-133%); */
        display: flex;
        gap: 2rem;
    }

    .cancelBtn {
        font-size: 2.7rem;
        font-weight: 700;
        color: var(--text);
        background-color: var(--element-bg);
        border: 0.3rem solid var(--text);
        border-radius: 2.7rem;
        cursor: pointer;
        padding: 0.3em 0.7em;
        transition: 0.3s ease;
        user-select: none;
    }

    .saveBtn {
        font-size: 2.7rem;
        font-weight: 700;
        color: var(--text);
        background-color: var(--element-bg);
        border: 0.3rem solid var(--text);
        border-radius: 2.7rem;
        cursor: pointer;
        padding: 0.3em 0.7em;
        transition: 0.3s ease;
        user-select: none;
    }




    .sidebarBtns {
        padding-bottom: 2rem;
    }

    .evalBtn {
        font-size: 3rem;
        color: var(--text);
        background-color: var(--sidebar-btn-bg);
        border: 2px solid var(--text2);
        border-radius: 1.5rem;
        padding: 0.1em 0.5em;
        font-weight: 700;
        margin: 0rem 3rem;
    }

    .downloadBtn {
        font-size: 2.5rem;
        color: var(--text);
        background-color: var(--sidebar-btn-bg);
        border: 2px solid var(--text2);
        border-radius: 1.5rem;
        padding: 0.1em 0.5em;
        font-weight: 500;
        margin: 0rem 3rem;
        margin-bottom: 1rem;
    }

    .sidebar .splitter {
        border-bottom: 0.1rem solid var(--border2);
        margin: 3rem 0;
    }






    .pickSets {
        width: calc(100% - 30rem);
        margin-top: 3rem;
        position: absolute;
        right: 0;
        display: grid;
        gap: 3rem;
        justify-items: center;
        justify-content: center;
        grid-template-columns: repeat(1, 1fr);
    }

    .setPreviewWrapper {
        width: 100rem;
        border-radius: 1.5rem;
        background-color: var(--element-bg);
        box-shadow: 0px 0px 1.5rem var(--shadow2);
        border: 0.3rem solid var(--border2);
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
        align-items: start;
        padding: 1rem;
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
        width: 13rem;
        display: inline-block;
    }

    .previewImageWrapper {
        display: flex;
        width: 100%;
        height: 100%;
        justify-content: end;
    }

    .previewImage {
        width: 17rem;
        height: 17rem;
        border: 0.3rem solid var(--preview-img-border);
        border-color: var(--text);
        border-radius: 1.5rem;
    }


    .setBtnWrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        height: 17rem;
        margin-right: 2rem;
    }

    .deleteIcon {
        cursor: pointer;
        transition: fill 0.3s ease;
    }

    .deleteIcon:hover {
        fill: var(--delete);
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
        background-color: var(--enabled-bg);
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



    .deleteWarning {
        width: 45%;
        min-height: 30rem;
    }

    .deleteWarning p {
        margin-left: 0.5rem;
        margin-top: 0.5rem;
        font-size: 2.5rem;
        color: var(--text2);
    }

    .warningBtnWrapper {
        display: flex;
        justify-content: space-between;
        margin-top: 2rem;
        position: absolute;
        bottom: 2rem;
        left: 0;
        width: 100%;
        padding: 0 2rem;
    }

    .deleteBtnWrapper {
        display: flex;
        gap: 2rem;
    }

    .deleteBtnWrapper .cancelBtn {
        margin-right: 5rem;
    }

    .deleteBtnAlert {
        color: var(--text);
        border: 0.3rem solid var(--delete);
        font-size: 2.7rem;
        font-weight: 700;
        background-color: var(--element-bg);
        border-radius: 2.7rem;
        cursor: pointer;
        padding: 0.3em 0.7em;
        transition: 0.3s ease;
        user-select: none;
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