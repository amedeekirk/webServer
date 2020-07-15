<template>
  <div class="game-tools text-white">
    <div v-if="true">
      <div>Your word is</div>
      <div class="text-xl font-semibold mb-2">{{word}}</div>
      <div class="game-tools__btn-group">
        <button class="bg-secondary p-2 mr-1" @click="clearCanvas">Clear</button>
        <button class="bg-secondary p-2 ml-1">Brush</button>
      </div>
    </div>
    <div v-if="false">
      <label for="user-guess">Guess the word:</label>
      <input type="text" id="user-guess">
    </div>
    <GameToolsBrush/>
  </div>
</template>

<script>
import GameToolsBrush from './GameToolsBrush.vue';

export default {
  name: 'GameTools',

  components: { GameToolsBrush },

  data() {
    return {
      word: 'test',
    };
  },

  methods: {
    clearCanvas() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
  },

  computed: {
    ctx: {
      get() {
        return this.$store.state.ctx;
      },
      set(newValue) {
        return this.$store.commit('mutateCtx', newValue);
      },
    },

    canvas: {
      get() {
        return this.$store.state.canvas;
      },
      set(newValue) {
        return this.$store.commit('mutateCanvas', newValue);
      },
    },
  },
};
</script>

<style scoped lang="scss">
  .game-tools {
    background-image: linear-gradient(to bottom right,
      var(--color-primary-dark),
      var(--color-primary-light)
    );
    grid-row: tools-start / tools-end;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;

    button {
      border-radius: 3px;
      background-image: linear-gradient(to bottom right,
        var(--color-secondary-dark),
        var(--color-secondary-light)
      );

      &:hover {
        filter: brightness(94%);
      }
      &:focus {
        outline: none;
      }
    }
  }
</style>
