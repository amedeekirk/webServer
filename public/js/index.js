/* global io */

const socket = io();
const footerSize = 75;

window.onload = () => {
  const $canvas = $('#whiteboard')[0];
  const context = $canvas.getContext('2d');
  const current = { color: '#000000' };
  let drawing = false;
  let throttle = false;

  let guess = true;

  $canvas.width = window.innerWidth;
  $canvas.height = window.innerHeight;
  context.lineWidth = 2;

  $('#clear, #brush, #dropdownContent, #userGuess').hide();
  $('#black').css('border', '2px solid #FFFFFF');


  function drawer(word) {
    guess = false;
    $('#userGuess').hide();
    $('#clear, #word, #brush').show();
    $('#word').text(`Your word is '${word}'`);
    $('#whiteboard').css({ cursor: 'none' });
  }

  function guesser() {
    guess = true;
    $('#userGuess').show();
    $('#clear, #word, #brush, #dropdownContent').hide();
    $('#whiteboard').css({ cursor: 'auto' });
  }

  function drawLine(x0, y0, x1, y1, color, width, emit) {
    context.lineWidth = width;
    context.lineCap = 'round';
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.stroke();
    context.closePath();

    if (!emit) {
      return;
    }
    const w = $canvas.width;
    const h = $canvas.height;

    socket.emit('clientEmitDrawing', {
      x0: x0 / w,
      y0: y0 / h,
      x1: x1 / w,
      y1: y1 / h,
      color,
      width,
    });
  }

  function rgb2hex(color) {
    const rgb = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);

    function hex(x) {
      return (`0${parseInt(x).toString(16)}`).slice(-2);
    }

    return `#${hex(rgb[1])}${hex(rgb[2])}${hex(rgb[3])}`;
  }

  $(document).on('mousemove', (e) => {
    if (e.pageY < ($canvas.height - footerSize) && !guess) {
      $('#brush-cursor').css({
        display: 'initial',
        width: `${context.lineWidth * 1.5}px`,
        height: `${context.lineWidth * 1.5}px`,
        backgroundColor: current.color,
        left: e.pageX,
        top: e.pageY,
        transform: 'translate(-50%, -50%)',
      });
    }
    else {
      $('#brush-cursor').css({
        display: 'none',
      });
    }
  });

  $('#whiteboard').mousedown((e) => {
    drawing = true;
    current.x = e.clientX;
    current.y = e.clientY;
  }).on('mouseup mouseout', (e) => {
    if (!drawing) {
      return;
    }
    drawing = false;
    if (!guess) {
      drawLine(current.x, current.y, e.clientX, e.clientY, current.color, context.lineWidth, true);
    }
  }).mousemove((e) => {
    if (!throttle) {
      if (!drawing) {
        return;
      }
      if (!guess) {
        drawLine(current.x, current.y,
          e.clientX, e.clientY,
          current.color, context.lineWidth,
          true);
      }
      current.x = e.clientX;
      current.y = e.clientY;
      throttle = true;
      setTimeout(() => {
        throttle = false;
      }, 10);
    }
  });

  socket.on('drawer', (word) => {
    drawer(word);
  });

  socket.on('guesser', () => {
    console.log('socket recieved');
    guesser();
  });

  socket.on('serverEmitDrawing', (data) => {
    const w = $canvas.width;
    const h = $canvas.height;
    drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color, data.width, false);
  });

  socket.on('serverEmitGuess', (result) => {
    if (result) {
      alert('You Win!');
    } else {
      alert('Incorrect!');
    }
  });

  socket.on('serverEmitClear', () => {
    context.clearRect(0, 0, $canvas.width, $canvas.height);
  });

  $('#brush').click((e) => {
    $('#dropdownContent').toggle();
    e.stopPropagation();
  });

  $('#clear').click(() => {
    socket.emit('clientEmitClear');
  });

  $('.color-box').click((e) => {
    const isEraser = $(e.currentTarget).attr('id') === 'color-eraser';
    const color = $(e.currentTarget).css('background-color');
    current.color = isEraser ? '#ffffff' : rgb2hex(color);
    $('.color-box').css('border', '');
    $(e.currentTarget).css('border', '2px solid #FFFFFF');
    $('#customColor').val(current.color);
  });

  $('#brushSlider').on('change', (e) => {
    context.lineWidth = e.target.value;
  });

  $('#customColor').on('change', (e) => {
    const isOk = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test($(e.currentTarget).val());

    if (isOk) {
      current.color = $(e.currentTarget).val();
    } else {
      $(e.currentTarget).val(current.color);
    }
  });

  $('#userGuess').keypress((e) => {
    if (e.which === '13') {
      socket.emit('clientEmitGuess', $(e.currentTarget).val());
      $(e.currentTarget).val('');
    }
  });
};
