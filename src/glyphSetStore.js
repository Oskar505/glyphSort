// stores/arrayStore.js
import { defineStore } from 'pinia'

export const useGlyphSetStore = defineStore('array', {
    state: () => ({
        glyphSets: []
    }),
    actions: {
        addglyphSet(setId) {
            this.glyphSets.push(setId)
        },
        removeglyphSet(index) {
            this.glyphSets.splice(index, 1)
        },
        clearglyphSets() {
            this.glyphSets = []
        },

        handleSetSelection(setId) {
            if (this.glyphSets.includes(setId)) {
                console.log('remove ' + setId)
                this.glyphSets.splice(this.glyphSets.indexOf(setId), 1)
            } 
            
            else {
                console.log('add ' + setId)
                this.glyphSets.push(setId)
            }
        }
    }
})
