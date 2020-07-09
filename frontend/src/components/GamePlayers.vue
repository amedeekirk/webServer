<template>
  <div class="game-players">players</div>
</template>

<script>
export default {
  name: 'GamePlayers',
};
</script>

<style scoped>
  .game-players {
    background-color: #0000FF;
    grid-column: players-start / players-end;
    grid-row: board-h-start / tools-end;
  }
</style>
