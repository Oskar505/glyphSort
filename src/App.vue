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

    /* border */
    --border2: #999;
    --border3: #bbb;
    --preview-img-border: #444;
    
    /* highlight */
    --highlight-color: #000;
    --enabled: #4a90e2;

    /* shadow */
    --shadow1: #eee;
    --shadow2: #dedede;
  }

  [data-theme="dark"] {
    /* bg */
    --element-bg: #222;
    --page-bg: #111;

    /* text */
    --header: #eee;
    --text: #dedede;
    --text2: #ccc;

    /* border */
    --border2: #555;
    --border3: #444;
    --preview-img-border: #555;

    /* highlight */
    --highlight-color: #fff;
    --enabled: #4a90e2;

    /* shadow */
    --shadow1: rgba(0, 0, 0, 0);
    --shadow2: rgba(0, 0, 0, 0);
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

  


  header {
    padding-left: 40px;
    /* border-bottom: 1px solid #ddd; */
    border-bottom: 1px solid var(--border3); 
    background-color: var(--page-bg);
    box-shadow: 0px 0px 10px var(--shadow1);
    background-color: var(--element-bg);
    margin-bottom: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  h1 {
    font-size: 37px;
    color: var(--header);
  }

  nav {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  nav div {
    padding: 17px;
    border-left: 1px solid var(--border3);
    cursor: pointer;
  }

  /* nav div:first-of-type {
    border-left: 1px solid #444;
  } */

  nav div h2 {
    font-size: 26px !important;
    color: var(--text2) !important;
    line-height: 1;
    font-weight: 400;
  }

  .secondaryNavBtn {
    height: 60px;
  }

  .secondaryNavBtn svg {
    height: 30px;
  }

  .navActive {
    color: #333;
    font-weight: 700;
  }


  .wideContainer {
    max-width: 1900px;
    margin: 0 auto
  }


  .middlePageWarning {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .middlePageWarning h1 {
    font-size: 45px;
  }

  .middlePageWarning h2 {
    font-size: 30px;
    font-weight: 500;
    color: var(--text);
    margin-bottom: 1.3em;
  }

  .middlePageWarning a {
    color: #333;
    font-weight: 700;
  }
</style>
