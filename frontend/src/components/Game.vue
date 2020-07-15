<template>
  <div class="game">
    <GamePlayers/>
    <GameWhiteboard/>
    <GameTools/>
  </div>
</template>

<script>
import GamePlayers from './GamePlayers.vue';
import GameWhiteboard from './GameWhiteboard.vue';
import GameTools from './GameTools.vue';

export default {
  name: 'Game',
  components: { GameTools, GameWhiteboard, GamePlayers },
};
</script>

<style scoped>
  .game {
    display: grid;
    height: 100%;
    grid-template-rows: [board-h-start] 9fr [board-h-end tools-start] 1fr [tools-end];
  }
</style>
