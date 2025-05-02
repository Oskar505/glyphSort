<script>
  // get preferred theme
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const preferredTheme = prefersDark ? 'dark' : 'light';

  let theme;

  localStorage.getItem('theme') ? theme = localStorage.getItem('theme') : theme = preferredTheme

  document.documentElement.setAttribute('data-theme', theme);
</script>

<template>
  <router-view/>
</template>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');


  /* light/dark */
  /* TODO: add more variables */
  :root {
    /* bg */
    --page-bg: #fff;
    --element-bg: #fcfcfc;

    /* text */
    --header: #333;
    --text: #444;
    --text2: #666;
    --text3: #808080;

    /* border */
    --border2: #999;
    --border3: #bbb;
    --preview-img-border: #444;
    
    /* highlight */
    --highlight-color: #000;
    --enabled: #4a90e2;
    --enabled-bg: #d6e4ff;

    /* shadow */
    --shadow1: #eee;
    --shadow2: #dedede;
    --shadow3: #bababa;

    /* loading */
    --loading-filter: #ffffff4d;
  }

  [data-theme="dark"] {
    /* bg */
    --element-bg: #222;
    --page-bg: #111;

    /* text */
    --header: #eee;
    --text: #dedede;
    --text2: #ccc;
    --text3: #919191;

    /* border */
    --border2: #555;
    --border3: #444;
    --preview-img-border: #555;

    /* highlight */
    --highlight-color: #fff;
    --enabled: #4a90e2;
    --enabled-bg: #263443;

    /* shadow */
    --shadow1: rgba(0, 0, 0, 0);
    --shadow2: rgba(0, 0, 0, 0);
    --shadow3: rgba(0, 0, 0, 0);

    /* loading */
    --loading-filter: #0000004d;
  }



  html {
    font-size: 62.5%;
    /* font-size: 60%; */
  }


  * {
    margin: 0;
    padding: 0;
    font-family: "Roboto", serif;
    box-sizing: border-box;
  }

  a{
    color: var(--highlight-color);
  }


  body {
    background-color: var(--page-bg);
  }



  .btn {
    cursor: pointer;
    user-select: none;
  }

  .btn:hover {
    color: var(--page-bg) !important;
    border-color: var(--enabled) !important;
    background-color: var(--enabled) !important;
    transition: 0.3s ease !important;
  }
  



  .wideContainer {
    max-width: 190rem;
    margin: 0 auto
  }


  .middlePageWarning {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .middlePageWarning h1 {
    font-size: 4.5rem;
    color: var(--header);
  }

  .middlePageWarning h2 {
    font-size: 3rem;
    font-weight: 500;
    color: var(--text);
    margin-bottom: 1.3em;
  }

  .middlePageWarning a {
    color: var(--header);
    font-weight: 700;
  }



  .fade2-enter-active {
    transition: opacity 0.7s ease;
  }

  .fade2-leave-active {
    transition: none;
  }

  .fade2-enter-from,
  .fade2-leave-to {
    opacity: 0;
  }






  @media only screen and (max-width: 1700px) {
    html {
      font-size: 58%;
    }
  }

  @media only screen and (max-width: 1500px) {
    html {
      font-size: 55%;
    }
  }

  @media only screen and (max-width: 1250px) {
    html {
      font-size: 50%;
    }
  }

  @media only screen and (max-width: 1000px) {
    html {
      font-size: 48%;
    }
  }

  @media only screen and (max-width: 600px) {

  }
</style>
