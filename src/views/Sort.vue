<template>
    <header>
        <h1>Sort</h1>
    </header>

    
    <div class="sortWrapper">
        <div class="glyphCardWrapper">
            <glyph-card value="1"></glyph-card>
            <glyph-card value="2"></glyph-card>
        </div>
        

        <div class="answerBtnWrapper">
            <div class="answerBtn" id="lessBtn">
                <p><</p>
            </div>

            <div class="answerBtn" id="lessBtn">
                <p>=</p>
            </div>

            <div class="answerBtn" id="lessBtn">
                <p>></p>
            </div>
        </div>
        
    </div>
</template>


<script>

</script>


<style scoped>
    header {
        padding: 10px 100px;
        /* border-bottom: 2px solid #11406e; */
        background-color: #00ace6;
    }

    h1 {
        font-size: 37px;
        color: white;
    }


    .sortWrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 50px;
        border-radius: 15px;
        border: 3px solid #00ace6;
        background-color: #ffffff;
        max-width: 500px;
        margin: 0 auto;
        margin-top: 5%;
        padding: 30px 40px;
    }

    .glyphCardWrapper {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 100px;
    }

    .answerBtnWrapper {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 40px;
    }


    .answerBtn {
        font-size: 50px;
        font-weight: bold;
        border: 2px solid black;
        padding: 0 25px;
        border-radius: 15px;
    }
</style>