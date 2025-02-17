<template>
    <div class="fileInputWrapper">
        <div id="dropZone" :class="{ dragover: isDragOver }" @dragover.prevent="handleDragOver" @dragleave="handleDragLeave" @drop.prevent="handleDrop">
            <p class="dropText">Drop zip file here <br> or</p>
            <label for="fileInput">Browse</label>
            <input type="file" id="fileInput" @change="handleFileSelect">
        </div>

        <div id="filePreview" ref="targetElement">
            <div>
                <h1 id="fileName">{{ name }}</h1>
                <h2>{{ shortName }}</h2>
                <p class="info"><span class="lessImportant">Author: </span>{{ author }}</p>
                <p class="info"><span class="lessImportant">Image count: </span>{{ imageList.length }}</p>
            </div>
            
            <img src="" alt="preview image" id="previewImage">

            <div class="saveBtn" @click="saveSet"><p>Save</p></div>
        </div>
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
                let file = files[0];


                if (files.length !== 1) {
                    console.warn("Loadng only the first file.");
                }

                if (!file.name.endsWith(".zip")) {
                    console.error("File is not a zip file");
                }


                document.getElementById("dropZone").style.display = "none";
                document.getElementById("filePreview").style.display = "flex";


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
            },


            async saveSet() {
                await new GlyphSet(this.shortName, this.images, this.info).init()

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
                document.getElementById("dropZone").style.display = "flex";
                document.getElementById("filePreview").style.display = "none";
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
    width: 40rem;
    height: 20rem;
    border: 0.2rem dashed var(--border2);
    border-radius: 0.8rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--text);
    background-color: var(--element-bg);
    font-size: 1.8rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
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


#filePreview {
    width: clamp(20rem, 80%, 100rem);
    height: 50rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 5rem;
    border-radius: 1.5rem;
    background-color: var(--element-bg);
    box-shadow: 0 0 5rem var(--shadow3);
    border: 0.3rem solid var(--border2);
    display: none;
    padding: 1.5rem 3rem;
    /* position: relative; */
    position: absolute;
    left: 50%;
    top: 10%;
    transform: translateX(-50%);
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


.saveBtn {
    font-size: 2.7rem;
    font-weight: 700;
    color: var(--text);
    background-color: var(--element-bg);
    border: 0.3rem solid var(--text);
    border-radius: 2.7rem;
    cursor: pointer;
    position: absolute;
    bottom: 0;
    left: 100%;
    transform: translateX(-133%);
    padding: 0.3em 0.7em;
    margin-bottom: 1.5rem;
    transition: 0.3s ease;
    user-select: none;
}


.saveBtn:hover {
    border-color: var(--enabled);
    background-color: var(--enabled);
    color: var(--page-bg);
    transition: 0.3s ease;
}
</style>
