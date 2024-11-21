<template>
    <header>
        <h1 @click="clearStorage()">Calibration</h1>

        <nav>
            <div @click="this.$router.push({path:'/'})"><h2>Home</h2></div>
            <div @click="this.$router.push({path:'/sort', query: {glyphSetIds: JSON.stringify(selectedGlyphs)}})"><h2>Sort</h2></div>
            <div @click="this.$router.push({path:'/results', query: {glyphSetIds: JSON.stringify(selectedGlyphs)}})"><h2>Results</h2></div>
        </nav>
    </header>


    <main>
        <div class="cardCalibrationWrapper">
            <h2>How wide is this rectangle in milimeters?</h2>
            <div class="card"></div>
        </div>

    </main>
</template>


<script>
    export default {
        
    }
</script>



<style scoped>
    .cardCalibrationWrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 50px;
        border-radius: 15px;
        background-color: #fcfcfc;
        box-shadow: 0px 0px 15px #dedede;
        border: 3px solid #999;
        margin-top: 13%;
        padding: 30px 80px;
        user-select: none;
    }

    h2 {
        color: #444;
        font-size: 30px;
    }

    .card {
        width: 200px;
        height: 200px;
        background-color: #999;
    }
</style>