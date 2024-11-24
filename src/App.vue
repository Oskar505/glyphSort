<script>

</script>

<template>
  <router-view/>
</template>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

  * {
    margin: 0;
    padding: 0;
    font-family: "Roboto", serif;
    box-sizing: border-box;
  }

  a{
    color: #000;
  }


  header {
    padding-left: 40px;
    /* border-bottom: 1px solid #ddd; */
    border-bottom: 1px solid #bbb;
    background-color: #fff;
    box-shadow: 0px 0px 10px #eee;
    background-color: #fcfcfc;
    margin-bottom: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  h1 {
    font-size: 37px;
    color: #333;
  }

  nav {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  nav div {
    padding: 17px;
    border-left: 1px solid #bbb;
    cursor: pointer;
  }

  /* nav div:first-of-type {
    border-left: 1px solid #444;
  } */

  nav div h2 {
    font-size: 26px !important;
    color: #666 !important;
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
    color: #444;
  }

  .middlePageWarning a {
    color: #333;
    font-weight: 700;
  }
</style>
