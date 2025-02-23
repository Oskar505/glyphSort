import pako from 'pako'
import { toRaw } from 'vue'
import { logMessage } from './views/Sort.vue'


class GlyphSet {
    constructor(id, glyphs=[], info={}, distance=undefined) {
        this.id = id
        this.info = info
        this.glyphs = glyphs

        this.distance = distance
        this.actualDistance = distance
        this.rotation = false
        this.glyphStepsCount = this.glyphs.length
        this.db = null
        this.answers = []
        this.distanceSteps = []
        this.stepIndex = 0

        this.rotationClass = 'normalBtnOff'

        if (distance == undefined) {
            this.distance = this.glyphStepsCount * 0.2
        }



        // ALGORITHM VALUES
        // right answer --> lastDistance * (this.gamma ** this.progressStep)
        // wrong answer --> lastDistance / (this.gamma ** this.regressStep)
        this.gamma = 0.7
        this.progressStep = 1
        this.regressStep = 3
        this.rewardEqual = false


        this.initPromise = null // state of initialization
    }


    init() {
        if (!this.initPromise) {
            this.initPromise = new Promise(async (resolve, reject) => {
                try {

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






                    this.data = await this.getData()

                    // Create new glyph set
                    if (this.data == null || !this.data) {
                        // ALGORITHM STEPS
                        let tempDistance = this.distance
                        let prevDistance

                        while (tempDistance >= 1) {
                            // dont push duplicates
                            prevDistance != tempDistance ? this.distanceSteps.push(tempDistance) : null
                            
                            // calculate new distance
                            prevDistance = tempDistance
                            tempDistance = Math.floor(tempDistance * this.gamma)
                        }



                        // save
                        this.data = {
                            "id": this.id,
                            "name": this.info.name,
                            "author": this.info.author,
                            "version": this.info.version,
                            "glyphs": this.glyphs,
                            "distance": this.distance,
                            "distanceSteps": this.distanceSteps,
                            "gamma": this.gamma,
                            "glyphStepsCount": this.glyphStepsCount,
                            "rotation": this.rotation,
                            "answers": this.answers, // []
                        }

                        await this.saveData(true)
                    }



                    // Load glyph set
                    else {
                        this.glyphs = this.data.glyphs
                        this.distance = this.data.distance
                        this.distanceSteps = this.data.distanceSteps
                        this.actualDistance = this.distance
                        this.gamma = this.data.gamma
                        this.glyphStepsCount = this.glyphs.length
                        this.name = this.data.name
                        this.author = this.data.author
                        this.version = this.data.version
                        this.answers = this.data.answers
                        this.rotation = this.data.rotation
                    }


                    this.successRate = 0
                    this.sortedCount = 0
                    this.sortTime = 0
                    this.sessionTime = 0
                    this.smallestDistance = 0

                    this.rotationClass = this.rotation ? 'normalBtnOn' : 'normalBtnOff'



                    // mark as initialized
                    resolve()
                }


                catch (error) {
                    console.error("Error during initialization of GlyphSetClass:", error)
                    reject(error)
                }
            })
        }


        return this.initPromise
    }




    //CRUD
    convertGlyphsToBase64(glyphs) {
        this.glyphs = []
        let base64Image;

        for(const glyph of glyphs) {
            base64Image = btoa(glyph)

            const binaryString = atob(glyph.split(',')[1]); // Base64 -> binary
            const binaryArray = new Uint8Array(
                binaryString.split('').map((char) => char.charCodeAt(0))
            );
            const compressed = pako.gzip(binaryArray); // compress
            this.glyphs.push(btoa(String.fromCharCode(...compressed))); // back to Base64
        }

        this.data["glyphs"] = this.glyphs

        return this.glyphs
    }

    async saveData(init=false) {
        if (init) {
            this.convertGlyphsToBase64(this.data.glyphs)

            // update glyph set list
            let glyphSetList = localStorage.getItem("glyphSetList") ? JSON.parse(localStorage.getItem("glyphSetList")) : [];
            glyphSetList.push(this.id)
            localStorage.setItem("glyphSetList", JSON.stringify(glyphSetList))
        }
        

        // indexedDB
        let transaction = this.db.transaction("glyphSetStore", "readwrite")
        let objectStore = transaction.objectStore("glyphSetStore")

        let putRequest = objectStore.put(toRaw(this.data))

        putRequest.onerror = (event) => {
            console.error("Error adding data to object store:", event.target.error)
        }

        transaction.onerror = (event) => {
            console.error("Error adding data to object store:", event.target.error)
        }
    }

    async getData() {
        try {
            if (!this.db) {
                await this.init(); // wait for indexedDB
            }


            let data = await new Promise((resolve, reject) => {
                let transaction = this.db.transaction("glyphSetStore", "readonly")
                let objectStore = transaction.objectStore("glyphSetStore")
                let getRequest = objectStore.get(this.id)
    
                getRequest.onsuccess = (event) => resolve(event.target.result)
                getRequest.onerror = (event) => reject(event.target.error)
            })

            return data
        }


        catch (error) {
            console.error("Error getting data from object store:", error)

            return null
        }
    }


    async downloadAnswers() {
        await this.getData()

        let data = this.data
        delete data.glyphs

        const dataString = JSON.stringify(data, null, 2)
        const blob = new Blob([dataString], { type: 'application/json' })
        const url = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = url
        a.download = `${this.id.replaceAll(' ', '_')}_answers.json`
        a.click()

        URL.revokeObjectURL(url)
    }


    async addAnswer(answer) {
        await this.init()


        try {
            // get data
            this.data = await this.getData()

            this.answers = toRaw(this.data).answers ? toRaw(this.data).answers : []

            // update data
            this.answers.push(answer)
            this.data.answers = this.answers

            // update db
            const transaction = this.db.transaction("glyphSetStore", "readwrite")
            const objectStore = transaction.objectStore("glyphSetStore")
            const putRequest = objectStore.put(toRaw(this.data))


            putRequest.onerror = (event) => {
                console.error("Error adding answer to DB:", event.target.error)
                return false
            }

            putRequest.onsuccess = (event) => {
                return true
            }
        }


        catch (error) {
            console.error("Error adding answer to DB:", error)
            return false
        }
    }

    async deleteFromIndexedDB() {
        try {
            if (!this.db) {
                await this.init(); // wait for indexedDB
            }


            let data = await new Promise((resolve, reject) => {
                let transaction = this.db.transaction("glyphSetStore", "readwrite")
                let objectStore = transaction.objectStore("glyphSetStore")
                let getRequest = objectStore.delete(this.id)
    
                getRequest.onsuccess = (event) => resolve(event.target.result)
                getRequest.onerror = (event) => reject(event.target.error)
            })
        }


        catch (error) {
            console.error("Error deleting data from object store:", error)
        }
        // Object.keys(this).forEach(key => delete this[key]);
    }


    async deleteAnswers() {
        await this.init()


        try {
            // get data
            this.data = await this.getData()

            // delete answers
            this.data.answers = []

            // update db
            const transaction = this.db.transaction("glyphSetStore", "readwrite")
            const objectStore = transaction.objectStore("glyphSetStore")
            const putRequest = objectStore.put(toRaw(this.data))


            putRequest.onerror = (event) => {
                console.error("Error deleting answers from DB:", event.target.error)
                return false
            }

            putRequest.onsuccess = (event) => {
                return true
            }
        }


        catch (error) {
            console.error("Error deleting answers from DB:", error)
            return false
        }
    }




    async getGlyphPair(lastDistance, lastCorrect, lastValsEqual) {
        await this.init()


        this.actualDistance = this.distance
        let val1;
        let val2;


        // ROTATIONS
        let rotationOptions
        let rotationValue1 = 0
        let rotationValue2 = 0

        if (this.rotation === 1) {
            rotationOptions = [0, 90, 180, 270]
            
            let rotationIndex = getRandomInt(0, rotationOptions.length - 1)
            rotationValue1 = rotationOptions[rotationIndex]
            rotationOptions.splice(rotationIndex, 1)

            rotationIndex = getRandomInt(0, rotationOptions.length - 1)
            rotationValue2 = rotationOptions[rotationIndex]
        }

        else if (this.rotation === 2) {
            rotationOptions = [0, 180]
            
            let rotationIndex = getRandomInt(0, rotationOptions.length - 1)
            rotationValue1 = rotationOptions[rotationIndex]
            rotationOptions.splice(rotationIndex, 1)

            rotationIndex = getRandomInt(0, rotationOptions.length - 1)
            rotationValue2 = rotationOptions[rotationIndex]
        }

        else if (this.rotation === 3) {
            rotationOptions = [0, 90, 180, 270]
            
            let rotationIndex = getRandomInt(0, rotationOptions.length - 1)
            rotationValue1 = rotationOptions[rotationIndex]
            rotationValue2 = rotationValue1
        }



        // GET DISTANCE
        // if last response was correct, decrease distance, otherwise increase distance

        // dont reward equal
        // if (!this.rewardEqual && lastValsEqual && lastDistance != undefined) {
        //     this.actualDistance = lastCorrect ? lastDistance : lastDistance / (this.gamma ** this.regressStep);
        // }

        // // reward equal (normal)
        // else if (lastDistance != undefined) {
        //     this.actualDistance = lastCorrect ? lastDistance * (this.gamma ** this.progressStep) : lastDistance / (this.gamma ** this.regressStep);
        // }


        // // Control distance
        // // if distance is too small, start over
        // if (this.actualDistance < 1) {
        //     this.actualDistance = 20
        // }

        // // distance cannot be higher than the starting distance
        // else if (this.actualDistance > this.glyphStepsCount * 0.2) {
        //     this.actualDistance = this.glyphStepsCount * 0.2
        // }




        // Get new index
        if (!this.rewardEqual && lastValsEqual && lastDistance != undefined) {
            if (lastCorrect) {
                this.stepIndex = this.stepIndex
            }
    
            else {
                this.stepIndex = this.stepIndex - this.regressStep
            }
        }


        else if (lastDistance != undefined) {
            if (lastCorrect) {
                this.stepIndex = this.stepIndex + this.progressStep
            }
    
            else {
                this.stepIndex = this.stepIndex - this.regressStep
            }
        }


        


        this.stepIndex = this.stepIndex < 0 ? 0 : this.stepIndex // is lower than 0
        this.stepIndex = this.stepIndex > this.distanceSteps.length - 1 ? this.distanceSteps.length - 1 : this.stepIndex // is higher than the length
        this.stepIndex = lastDistance === undefined ? 0 : this.stepIndex // is first
        
        // get new distance
        this.actualDistance = this.distanceSteps[this.stepIndex]
        console.log(this.actualDistance)



        this.actualDistance = Math.round(this.actualDistance)

        console.log(this.actualDistance)

        // GET VALUES
        let offset = this.actualDistance / 2

        // Get the middle value. After adding or subtracting the offset, it cannot be lower than 0 or higher than the highest glyph.
        let midVal = getRandomInt(offset, this.glyphStepsCount - offset - 1)

        let randomVal = getRandomInt(0,2)

        // higher, lower or equal
        if (randomVal == 0) {
            val1 = Math.round(midVal - offset);
            val2 = Math.round(midVal + offset);
        }

        else if (randomVal == 1) {
            val1 = Math.round(midVal + offset);
            val2 = Math.round(midVal - offset);
        }

        else {
            val1 = getRandomInt(0, this.glyphStepsCount - 1);
            val2 = val1;
        }



        logMessage('-')
        logMessage(`New glyph pair: ${this.id}, values: ${val1}, ${val2}, distance: ${Math.round(this.actualDistance)}, rotations: ${rotationValue1}, ${rotationValue2}, gamma: ${this.gamma}`)
        
        return {val1:val1, val2:val2, distance:this.actualDistance, rotation:this.rotation, rotationValue1:rotationValue1, rotationValue2:rotationValue2}
    }



    async decodeGlyph(glyph) {
        await this.init()



        let compressedBinary = Uint8Array.from(atob(glyph), c => c.charCodeAt(0)); // Base64 to binary
        let decompressedBinary = pako.ungzip(compressedBinary); // decompress
        let base64Image = btoa(String.fromCharCode(...decompressedBinary)); // back to Base64

        return `data:image/png;base64,${base64Image}`
    }


    async getStats() {
        await this.init()


        let allAnswers = await this.getData()
        allAnswers = allAnswers.answers


        // success rate
        try {
            this.successRate = Math.round((allAnswers.filter(x => x.correct).length / allAnswers.length) * 100)
        }

        catch (error) {
            this.successRate = 0
            console.warn('Could not get success rate ' + error);
        }

        if (isNaN(this.successRate)) {
            this.successRate = 0
        }

        // sorted count
        this.sortedCount = allAnswers.length


        // time per sort and session time
        try {
            this.sessionTime = 0

            this.sortTime = parseFloat((this.answers.reduce((sum, obj) => sum + obj.time, 0) / this.answers.length / 1000).toFixed(2))
        }

        catch (error) {
            this.sortTime = 0
            this.sessionTime = 0
            console.warn('Could not get time per sort ' + error);
        }



        // smallest distance
        try {
            this.smallestDistance = Math.min(...allAnswers.map(x => x.distance))
        }

        catch (error) {
            this.smallestDistance = 0
            console.warn('Could not get the smallest distance ' + error);
        }
    }


    async getChartData() {
        await this.init()

        let allAnswers = await this.getData()
        allAnswers = allAnswers.answers

        // get distances
        let distances = []

        allAnswers.forEach(answer => {
            if (!distances.includes(answer.distance)) {
                distances.push(answer.distance)
            } 
        });

        distances.sort((a, b) => a - b)


        // sort answers 

        // 0, 90, 180, 270, all
        let diffsAndErrs = [[], [], [], [], []]
        let diffsAndAnswerCount = []


        distances.forEach(distance => {
            for (let i = 0; i < 4; i++) {
                let correctCount = 0
                let count = 0
                let rotationVal = i * 90

                // TODO: add rotation val 2
                allAnswers.filter(item => item.distance == distance && item.rotationValue1 == rotationVal).forEach(answer => {
                    if (answer.correct) {
                        correctCount++
                    }

                    count++
                })

                // diffsAndErrs[Math.round(distance / this.glyphStepsCount * 100)] = 100 - Math.round((correctCount / count) * 100)
                diffsAndErrs[i].push({'x':(distance / this.glyphStepsCount * 100).toFixed(2), 'y':100 - Math.round((correctCount / count) * 100)})
            }


            // all
            let correctCount = 0
            let count = 0

            let distanceAnswers = allAnswers.filter(item => item.distance == distance)



            distanceAnswers.forEach(answer => {
                if (answer.correct) {
                    correctCount++
                }

                count++
            })

            console.log(distance / this.glyphStepsCount * 100)

            // diffsAndErrs[Math.round(distance / this.glyphStepsCount * 100)] = 100 - Math.round((correctCount / count) * 100)
            diffsAndErrs[4].push({'x':(distance / this.glyphStepsCount * 100).toFixed(2), 'y':100 - Math.round((correctCount / count) * 100)})
            diffsAndAnswerCount.push({'x':(distance / this.glyphStepsCount * 100).toFixed(2), 'y':distanceAnswers.length})
        });



        // Glyph accuracy and value chart
        
        let accuracyAndVal = []
        let valueGroup = (this.glyphStepsCount / 10)
        
        for (let i = 0; i < this.glyphStepsCount / valueGroup; i++) {
            let answerGroup = allAnswers.filter(answer => (answer.val1 + answer.val2) / 2 > valueGroup * i && (answer.val1 + answer.val2) / 2 <= valueGroup * (i + 1))

            let correctCount = 0

            answerGroup.forEach(answer => {
                if (answer.correct) {
                    correctCount++
                }
            })


            let accuracy = Math.round((correctCount / answerGroup.length) * 100)
            accuracy = accuracy == 0 ? 1 : accuracy
            accuracy = isNaN(accuracy) || accuracy == null ? 0 : accuracy

            accuracyAndVal.push({'x': ((valueGroup * i) / this.glyphStepsCount) * 100, 'y':accuracy})
        }


        return [diffsAndErrs, accuracyAndVal, diffsAndAnswerCount]
    }



    async toggleRotation(mode) {
        await this.getData()

        this.rotation = mode
        this.data.rotation = this.rotation

        console.log(mode)

        await this.saveData()
    }


    toggleRotationClass(hover) {
        if (this.rotation && this.rotationClass == 'normalBtnOff' && !hover) {
            this.rotationClass = 'normalBtnOn'
        }

        else if (!this.rotation && this.rotationClass == 'normalBtnOn' && !hover) {
            this.rotationClass = 'normalBtnOff'
        }
    }
}



function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}




export default GlyphSet