<template>
  <div class="home">
    <RoomSelect v-if="false"/>
    <Game/>
  </div>
</template>

<script>
import RoomSelect from '../components/RoomSelect.vue';
import Game from '../components/Game.vue';

export default {
  name: 'Home',
  components: {
    Game,
    RoomSelect,
  },
};
</script>

<style scoped>

</style>
