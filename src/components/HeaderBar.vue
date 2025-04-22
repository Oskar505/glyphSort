<template>
    <header>
        <div class="headerContainer">
            <h1 @click="clearStorage()">{{ h1Text }}</h1>

            <nav>
                <div @click="this.$router.push({path:'/', query: {glyphSetIds: JSON.stringify(selectedGlyphs)}})"><h2 :class="activeBtn == 0 ? 'navActive' : '' ">Home</h2></div>
                <div @click="this.$router.push({path:'/sort', query: {glyphSetIds: JSON.stringify(selectedGlyphs)}})"><h2 :class="activeBtn == 1 ? 'navActive' : '' ">Sort</h2></div>
                <div @click="this.$router.push({path:'/results', query: {glyphSetIds: JSON.stringify(selectedGlyphs)}})"><h2 :class="activeBtn == 2 ? 'navActive' : '' ">Results</h2></div>
                <div @click="this.$router.push({path:'/calibration', query: {glyphSetIds: JSON.stringify(selectedGlyphs)}})" class="secondaryNavBtn"><svg xmlns="http://www.w3.org/2000/svg" height="3rem" viewBox="0 -960 960 960" width="3rem" style="fill: var(--text2);"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg></div>
            </nav>
        </div>
    </header>
</template>



<script>
    export default {
        props: {
            activeBtn: {
                type: Number,
                default: 0
            },

            selectedGlyphs: {
                type: Array,
                default: []
            },

            h1Text: {
                type: String,
                default: "Malleable Glyph Self-Evaluation Tool"
            }
        },


        methods: {
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
        }
    }
</script>



<style scoped>
    header {
        border-bottom: 1px solid var(--border3); 
        background-color: var(--page-bg);
        box-shadow: 0px 0px 10px var(--shadow1);
        background-color: var(--element-bg);
        margin-bottom: 5rem;
        margin-bottom: clamp(2rem, 4.6vh, 5rem);
        user-select: none;
        display: flex;
        justify-content: center;
        position: fixed;
        inset: 0;
        bottom: auto;
        z-index: 100;
    }

    .headerContainer {
        width: 100%;
        max-width: 1920px;
        padding-left: 4rem;
        padding-left: clamp(2rem, 2vw, 4rem);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    h1 {
        font-size: 3.5rem;
        color: var(--header);
    }

    nav {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
    }

    nav div {
        padding: 1.5rem;
        border-left: 1px solid var(--border3);
        cursor: pointer;
    }

    /* nav div:first-of-type {
    border-left: 1px solid #444;
    } */

    nav div h2 {
        font-size: 2.4rem !important;
        color: var(--text2) !important;
        line-height: 1;
        font-weight: 400;
    }

    .secondaryNavBtn {
        height: 5.4rem;
        padding: 1.1rem;
    }

    .secondaryNavBtn svg {
        height: 3rem;
    }

    .navActive {
        color: #333;
        font-weight: 700;
    }
</style>