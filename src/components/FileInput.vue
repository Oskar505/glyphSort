<template>
    <div class="fileInputWrapper">
        <div id="dropZone" :class="{ dragover: isDragOver }" @dragover.prevent="handleDragOver" @dragleave="handleDragLeave" @drop.prevent="handleDrop">
            <p class="dropText">Drop zip file here <br> or</p>
            <label for="fileInput">Browse</label>
            <input type="file" id="fileInput" @change="handleFileSelect">
        </div>

        <transition name="modalFade">
            <div class="modalWrapper" v-if="showPreview">
                <div class="modalBackdrop" key="fileBackdrop"></div>

                <div class="filePreview modal" ref="targetElement" key="fileModal" id="filePreview">
                    <div>
                        <h1 id="fileName">{{ name }}</h1>
                        <h2>{{ shortName }}</h2>
                        <p class="info"><span class="lessImportant">Author: </span>{{ author }}</p>
                        <p class="info"><span class="lessImportant">Image count: </span>{{ imageList.length }}</p>
                    </div>
                    
                    <img src="" alt="preview image" id="previewImage">

                    <div class="btnWrapper">
                        <div class="cancelBtn neutralBtn" @click="showPreview = false"><p>Cancel</p></div>
                        <div class="saveBtn btn" @click="saveSet"><p>Save</p></div>
                    </div>
                    

                    <loader :fileInput="true" v-if="isLoading"></loader>
                </div>
            </div>
        </transition>
    </div>
</template>


<script>
    import JSZip, { file } from 'jszip';
    import GlyphSet from '../GlyphSetClass.js'


    export default {
        name: "DropZone",
        data() {
            return {
                isDragOver: false,
                metadata: null,
                name: null,
                shortName: null,
                author: null,
                imageList: [],
                images: [],
                info: {},
                glyphVals: [],
                isLoading: false,
                showPreview: false,
            };
        },


        mounted() {
            document.addEventListener("mousedown", this.handleClickOutside);
            document.addEventListener("keydown", this.handleEscKey);
        },


        beforeUnmount() {
            document.removeEventListener("mousedown", this.handleClickOutside);
            document.removeEventListener("keydown", this.handleEscKey);
        },



        methods: {
            handleDragOver() {
                this.isDragOver = true;
            },
            handleDragLeave() {
                this.isDragOver = false;
            },

            handleFileSelect(event) {
                const files = event.target.files;
                this.processFiles(files)
            },

            handleDrop(event) {
                this.isDragOver = false;
                const files = Array.from(event.dataTransfer.files);

                this.processFiles(files)
            },

            
            async processFiles(files) {
                this.isLoading = true


                let file = files[0];


                if (files.length !== 1) {
                    console.warn("Loadng only the first file.");
                }

                if (!file.name.endsWith(".zip") || file.name.endsWith(".mglyph")) {
                    console.warn("Unknown filetype");
                }


                // document.getElementById("dropZone").style.display = "none";
                // document.getElementById("filePreview").style.display = "flex";

                this.showPreview = true


                const zip = new JSZip();


                let zipContent = await zip.loadAsync(file);

                for (const [relativePath, fileEntry] of Object.entries(zipContent.files)) {
                    // only files
                    if (!fileEntry.dir) {

                        // read metadata
                        if (relativePath === 'metadata.json') {
                            // load as blob
                            const fileBlob = await fileEntry.async('blob');

                            const reader = new FileReader();
                            reader.readAsText(fileBlob);

                            reader.onload = () => {
                                this.metadata = JSON.parse(reader.result);
                                this.name = this.metadata.name;
                                this.shortName = this.metadata.short_name;
                                this.author = this.metadata.author;
                                this.imageList = this.metadata.images;
                                this.version = this.metadata.version;

                                this.glyphVals = this.imageList.map(glyphInfo => glyphInfo[1])

                                this.info = {
                                    "name":this.name,
                                    "author":this.author,
                                    "version":this.version
                                }
                            };
                        }


                        else if (relativePath.endsWith('.png') || relativePath.endsWith('.jpg') || relativePath.endsWith('.jpeg')) {
                            // load as blob
                            const fileBlob = await fileEntry.async('blob');

                            const reader = new FileReader();
                            reader.readAsDataURL(fileBlob);

                            reader.onload = () => {
                                this.images.push(reader.result);
                            }
                        }
                    }
                }


                const imageElement = document.getElementById("previewImage");
                imageElement.src = this.images[this.images.length - 1];
                document.getElementById("filePreview").appendChild(imageElement);


                this.isLoading = false
            },


            async saveSet() {
                this.isLoading = true

                await new GlyphSet(this.shortName, this.images, this.info, this.glyphVals).init()

                this.isLoading = false

                this.closePopup()
                this.$emit('setSaved')
            },


            handleClickOutside(event) {
                const target = this.$refs.targetElement;
                if (!target || !target.contains(event.target)) {
                    this.closePopup()
                }
            },

            handleEscKey(event) {
                if (event.key === "Escape") {
                    this.closePopup();
                }
            },


            closePopup() {
                // document.getElementById("dropZone").style.display = "flex";
                // document.getElementById("filePreview").style.display = "none";

                this.showPreview = false
            }
        },
    };
</script>



<style scoped>

.fileInputWrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    /* width: 100%; */
}

#dropZone {
    width: 100rem;
    height: 17rem;
    border: 0.2rem dashed var(--border2);
    border-radius: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--text);
    background-color: var(--element-bg);
    font-size: 1.8rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin: 3rem 0;
}

#dropZone.dragover {
    background-color: var(--element-bg);
    border-color: var(--enabled);
    color: var(--header);
}

.dropText {
    text-align: center;
}

label {
    cursor: pointer;
    border: 0.1rem solid var(--border2);
    padding: 0.3rem 0.5rem;
    border-radius: 0.5rem;
    margin-top: 0.5rem;
}

#fileInput {
    display: none;
}


.filePreview {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 5rem;
    background-color: var(--element-bg);
    border: 0.3rem solid var(--border2);
    width: 50%;
    min-height: 50rem;
    padding: 2rem;
}


#fileName {
    color: var(--header);
    font-size: 3rem;
}


h2 {
    color: var(--text);
    margin: 0.5rem 0 0.2rem 0.5rem;
    font-weight: 700;
    font-size: 2.5rem;
}

.info {
    color: var(--text);
    margin-left: 0.5rem;
    font-size: 2rem;
    font-weight: 500;
}

.lessImportant {
    font-weight: 400;
}

#previewImage {
    width: 25rem;
    height: 25rem;
    border: 0.3rem solid var(--text);
    border-radius: 1.5rem;
}



.btnWrapper {
    position: absolute;
    bottom: 5%;
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
</style>
