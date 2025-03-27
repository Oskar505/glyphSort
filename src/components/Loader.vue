<template>
    <div class="loader-overlay">
        <div v-if="!sort" class="loader"></div>
    </div>

    <div v-if="sort" class="loader-overlay-sort">
        <div class="loader-sort"></div>
    </div>

    <div v-if="fileInput" class="loader-overlay-fileInput">
        <div class="loader"></div>
    </div>
</template>
  
<style scoped>
    .loader-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: wait;
    }

    .loader-overlay-sort {
        cursor: wait;
        position: absolute;
    }

    .loader-overlay-fileInput {
        position: absolute;
        inset: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: wait;
    }
  
    .loader {
        width: 50px;
        height: 50px;
        border: 4px solid transparent;
        border-top-color: var(--text);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    .loader-sort {
        width: 50px;
        height: 50px;
        border: 4px solid transparent;
        border-top-color: var(--text);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }


  
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
</style>


<script>
    export default {
        props: {
            sort: {
                type: Boolean,
                default: false
            },

            fileInput: {
                type: Boolean,
                default: false
            },
        }
    }
</script>
  