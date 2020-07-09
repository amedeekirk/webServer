<template>
  <div class="room-select">
    <div class="room-select__title">Pictionary</div>
    <div class="room-select__group">
      <label for="room-entry">Enter room code:</label>
      <input type="text" id="room-entry">
    </div>
  </div>
</template>

<script>
export default {
  name: 'RoomSelect',
};
</script>

<style scoped lang="scss">
  .room-select {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 12rem;

    &__title {
      font-size: 5rem;
      margin-bottom: 4rem;
    }

    &__group {
      display: flex;
      flex-direction: column;
      text-transform: uppercase;
      width: 15%;

      label {
        margin-bottom: .5rem;
      }

      input {
        width: 100%;
      }

    }
  }
</style>
