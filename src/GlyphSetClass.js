import pako from 'pako'
import { toRaw } from 'vue'


class GlyphSet {
    constructor(id, glyphs=[], info={}, distance=undefined, gamma=0.7, equalChance=1) {
        this.id = id
        this.info = info
        this.glyphs = glyphs

        this.distance = distance
        this.actualDistance = distance
        this.gamma = gamma
        this.glyphStepsCount = this.glyphs.length
        this.equalChance = equalChance // 1 = 10%
        this.db = null
        this.answers = []

        if (distance == undefined) {
            this.distance = this.glyphStepsCount * 0.2
        }


        // this.data = {
        //     "id": null,
        //     "name": null,
        //     "author": null,
        //     "version": null,
        //     "glyphs": null,
        //     "distance": null,
        //     "gamma": null,
        //     "glyphStepsCount": null,
        //     "equalChance": null,
        //     "answers": null,
        // }


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
                                console.log("Object store created.")
                
                                objectStore.createIndex("setId", "id", { unique: false })
                            }
            
                            resolve(db)
                        }
            
                        request.onsuccess = (event) => resolve(event.target.result)
                        request.onerror = (event) => reject(event.target.error)
                    })






                    this.data = await this.getData()

                    console.log(this.data)

                    // Create new glyph set
                    if (this.data == null || !this.data) {
                        // // from blob to url
                        // console.log(typeof this.glyphs, this.glyphs)

                        // this.glyphs.forEach((glyph, index) => {
                        //     console.log(glyph)

                        //     this.glyphs[index] = URL.createObjectURL(glyph)
                        // });


                        // save
                        this.data = {
                            "id": this.id,
                            "name": this.info.name,
                            "author": this.info.author,
                            "version": this.info.version,
                            "glyphs": this.glyphs,
                            "distance": this.distance,
                            "gamma": this.gamma,
                            "glyphStepsCount": this.glyphStepsCount,
                            "equalChance": this.equalChance,
                            "answers": this.answers, // []
                        }

                        console.log(this.glyphs)

                        await this.saveData()
                    }



                    // Load glyph set
                    else {
                        this.glyphs = this.data.glyphs
                        this.distance = this.data.distance
                        this.actualDistance = this.distance
                        this.gamma = this.data.gamma
                        this.glyphStepsCount = this.glyphs.length
                        this.equalChance = this.data.equalChance // 1 = 10%
                        this.name = this.data.name
                        this.author = this.data.author
                        this.version = this.data.version
                        this.answers = this.data.answers
                    }


                    this.successRate = 0
                    this.sortedCount = 0
                    this.sortTime = 0
                    this.sessionTime = 0
                    this.smallestDistance = 0



                    // mark as initialized
                    resolve()
                }


                catch (error) {
                    console.error("Error during initialization of GlyphSetClass:", error)
                    reject(error)
                }
            })
        }


        else {
            console.log("Glyph set is already initialized")
        }

        console.log('init finished')

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

        console.log(this.glyphs[0])


        this.data["glyphs"] = this.glyphs

        return this.glyphs
    }

    async saveData() {
        // await this.init()


        this.convertGlyphsToBase64(this.data.glyphs)

        console.log(this.data)


        // update glyph set list
        let glyphSetList = localStorage.getItem("glyphSetList") ? JSON.parse(localStorage.getItem("glyphSetList")) : [];
        console.log(glyphSetList)
        glyphSetList.push(this.id)
        localStorage.setItem("glyphSetList", JSON.stringify(glyphSetList))

        console.log(glyphSetList)


        // indexedDB
        let transaction = this.db.transaction("glyphSetStore", "readwrite")
        let objectStore = transaction.objectStore("glyphSetStore")

        console.log(this.data)
        
        let putRequest = objectStore.put(this.data)

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
    
            console.log(data)

            return data
        }


        catch (error) {
            console.error("Error getting data from object store:", error)

            return null
        }
    }

    async addAnswer(answer) {
        await this.init()


        try {
            // get data
            this.data = await this.getData()

            console.log(this.data.answers)

            this.answers = toRaw(this.data).answers ? toRaw(this.data).answers : []

            // update data
            this.answers.push(answer)
            this.data.answers = this.answers

            // update db
            const transaction = this.db.transaction("glyphSetStore", "readwrite")
            const objectStore = transaction.objectStore("glyphSetStore")
            const putRequest = objectStore.put(toRaw(this.data))


            putRequest.onerror = (event) => {
                console.error("Error adding answer DB:", event.target.error)
                return false
            }

            putRequest.onsuccess = (event) => {
                return true
            }
        }


        catch (error) {
            console.error("Error adding answer DB:", error)
            return false
        }
    }

    async deleteFromIndexedDB() {
        console.log("deleting class")

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
    
            console.log(data)
        }


        catch (error) {
            console.error("Error deleting data from object store:", error)
        }
        // Object.keys(this).forEach(key => delete this[key]);
    }




    async getGlyphPair(lastDistance, lastCorrect) {
        await this.init()



        this.actualDistance = this.distance
        let val1;
        let val2;

        console.log(lastDistance, this.gamma, this.actualDistance)


        // if last response was correct, decrease distance, otherwise increase distance
        if (lastDistance != undefined) {
            this.actualDistance = lastCorrect ? lastDistance * this.gamma : lastDistance / this.gamma;
        }


        // if distance is too small, start over
        if (this.actualDistance < 1) {
            this.actualDistance = 20
            console.info("distance too small, starting over");
        }

        // distance cannot be higher than the starting distance
        else if (this.actualDistance > this.glyphStepsCount * 0.2) {
            this.actualDistance = this.glyphStepsCount * 0.2 
            console.info("distance too high, starting over");
        }


        console.log(this.actualDistance)


        // chance of getting equal values
        if (getRandomInt(0, 9) > this.equalChance) {
            let offset = this.actualDistance / 2

            // Get the middle value. After adding or subtracting the offset, it cannot be lower than 0 or higher than the highest glyph.
            let midVal = getRandomInt(offset, this.glyphStepsCount - offset - 1)
 
            // higher of lower
            if (getRandomInt(0,1) == 0) {
                val1 = Math.round(midVal - offset);
                val2 = Math.round(midVal + offset);
            }

            else {
                val1 = Math.round(midVal + offset);
                val2 = Math.round(midVal - offset);
            }
        }


        else {
            val1 = getRandomInt(0, this.glyphStepsCount - 1);
            val2 = val1;
        }




        console.log(this.glyphs[0])
        // console.log(atob(this.glyphs[0]))


        console.log(val1, val2)
        

        return {val1:val1, val2:val2, distance:this.actualDistance}
    }



    async decodeGlyph(glyph) {
        await this.init()



        console.log(glyph)
        console.log(this.data)

        let compressedBinary = Uint8Array.from(atob(glyph), c => c.charCodeAt(0)); // Base64 to binary
        let decompressedBinary = pako.ungzip(compressedBinary); // decompress
        let base64Image = btoa(String.fromCharCode(...decompressedBinary)); // back to Base64

        return `data:image/png;base64,${base64Image}`
    }


    async getStats() {
        await this.init()


        let allAnswers = await this.getData()
        allAnswers = allAnswers.answers

        console.log(allAnswers)


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
            this.sessionTime = allAnswers[allAnswers.length - 1].time - allAnswers[0].time
            this.sortTime = ((this.sessionTime / allAnswers.length) / 1000).toFixed(2)

            

            if (this.sortTime > 7) {
                let lastTime = 0

                allAnswers.forEach(element => {
                    if (lastTime == 0) {
                        lastTime = element.time
                    }

                    let timeDiff = element.time - lastTime

                    if (timeDiff > 7000) {
                        this.sessionTime = this.sessionTime - timeDiff
                    }

                    lastTime = element.time
                });


            }


            this.sortTime = ((this.sessionTime / allAnswers.length) / 1000).toFixed(2)
            this.sessionTime = ((this.sessionTime / 1000)).toFixed(2)
        }

        catch (error) {
            this.sortTime = 0
            this.sessionTime = 0
            console.warn('Could not get time per sort ' + error);
        }



        // smallest distance
        try {
            console.log(...allAnswers.map(x => x.distance))
            this.smallestDistance = Math.min(...allAnswers.map(x => x.distance))
            console.log(this.smallestDistance)
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


        // sort answers
        let diffsAndErrs = []

        distances.forEach(distance => {
            let correctCount = 0
            let count = 0

            allAnswers.filter(item => item.distance == distance).forEach(answer => {
                if (answer.correct) {
                    correctCount++
                }

                count++
            })

            // diffsAndErrs[Math.round(distance / this.glyphStepsCount * 100)] = 100 - Math.round((correctCount / count) * 100)
            diffsAndErrs.push({'x':(distance / this.glyphStepsCount * 100).toFixed(2), 'y':100 - Math.round((correctCount / count) * 100)})
        });



        // Glyph accuracy and value chart
        
        let accuracyAndVal = []
        let valueGroup = (this.glyphStepsCount / 10)
        
        for (let i = 0; i < this.glyphStepsCount / valueGroup; i++) {
            let answerGroup = allAnswers.filter(answer => (answer.val1 + answer.val2) / 2 > valueGroup * i && (answer.val1 + answer.val2) / 2 <= valueGroup * (i + 1))
            console.log(answerGroup)


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


        console.log(accuracyAndVal)


        return [diffsAndErrs, accuracyAndVal]
    }
}



function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}




export default GlyphSet