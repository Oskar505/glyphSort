<template>
    <header>
        <h1 class="wideContainer" @click="clearStorage()">Home</h1>
    </header>
    


    <section class="pickSets">
        <div class="savedSetsWrapper">
            <div class="setPreviewWrapper" v-for="glyphSet in glyphSetList" :key="glyphSet.id" @click="goToSort([glyphSet.id])">
                <h2>{{ glyphSet.name }}</h2>
                <h3>{{ glyphSet.id }}</h3>


                <div class="infoContent">
                    <div class="infoWrapper">
                        <p class="info"><span class="lessImportant">Author: </span>{{ glyphSet.author }}</p>
                        <p class="info"><span class="lessImportant">Image count: </span>{{ glyphSet.glyphs.length }}</p>
                        <p class="info"><span class="lessImportant">Version: </span>{{ glyphSet.version }}</p>
                    </div>

                    <img :src="getDecodedImage(glyphSet)" alt="preview image" class="previewImage">
                </div>
            </div>
        </div>
        


        <file-input class="fileInput"/>
    </section>
    


</template>



<script>
    import GlyphSet from '../GlyphSetClass.js'


    export default {
        data() {
            return {
                setIdList: [],
                glyphSetList: [],
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

                this.setIdList.forEach(glyphSetId => {
                    console.log(glyphSetId)

                    let glyphSet = new GlyphSet(glyphSetId)

                    this.glyphSetList.push(glyphSet)
                    glyphSet.getStats()
                })

                this.setIdList.forEach(glyphSetId => {
                    console.log(glyphSetId)

                    let glyphSet = new GlyphSet(glyphSetId)

                    this.glyphSetList.push(glyphSet)
                    glyphSet.getStats()
                })


                console.log(this.glyphSetList)
            },


            getDecodedImage(glyphSet) {
                const glyphData = glyphSet.glyphs[glyphSet.glyphs.length - 1];
                
                console.log(glyphData)

                return atob(glyphData)
            },


            goToSort(pickedSets) {
                this.$router.push({path:'/sort', query: {setIds: JSON.stringify(pickedSets)}})
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
        width: 200px;
        height: 200px;
        border: 3px solid #444;
        border-radius: 15px;
    }


    .fileInput {
        margin: 2% auto;
        flex: 1;
    }
</style>