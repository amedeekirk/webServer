<template>
  <canvas class="game-whiteboard">whiteboard</canvas>
</template>

<script>
export default {
  name: 'GameWhiteboard',
};
</script>

<style scoped>
  .game-whiteboard {
    background-color: #222222;
    grid-column: board-w-start / board-w-end;
    grid-row: board-h-start / board-h-end;
  }
</style>
