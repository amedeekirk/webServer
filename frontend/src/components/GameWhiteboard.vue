<template>
  <canvas class="game-whiteboard"
          id="canvas"
          @mousedown="initDrawing"
          @mouseup="stopDrawing"
          @mouseleave="stopDrawing"
          @mousemove="draw">
    Sorry, your browser does not support HTML5 canvas technology.
  </canvas>
</template>

<script>
export default {
  name: 'GameWhiteboard',
  data() {
    return {
      drawing: false,
      throttle: false,
      emit: false,
      brush: {
        color: '#000',
        width: 2,
        x: null,
        y: null,
      },
    };
  },
  mounted() {
    this.canvas = document.getElementById('canvas');
    this.ctx = document.getElementById('canvas').getContext('2d');
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  },

  methods: {
    drawLine(x0, y0, x1, y1) {
      this.ctx.lineWidth = this.brush.width;
      this.ctx.lineCap = 'round';
      this.ctx.beginPath();
      this.ctx.moveTo(x0, y0);
      this.ctx.lineTo(x1, y1);
      this.ctx.strokeStyle = this.brush.color;
      this.ctx.stroke();
      this.ctx.closePath();

      if (!this.emit) {
        // return;
      }
    },

    initDrawing(e) {
      this.brush.x = e.clientX;
      this.brush.y = e.clientY;
      this.drawing = true;
    },

    stopDrawing() {
      this.drawing = false;
    },

    draw(e) {
      // A game loop of sorts
      if (!this.throttle && this.drawing) {
        this.drawLine(
          this.brush.x,
          this.brush.y,
          e.clientX,
          e.clientY,
        );
        this.brush.x = e.clientX;
        this.brush.y = e.clientY;
        this.throttle = true;
        setTimeout(() => { this.throttle = false; }, 10);
      }
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

<style scoped>
  .game-whiteboard {
    grid-row: board-h-start / board-h-end;
  }
</style>
