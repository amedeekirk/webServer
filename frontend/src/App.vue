<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
  #app {
    min-height: 100vh;
    display: grid;
    grid-template-rows: .5fr 23fr;
  }
</style>
