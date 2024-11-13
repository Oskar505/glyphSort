class GlyphSet {
    constructor(id, glyphs=[], info={}, distance=undefined, gamma=0.7, equalChance=1) {
        this.id = id
        this.data = this.getData()

        console.log(this.data)

        if (this.data == null || !this.data) {
            // TODO: get from zip
            // this.glyphs = Array.from({ length: 100 }, (_, index) => index)
            
            

            this.glyphs = glyphs

            this.distance = distance
            this.actualDistance = distance
            this.gamma = gamma
            this.glyphStepsCount = this.glyphs.length
            this.equalChance = equalChance // 1 = 10%

            if (distance == undefined) {
                this.distance = this.glyphStepsCount * 0.2
            }


            console.log(info)

            // save
            this.data = {
                "id": this.id,
                "name": info.name,
                "author": info.author,
                "version": info.version,
                "glyphs": this.glyphs,
                "distance": this.distance,
                "gamma": this.gamma,
                "glyphStepsCount": this.glyphStepsCount,
                "equalChance": this.equalChance,
                "answers": [],
            }

            this.saveData(this.data)
        }


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
        }


        this.successRate = 0
        this.sortedCount = 0
        this.sortTime = 0
        this.sessionTime = 0
        this.smallestDistance = 0
    }


    //CRUD
    saveGlyphsFromZip(glyphs) {
        this.glyphs = []
        let base64Image;

        for(const glyph of glyphs) {
            base64Image = btoa(glyph)
            this.glyphs.push(base64Image)
        }

        console.log(this.glyphs[0])

        // for(const glyph of glyphs) {
        //     base64Image = new Promise((resolve, reject) => {
        //         const reader = new FileReader()

        //         console.log(typeof glyph)

        //         reader.readAsDataURL(glyph)
        //         reader.onload = () => resolve(reader.result)
        //         reader.onerror = error => reject(error)
        //     })

        //     this.glyphs.push(base64Image)
        // }

        this.data["glyphs"] = this.glyphs

        return this.data
    }

    saveData(data) {
        data = this.saveGlyphsFromZip(data.glyphs)

        console.log(data)

        localStorage.setItem(this.id, JSON.stringify(data))
        

        let glyphSetList = localStorage.getItem("glyphSetList") ? JSON.parse(localStorage.getItem("glyphSetList")) : [];
        glyphSetList.push(this.id)
        localStorage.setItem("glyphSetList", JSON.stringify(glyphSetList))
    }

    getData() {
        let data = localStorage.getItem(this.id)
        return data ? JSON.parse(data) : null
    }

    addAnswer(answer) {
        let data = localStorage.getItem(this.id)

        if (!data) {
            console.warn("no data found in local storage")
            return false
        }

        data = JSON.parse(data)
        data.answers.push(answer)

        localStorage.setItem(this.id, JSON.stringify(data))
    }

    deleteData() {
        localStorage.removeItem(this.id)
    }




    getGlyphPair(lastDistance, lastCorrect) {
        this.actualDistance = this.distance
        let val1;
        let val2;


        // if last response was correct, decrease distance, otherwise increase distance
        if (lastDistance != undefined) {
            this.actualDistance = lastCorrect ? lastDistance * this.gamma : lastDistance / this.gamma;
        }


        // if distance is too small, start over
        if (this.actualDistance < 1) {
            this.actualDistance = 20
            console.warn("distance too small, starting over");
        }

        // distance cannot be higher than the starting distance
        else if (this.actualDistance > this.glyphStepsCount * 0.2) {
            this.actualDistance = this.glyphStepsCount * 0.2 
            console.warn("distance too high, starting over");
        }



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
        console.log(atob(this.glyphs[0]))


        console.log(val1, val2)
        

        return {val1:val1, val2:val2, distance:this.actualDistance}
    }


    getStats() {
        let allAnswers = this.getData().answers


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
        }

        catch (error) {
            this.smallestDistance = 0
            console.warn('Could not get the smallest distance ' + error);
        }
    }


    getChartData() {
        let allAnswers = this.getData().answers

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