<template>
  <div class="brush-modal" :class="{hidden: isHidden}">
    <div id="brush-modal__colors">
      <div class="color-box color-black"
           :class="{highlighted: isBlack}"
           @click="changeBrush('#000')" />
      <div class="color-box color-red"
           :class="{highlighted: isRed}"
           @click="changeBrush('#F00')"/>
      <div class="color-box color-green"
           :class="{highlighted: isGreen}"
           @click="changeBrush('#0F0')"/>
      <div class="color-box color-blue"
           :class="{highlighted: isBlue}"
           @click="changeBrush('#00F')"/>
      <div class="color-box eraser"
           :class="{highlighted: isWhite}"
           @click="changeBrush('#FFF')">
        <img id='eraser' title='eraser' src="../assets/EraserWhite-64.png">
      </div>

    </div>
    <div id="brush-modal__custom">
      <input class="customColor" type="text"  maxlength="7" v-model="selectedColor">
      <br>
      <input class="brushSlider" type="range" min="1" max="19" v-model="selectedSize">
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameToolsBrush',
  props: {
    isHidden: Boolean,
  },
  data() {
    return {
      selectedColor: this.$store.state.brushColor,
      selectedSize: this.$store.state.brushSize,
    };
  },
  methods: {
    changeBrush(color) {
      this.selectedColor = color;
    },
  },
  computed: {
    isBlack() {
      return this.selectedColor.toUpperCase() === '#000'
        || this.selectedColor.toUpperCase() === '#000000';
    },
    isWhite() {
      return this.selectedColor.toUpperCase() === '#FFF'
        || this.selectedColor.toUpperCase() === '#FFF';
    },
    isRed() {
      return this.selectedColor.toUpperCase() === '#F00'
        || this.selectedColor.toUpperCase() === '#FF0000';
    },
    isGreen() {
      return this.selectedColor.toUpperCase() === '#0F0'
        || this.selectedColor.toUpperCase() === '#00FF00';
    },
    isBlue() {
      return this.selectedColor.toUpperCase() === '#00F'
        || this.selectedColor.toUpperCase() === '#0000FF';
    },
  },
  watch: {
    selectedColor(color) {
      const validColor = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color);
      if (validColor) {
        this.$store.commit('mutateBrushColor', color);
      }
    },
    selectedSize(size) {
      if (size <= 20) {
        this.$store.commit('mutateBrushSize', size);
      }
    },
  },
};
</script>

<style scoped lang="scss">
  .brush-modal {
    position: absolute;
    top: 80%;
    left: 50%;
    transform: translateX(-50%);
    border: 1px solid #333333;
    border-radius: 4px;
    z-index: 10;
    background-image: linear-gradient(to bottom left,
      var(--color-primary-dark),
      var(--color-primary-light)
    );
    box-sizing: border-box;

    &__colors {
      display: flex;

      &:first-child {
        margin-left: 1vmax;
      }

      &:last-child {
        margin-right: 1vmax;
      }
    }

    .color-box {
      display: inline-block;
      margin: 1vmax .5vmax .5vmax;
      padding: 0;
      height: 2vmax;
      width: 2vmax;
      border: 1px solid #FFFFFF;
    }

    .eraser {
      max-height: 2vmax;
    }

    .color-black {
      background-color: #000000;
    }

    .color-red {
      background-color: #FF0000;
    }

    .color-green {
      background-color: #00FF00;
    }

    .color-blue {
      background-color: #0000FF;
    }

    .customColor,
    .brushSlider {
      padding:0;
      text-align: center;
      color: white;
      background-color: #777777;
      border: none;
      width: 8vmax;
    }

    .highlighted {
      border: 2px solid white;
    }
  }
</style>
