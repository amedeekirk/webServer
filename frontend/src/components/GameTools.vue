<template>
  <div class="game-tools">tools</div>
</template>

<script>
export default {
  name: 'GameTools',
};
</script>

<style scoped>
  .game-tools {
    background-color: #00FF00;
    grid-column: board-w-start / board-w-end;
    grid-row: tools-start / tools-end;
  }
</style>
