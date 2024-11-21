<template>
    <header>
        <h1 @click="clearStorage()">Home</h1>

        <nav>
            <div @click="this.$router.push({path:'/'})"><h2 class="navActive">Home</h2></div>
            <div @click="this.$router.push({path:'/sort', query: {glyphSetIds: JSON.stringify(selectedGlyphs)}})"><h2>Sort</h2></div>
            <div @click="this.$router.push({path:'/results', query: {glyphSetIds: JSON.stringify(selectedGlyphs)}})"><h2>Results</h2></div>
        </nav>
    </header>
    


    <section class="pickSets" v-if="glyphSetList.length > 0">
        <div class="savedSetsWrapper">
            <div class="setPreviewWrapper" v-for="glyphSet in glyphSetList" :key="glyphSet.id" @click="handleSetSelection(glyphSet.id)" :class="selectedGlyphs.includes(glyphSet.id) ? 'selected' : 'notSelected'">
                <h2>{{ glyphSet.name }}</h2>
                <h3>{{ glyphSet.id }}</h3>


                <div class="infoContent">
                    <div class="infoWrapper">
                        <div>
                            <p class="info"><span class="lessImportant">Author: </span>{{ glyphSet.author }}</p>
                            <p class="info"><span class="lessImportant">Image count: </span>{{ glyphSet.glyphs.length }}</p>
                            <p class="info"><span class="lessImportant">Version: </span>{{ glyphSet.version }}</p>
                        </div>
                        
                        <svg class="deleteBtn" @click.stop="deleteSet(glyphSet.id)" xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#444"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                    </div>

                    <img :src="glyphSet.decodeGlyph(glyphSet.glyphs[glyphSet.glyphs.length - 1])" alt="preview image" class="previewImage">
                </div>
            </div>
        </div>
        

        <file-input class="fileInput" @setSaved="getSavedSets"/>
    </section>


    <section class="middlePageWarning" v-if="glyphSetList.length == 0">
        <h1>Nothing's here yet!</h1>
        <h2>Import your sets below.</h2>

        <file-input class="fileInput" @setSaved="getSavedSets"/>
    </section>


    
    <transition name="fade">
        <div class="floatingBtn" v-show="selectedGlyphs.length > 0" @click="this.$router.push({path:'/sort', query: {glyphSetIds: JSON.stringify(selectedGlyphs)}})">
            <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#444"><path d="M662.82-440.39H145.87v-79.22h516.95L423.87-758.57 480-814.7 814.7-480 480-145.87l-56.13-55.56 238.95-238.96Z"/></svg>
        </div>
    </transition>
</template>



<script>
    import GlyphSet from '../GlyphSetClass.js'
    import { useGlyphSetStore } from '../glyphSetStore'
    import pako from 'pako'


    export default {
        data() {
            return {
                setIdList: [],
                glyphSetList: [],
                selectedGlyphs: [],
                glyphSetStore: useGlyphSetStore()
            }
        },

        methods: {
            clearStorage() {
                console.log("clearing storage");

                localStorage.clear();
                sessionStorage.clear();
            },


            getSavedSets() {
                this.setIdList = localStorage.getItem("glyphSetList") ? JSON.parse(localStorage.getItem("glyphSetList")) : [];
                this.glyphSetList = []

                console.log(this.setIdList)

                this.setIdList.forEach(glyphSetId => {
                    console.log(glyphSetId)

                    let glyphSet = new GlyphSet(glyphSetId)

                    this.glyphSetList.push(glyphSet)
                    glyphSet.getStats()
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
                console.log(this.selectedGlyphs, setId, this.selectedGlyphs.includes(setId))
                this.selectedGlyphs = JSON.parse(JSON.stringify(this.selectedGlyphs))


                if (this.selectedGlyphs.includes(setId)) {
                    this.selectedGlyphs.splice(this.selectedGlyphs.indexOf(setId), 1)
                } 
                
                else {
                    this.selectedGlyphs.push(setId)
                }
            },


            deleteSet(setId) {
                localStorage.removeItem(setId)

                this.setIdList = localStorage.getItem("glyphSetList") ? JSON.parse(localStorage.getItem("glyphSetList")) : [];
                this.setIdList.splice(this.setIdList.indexOf(setId), 1)
                localStorage.setItem("glyphSetList", JSON.stringify(this.setIdList))

                this.getSavedSets()
                this.handleSetSelection(setId)
            }
        },



        mounted() {
            this.setIdList = localStorage.getItem("glyphSetList") ? JSON.parse(localStorage.getItem("glyphSetList")) : [];

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
        gap: 80px;
        max-width: 95%;
        margin: 0 auto;
    }

    .savedSetsWrapper {
        flex: 4;
        display: grid;
        gap: 30px;
        grid-template-columns: repeat(2, 1fr);
    }

    .setPreviewWrapper {
        width: 100%;
        border-radius: 15px;
        background-color: #fcfcfc;
        box-shadow: 0px 0px 15px #dedede;
        border: 3px solid #999;
        padding: 5px 15px 15px 15px;
        flex: 1;
        cursor: pointer;
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

    .deleteBtn {
        cursor: pointer;
        transition: fill 0.3s ease;
    }

    .deleteBtn:hover {
        fill: red;
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
        margin: 2% auto;
        flex: 2;
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