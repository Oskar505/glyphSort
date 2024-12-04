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

                console.log(files)


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
                                // console.log(reader.result)

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


            saveSet() {
                // let images = JSON.parse(JSON.stringify(this.images))

                console.log('save set')

                new GlyphSet(this.shortName, this.images, this.info).init()


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
    width: 400px;
    height: 200px;
    border: 2px dashed #999;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #444;
    background-color: #fcfcfc;
    font-size: 18px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

#dropZone.dragover {
    background-color: hsl(0, 0%, 95%);
    border-color: #4a90e2;
    color: #222;
}

.dropText {
    text-align: center;
}

label {
    cursor: pointer;
    border: 1px solid #aaa;
    padding: 3px 5px;
    border-radius: 5px;
    margin-top: 5px;
}

#fileInput {
    display: none;
}


#filePreview {
    width: 1000px;
    height: 500px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: top;
    flex-wrap: wrap;
    gap: 50px;
    border-radius: 15px;
    background-color: #fcfcfc;
    box-shadow: 0px 0px 50px hsl(0, 0%, 73%);
    border: 3px solid #999;
    display: none;
    padding: 15px 30px;
    /* position: relative; */
    position: absolute;
    left: 50%;
    top: 9%;
    transform: translateX(-50%);
}


#fileName {
    color: #333;
}


h2 {
    color: #444;
    margin: 5px 0 2px 5px;
    font-weight: 700;
}

.info {
    color: #444;
    margin-left: 5px;
    font-size: 20px;
    font-weight: 500;
}

.lessImportant {
    font-weight: 400;
}

#previewImage {
    width: 250px;
    height: 250px;
    border: 3px solid #444;
    border-radius: 15px;
}


.saveBtn {
    font-size: 27px;
    font-weight: 700;
    color: #444;
    background-color: #fcfcfc;
    border: 3px solid #444;
    border-radius: 27px;
    cursor: pointer;
    position: absolute;
    bottom: 0;
    left: 100%;
    transform: translateX(-133%);
    padding: 0.3em 0.7em;
    margin-bottom: 15px;
    transition: 0.3s ease;
}


.saveBtn:hover {
    border-color: #4a90e2;
    background-color: #4a90e2;
    color: #fff;
    transition: 0.3s ease;
}
</style>
