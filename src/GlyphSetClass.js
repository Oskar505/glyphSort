class GlyphSet {
    constructor(id, distance=undefined, gamma=0.7, equalChance=1) {
        this.id = id
        this.data = this.getData()

        if (this.data == null || !this.data) {
            // TODO: get from zip
            this.glyphs = Array.from({ length: 100 }, (_, index) => index)
            this.distance = distance
            this.actualDistance = distance
            this.gamma = gamma
            this.glyphStepsCount = this.glyphs.length
            this.equalChance = equalChance // 1 = 10%

            if (distance == undefined) {
                this.distance = this.glyphStepsCount * 0.2
            }


            // save
            this.data = {
                "id": this.id,
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
        }


        this.successRate = 0
        this.sortedCount = 0
        this.sortTime = 0
        this.sessionTime = 0
        this.smallestDistance = 0
    }


    //CRUD
    saveData(data) {
        localStorage.setItem(this.id, JSON.stringify(data))
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
            let midVal = getRandomInt(offset, this.glyphStepsCount - offset)

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
            val1 = getRandomInt(0, this.glyphStepsCount);
            val2 = val1;
        }



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
}



function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}




export default GlyphSet