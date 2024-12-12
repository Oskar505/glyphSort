<template>
    <header>
        <h1 @click="clearStorage()">Home</h1>

        <nav>
            <div @click="this.$router.push({path:'/', query: {glyphSetIds: JSON.stringify(selectedGlyphs)}})"><h2 class="navActive">Home</h2></div>
            <div @click="this.$router.push({path:'/sort', query: {glyphSetIds: JSON.stringify(selectedGlyphs)}})"><h2>Sort</h2></div>
            <div @click="this.$router.push({path:'/results', query: {glyphSetIds: JSON.stringify(selectedGlyphs)}})"><h2>Results</h2></div>
            <div @click="this.$router.push({path:'/calibration', query: {glyphSetIds: JSON.stringify(selectedGlyphs)}})" class="secondaryNavBtn"><svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#666"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg></div>
        </nav>
    </header>
    


    <section class="pickSets" v-if="glyphSetList.length > 0">
        <div class="savedSetsWrapper">
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
                            <svg class="deleteBtn" @click.stop="deleteSet(glyphSet)" xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#444">
                                <title>Delete set</title>
                                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                            </svg>

                            <svg :class="glyphSet.data.answers.length == 0 ? 'disabledBtn' : 'deleteBtn'" @click.stop="glyphSet.deleteAnswers()" xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#444">
                                <title>Delete answers</title>
                                <path d="M240-800v200-200 640-9.5 9.5-640Zm0 720q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v174q-19-7-39-10.5t-41-3.5v-120H520v-200H240v640h254q8 23 20 43t28 37H240Zm396-20-56-56 84-84-84-84 56-56 84 84 84-84 56 56-83 84 83 84-56 56-84-83-84 83Z"/>
                            </svg>

                            <svg :class="glyphSet.data.answers.length == 0 ? 'disabledBtn' : 'normalBtnOff'" @click.stop="glyphSet.downloadAnswers()" xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#444">
                                <title>Download answers</title>
                                <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/>
                            </svg>

                            <svg :class="glyphSet.rotation ? 'normalBtnOn' : 'normalBtnOff'" @click.stop="glyphSet.toggleRotation()" xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#444">
                                <title>Toggle rotation</title>
                                <path d="M522-80v-82q34-5 66.5-18t61.5-34l56 58q-42 32-88 51.5T522-80Zm-80 0Q304-98 213-199.5T122-438q0-75 28.5-140.5t77-114q48.5-48.5 114-77T482-798h6l-62-62 56-58 160 160-160 160-56-56 64-64h-8q-117 0-198.5 81.5T202-438q0 104 68 182.5T442-162v82Zm322-134-58-56q21-29 34-61.5t18-66.5h82q-5 50-24.5 96T764-214Zm76-264h-82q-5-34-18-66.5T706-606l58-56q32 39 51 86t25 98Z"/>
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


    
    <transition name="fade">
        <div class="floatingBtn" v-show="JSON.parse(JSON.stringify(selectedGlyphs.length)) > 0" @click="this.$router.push({path:'/sort', query: {glyphSetIds: JSON.stringify(selectedGlyphs)}})">
            <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#444"><path d="M662.82-440.39H145.87v-79.22h516.95L423.87-758.57 480-814.7 814.7-480 480-145.87l-56.13-55.56 238.95-238.96Z"/></svg>
        </div>
    </transition>
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
            }
        },

        methods: {
            async clearStorage() {
                console.log("clearing storage");

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
                    console.log("glyphSetStore cleared.");
                };

                transaction.onerror = (event) => {
                    console.error("Error clearing glyphSetStore:", event.target.error);
                };
            },



            getSavedSets() {
                this.setIdList = localStorage.getItem("glyphSetList") ? JSON.parse(localStorage.getItem("glyphSetList")) : [];
                this.glyphSetList = []

                console.log(this.setIdList)

                this.setIdList.forEach(async glyphSetId => {
                    try {
                        console.log(glyphSetId)

                        let glyphSet = new GlyphSet(glyphSetId)
                        await glyphSet.init()

                        this.glyphSetList.push(glyphSet)
                        glyphSet.getStats()

                        this.previewImages.push(await glyphSet.decodeGlyph(glyphSet.glyphs[glyphSet.glyphs.length - 1]))
                        console.log(this.previewImages)
                    }


                    catch (error) {
                        console.error(error)
                    } 
                })


                // TEST
                // this.setIdList.forEach(glyphSetId => {
                //     console.log(glyphSetId)

                //     let glyphSet = new GlyphSet(glyphSetId)

                //     this.glyphSetList.push(glyphSet)
                //     glyphSet.getStats()
                // })

                // this.setIdList.forEach(glyphSetId => {
                //     console.log(glyphSetId)

                //     let glyphSet = new GlyphSet(glyphSetId)

                //     this.glyphSetList.push(glyphSet)
                //     glyphSet.getStats()
                // })


                let total = 0;
                for (let key in localStorage) {
                    if (localStorage.hasOwnProperty(key)) {
                        total += ((localStorage[key].length + key.length) * 2);
                    }
                }
                console.log(`Použité místo: ${total / 1024} KB`);


                for (let key in localStorage) {
                    console.log(key, localStorage.getItem(key));
                }
            },


            getDecodedImage(glyphSet) {
                let compressedImage = glyphSet.glyphs[glyphSet.glyphs.length - 1];

                let compressedBinary = Uint8Array.from(atob(compressedImage), c => c.charCodeAt(0)); // Base64 to binary
                let decompressedBinary = pako.ungzip(compressedBinary); // decompress
                let base64Image = btoa(String.fromCharCode(...decompressedBinary)); // back to Base64

                console.log(base64Image)

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
                console.log("reloading sets")

                this.setIdList = localStorage.getItem("glyphSetList") ? JSON.parse(localStorage.getItem("glyphSetList")) : [];

                console.log(this.setIdList)
                
                this.getSavedSets()
                

                console.log(this.selectedGlyphs)
            },
        },



        mounted() {
            this.setIdList = localStorage.getItem("glyphSetList") ? JSON.parse(localStorage.getItem("glyphSetList")) : [];
            
            this.selectedGlyphs = this.$route.query.glyphSetIds ? JSON.parse(this.$route.query.glyphSetIds) : []
            console.log(this.selectedGlyphs, this.$route.query)

            console.log(this.setIdList)

            this.getSavedSets()

            console.log(this.selectedGlyphs)
        }
    }
</script>



<style scoped>
    .pickSets {
        display: flex;
        flex-direction: row;
        align-items: start;
        flex-wrap: wrap;
        gap: 80px;
        max-width: 95%;
        margin: 0 auto;
    }

    .savedSetsWrapper {
        flex: 4;
        display: grid;
        gap: 30px;
        grid-template-columns: repeat(3, 1fr);
        grid-template-columns: repeat(auto-fit, minmax(455px, 1fr));
    }

    .setPreviewWrapper {
        width: 100%;
        max-width: 550px;
        border-radius: 15px;
        background-color: #fcfcfc;
        box-shadow: 0px 0px 15px #dedede;
        border: 3px solid #999;
        padding: 5px 15px 15px 15px;
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
        gap: 50px;
    }

    .setPreviewWrapper h2 {
        color: #444;
        font-size: 30px;
        margin-left: -5px;
    }

    .setPreviewWrapper h3 {
        color: #444;
        font-size: 25px;
        font-weight: 500;
        margin-top: -3px;
        margin-bottom: 15px;
    }

    .infoWrapper {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .info {
        color: #444;
        font-size: 20px;
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
        width: 180px;
        height: 180px;
        border: 3px solid #444;
        border-radius: 15px;
    }


    .setBtnWrapper {
        width: 88%;
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
        fill: #4a90e2;
    }

    .disabledBtn {
        cursor: not-allowed;
        fill: #999;
    }

    .normalBtnOff:hover {
        fill: #4a90e2;
        transition: fill 0.3s ease;
    }

    .normalBtnOn:hover {
        fill: #444;
        transition: fill 0.3s ease;
    }


    .selected {
        border-color: #4a90e2;
        transition: border-color 0.4s ease;
    }

    .notSelected {
        border-color: #999;
        transition: border-color 0.4s ease;
    }


    .fileInput {
        /* margin: 2% auto; */
        /* flex: 2; */
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

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.4s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
</style>