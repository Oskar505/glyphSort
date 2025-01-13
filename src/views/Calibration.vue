<template>
    <header>
        <h1 @click="clearStorage()">Settings</h1>

        <nav>
            <div @click="this.$router.push({path:'/', query: {glyphSetIds: JSON.stringify(glyphSetIds)}})"><h2>Home</h2></div>
            <div @click="this.$router.push({path:'/sort', query: {glyphSetIds: JSON.stringify(glyphSetIds)}})"><h2>Sort</h2></div>
            <div @click="this.$router.push({path:'/results', query: {glyphSetIds: JSON.stringify(glyphSetIds)}})"><h2>Results</h2></div>
            <div @click="this.$router.push({path:'/calibration', query: {glyphSetIds: JSON.stringify(glyphSetIds)}})" class="secondaryNavBtn"><svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" style="fill: var(--text2);"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg></div>
        </nav>
    </header>


    <main>
        
        <div class="generalSettingsWrapper settingsWrapper">
            <h2>General</h2>


            <div class="theme generalSettingWrapper">
                <h3 class="strong">Theme</h3>

                <div class="themeBtnWrapper">
                    <div class="themeBtn" :class="theme === 'light' ? 'lightEnabled' : ''" @click="toggleTheme('light')" >
                        <p>Light</p>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#444"><path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z"/></svg>
                    </div>

                    <div class="themeBtn" :class="theme === 'dark' ? 'darkEnabled' : ''" @click="toggleTheme('dark')">
                        <p>Dark</p>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#444"><path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/></svg>
                    </div>
                </div>
            </div>


            <div class="downloadData generalSettingWrapper">
                <h3 class="strong">Export data</h3>
                <p>Downloads all imported sets and sorting data in JSON.</p>

                <div class="exportBtn" @click="exportData(exportGlyphs)">
                    <p>Export</p>
                    <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="var(--text)">
                        <title>Download JSON</title>
                        <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/>
                    </svg>
                </div>

                <label class="exportCheckboxLabel" for="exportGlyphs">
                    <input class="exportCheckbox" v-model="exportGlyphs" type="checkbox" name="exportGlyphs" id="exportGlyphs">
                    Include glyphs in base64
                </label>
            </div>



            <div class="sortingBtns generalSettingWrapper">
                <h3 class="strong">Sorting buttons order</h3>
                <div class="answerBtnWrapper" @click="saveSortingBtnsOrder(1)" :style="{ 'border-color': btnsOrder === 1 ? 'var(--enabled)' : '' }">
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

                <div class="answerBtnWrapper" @click="saveSortingBtnsOrder(0)" :style="{ 'border-color': btnsOrder === 0 ? 'var(--enabled)' : '' }">
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
                theme: 'light',
                exportGlyphs: false
            }
        },


        mounted() {
            this.dpi = parseFloat(this.$getCookie('dpi'))

            if (this.dpi) {
                this.cardWidth = 3.375 * this.dpi
                this.cardHeight = this.cardWidth / 1.58577
            }


            this.btnsOrder = Number(this.$getCookie('sortingBtnsOrder'))


            const allGlyphSetIds = localStorage.getItem("glyphSetList") ? JSON.parse(localStorage.getItem("glyphSetList")) : [];
            this.glyphSetIds = JSON.parse(this.$route.query.glyphSetIds)

            this.glyphSetIds.forEach((setId, index) => {
                if (!allGlyphSetIds.includes(setId)) {
                    this.glyphSetIds.splice(index, 1)
                }
            })


            // get preferred theme
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const preferredTheme = prefersDark ? 'dark' : 'light';

            localStorage.getItem('theme') ? this.theme = localStorage.getItem('theme') : this.theme = preferredTheme

            document.documentElement.setAttribute('data-theme', this.theme);
        },


        methods: {
            toggleTheme(theme) {
                this.theme = theme
                document.documentElement.setAttribute('data-theme', this.theme);
                localStorage.setItem('theme', this.theme);
            },


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
        background-color: var(--element-bg);
        box-shadow: 0px 0px 15px var(--shadow2);
        border: 3px solid var(--border2);
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


    .generalSettingWrapper {
        margin-left: 5px;
        color: var(--text2);
        font-size: 22px;
        margin-top: 20px;
    }


    .sortingBtns {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin: 20px 5px;
    }



    .answerBtnWrapper {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 30px;
        border: 3px solid var(--border2);
        padding: 10px;
        border-radius: 15px;
        cursor: pointer;
    }


    .answerBtn {
        font-size: 40px;
        font-weight: 500;
        border: 3px solid var(--text);
        color: var(--text);
        padding: 0 18px;
        border-radius: 15px;
        background-color: var(--element-bg);
    }



    .instructions {
        text-align: left;
        color: var(--text2);
        font-size: 22px;
    }

    h2 {
        color: var(--text);
        font-size: 32px;
        margin: 0;
    }

    .instructions p {
        margin-left: 5px;
        margin-top: 20px;
    }

    .strong {
        font-weight: 700;
        color: var(--text);
        font-size: 25px;
        margin-bottom: 5px;
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
        color: var(--page-bg);
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
        background: var(--enabled);
    }

    #slide[type='range'] {
        color: var(--enabled);
    }




    /* theme switch */

    .theme {
        margin-top: 20px;
    }

    .themeBtnWrapper {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 15px;
        margin: 10px 0;
    }

    .themeBtn {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 10px;
        border-radius: 15px;
        background-color: var(--element-bg);
        box-shadow: 0px 0px 15px var(--shadow2);
        border: 3px solid var(--border2);
        color: var(--text);
        padding: 5px 10px;
        font-size: 20px;
        cursor: pointer;
    }

    .themeBtn svg {
        fill: var(--text);
    }


    .lightEnabled {
        border-color: #ffc107;
        transition: border-color 0.3s ease;
    }

    .lightEnabled svg {
        fill: #ffc107;
        transition: fill 0.3s ease;
    }

    .darkEnabled {
        border-color: #7e57c2;
        transition: border-color 0.3s ease;
    }

    .darkEnabled svg {
        fill: #7e57c2;
        transition: fill 0.3s ease;
    }




    /* Export data */
    .downloadData h3 {
        margin-bottom: 2px;
    }

    .exportBtn {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 10px;
        border-radius: 15px;
        background-color: var(--element-bg);
        box-shadow: 0px 0px 15px var(--shadow2);
        border: 3px solid var(--border2);
        color: var(--text);
        padding: 4px 5px;
        font-size: 20px;
        cursor: pointer;
        max-width: 150px;
        font-size: 21px;
        margin-top: 10px;
    }

    .exportBtn:hover {
        border-color: var(--enabled);
        transition: border-color 0.3s ease;
    }

    .exportCheckboxLabel {
        display: flex;
        gap: 10px;
        align-items: center;
        margin-top: 5px;
    }

    .exportCheckbox {
        width: 17px;
        height: 17px;
    }




    #confirmBtn {
        font-size: 27px;
        font-weight: 700;
        color: var(--text);
        background-color: var(--element-bg);
        border: 3px solid var(--text);
        border-radius: 27px;
        cursor: pointer;
        padding: 0.3em 0.7em;
        margin-bottom: 15px;
        transition: 0.3s ease;
    }


    #confirmBtn:hover {
        border-color: var(--enabled);
        background-color: var(--enabled);
        color: var(--page-bg);
        transition: 0.3s ease;
    }
</style>