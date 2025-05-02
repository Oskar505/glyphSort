<template>
    <header-bar h1Text='Settings' :activeBtn="-1" :selectedGlyphs="glyphSetIds"></header-bar>


    <main>
        
        <div class="generalSettingsWrapper settingsWrapper">
            <h2>General</h2>


            <div class="theme generalSettingWrapper">
                <h3 class="strong">Theme</h3>

                <div class="themeBtnWrapper">
                    <div class="themeBtn" :class="theme === 'light' ? 'lightEnabled' : ''" @click="toggleTheme('light')" >
                        <p>Light</p>
                        <svg xmlns="http://www.w3.org/2000/svg" height="2.4rem" viewBox="0 -960 960 960" width="2.4rem" fill="#444"><path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z"/></svg>
                    </div>

                    <div class="themeBtn" :class="theme === 'dark' ? 'darkEnabled' : ''" @click="toggleTheme('dark')">
                        <p>Dark</p>
                        <svg xmlns="http://www.w3.org/2000/svg" height="2.4rem" viewBox="0 -960 960 960" width="2.4rem" fill="#444"><path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/></svg>
                    </div>
                </div>
            </div>


            <div class="downloadData generalSettingWrapper">
                <h3 class="strong">Export data</h3>
                <p>Downloads all imported sets and sorting data in JSON.</p>

                <div class="exportBtn" @click="exportData(exportGlyphs)">
                    <p>Export</p>
                    <svg xmlns="http://www.w3.org/2000/svg" height="2.8rem" viewBox="0 -960 960 960" width="2.8rem" fill="var(--text)">
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

                
            </div>
        </div>



        <div class="cardCalibrationWrapper settingsWrapper">
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
                <!-- <button id="confirmBtn" @click="calculateDPI()">Confirm</button> -->
            </div>
        </div>


        
    </main>


    <div class="appInfo">
        <h2>About</h2>
        <p class="author">Developed by <a href="https://github.com/Oskar505" target="_blank">Oskar Tvrďoch</a></p>
        <a class="about" href="https://tmgc.fit.vutbr.cz/" target="_blank">Learn more</a>
    </div>
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
            this.dpi = parseFloat(this.$getCookie('dpi')).toFixed(0)

            if (this.dpi) {
                this.cardWidth = 3.375 * this.dpi
                this.cardHeight = this.cardWidth / 1.58577
            }


            this.btnsOrder = Number(this.$getCookie('sortingBtnsOrder'))


            const allGlyphSetIds = localStorage.getItem("glyphSetList") ? JSON.parse(localStorage.getItem("glyphSetList")) : [];
            this.glyphSetIds = this.$route.query.glyphSetIds ? JSON.parse(this.$route.query.glyphSetIds) : []

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

                this.calculateDPI()
            },


            calculateDPI(saveCookie=true) {
                const pixelWidth = parseInt(this.cardWidth, 10); // digital widt in px
                const cardWidthCm = 8.56; // real width in cm

                // calculate DPI
                const dpi = (pixelWidth / (cardWidthCm / 2.54)).toFixed(0);
                this.dpi = dpi

                console.log(dpi)
                
                // save cokie
                if (saveCookie) {
                    document.cookie = `dpi=${dpi}; path=/; max-age=31536000; SameSite=Strict`;
                }
                
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
        gap: 4rem;
        padding: 0 5rem;
        margin-top: 5.4rem;
    }


    .settingsWrapper {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 1.5rem;
        background-color: var(--element-bg);
        box-shadow: 0 0 1.5rem var(--shadow2);
        border: 0.3rem solid var(--border2);
        padding: 1.5rem 2rem;
        user-select: none;
        max-width: 90%;
        margin: 0 auto;
        margin-top: 3rem;
        min-width: 600px;
    }



    .generalSettingsWrapper {
        justify-content: start;
        align-items: start;
    }


    .generalSettingWrapper {
        margin-left: 0.5rem;
        color: var(--text2);
        font-size: 2.2rem;
        margin-top: 2rem;
    }


    .sortingBtns {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin: 2rem 0.5rem;
    }



    .answerBtnWrapper {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 3rem;
        border: 0.3rem solid var(--border2);
        padding: 1rem;
        border-radius: 1.5rem;
        cursor: pointer;
    }


    .answerBtn {
        font-size: 4rem;
        font-weight: 500;
        border: 0.3rem solid var(--text);
        color: var(--text);
        padding: 0 1.8rem;
        border-radius: 1.5rem;
        background-color: var(--element-bg);
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
        margin-top: 2rem;
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




    /* theme switch */

    .theme {
        margin-top: 2rem;
    }

    .themeBtnWrapper {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 1.5rem;
        margin: 1rem 0;
    }

    .themeBtn {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        border-radius: 1.5rem;
        background-color: var(--element-bg);
        box-shadow: 0 0 1.5rem var(--shadow2);
        border: 0.3rem solid var(--border2);
        color: var(--text);
        padding: 0.5rem 1rem;
        font-size: 2rem;
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
        margin-bottom: 0.2rem;
    }

    .exportBtn {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        border-radius: 1.5rem;
        background-color: var(--element-bg);
        box-shadow: 0 0 1.5rem var(--shadow2);
        border: 0.3rem solid var(--border2);
        color: var(--text);
        padding: 0.4rem 0.5rem;
        font-size: 2rem;
        cursor: pointer;
        max-width: 15rem;
        font-size: 2.1rem;
        margin-top: 1rem;
    }

    .exportBtn:hover {
        border-color: var(--enabled);
        transition: border-color 0.3s ease;
    }

    .exportCheckboxLabel {
        display: flex;
        gap: 1rem;
        align-items: center;
        margin-top: 0.5rem;
    }

    .exportCheckbox {
        width: 1.7rem;
        height: 1.7rem;
    }




    #confirmBtn {
        font-size: 2.7rem;
        font-weight: 700;
        color: var(--text);
        background-color: var(--element-bg);
        border: 0.3rem solid var(--text);
        border-radius: 2.7rem;
        cursor: pointer;
        padding: 0.3em 0.7em;
        margin-bottom: 1.5rem;
        transition: 0.3s ease;
    }


    #confirmBtn:hover {
        border-color: var(--enabled);
        background-color: var(--enabled);
        color: var(--page-bg);
        transition: 0.3s ease;
    }


    .appInfo {
        display: flex;
        justify-content: center;
        flex-direction: column;
        gap: 0.5rem;
        max-width: 50rem;
        /* margin: 0 auto; */
        padding: 1rem;
        margin: 4rem 5rem 3rem 5rem;
        color: var(--text2);
        font-size: 2.2rem;
        border: 0.3rem solid var(--border2);
        border-radius: 1.5rem;
        /* display: none; */
    }

    .appInfo h2 {
        color: var(--text);
        font-size: 3.2rem;
    }

    .author, .about {
        margin-left: 0.5rem;
    }

    .appInfo .author {
        color: var(--text);
    }


    .appInfo a {
        color: var(--text);
        font-weight: 500;
        text-decoration: none;
    }





    @media screen and (max-width: 1300px) {
        .settingsWrapper {
            min-width: 100%;
            padding: 1% 2.5%;
        }
    }


    @media screen and (max-width: 700px) {
        .appInfo {
            max-width: none;
        }
    }
</style>