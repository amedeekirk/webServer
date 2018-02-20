var socket = io();

window.onload = function() {
    var canvas = $('#whiteboard')[0];
    var context = canvas.getContext('2d');
    var current = {color: '#000000'};
    var drawing = false;
    var throttle = false;

    var guess = true;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    context.lineWidth = 2;

    $('#clear, #brush, #dropdownContent, #userGuess').hide();
    $('#black').css("border", "2px solid #FFFFFF");

    $('#whiteboard').mousedown(function (e) {
        drawing = true;
        current.x = e.clientX;
        current.y = e.clientY;
    }).on('mouseup mouseout', function (e) {
        if (!drawing) {
            return;
        }
        drawing = false;
        if(!guess){
            drawLine(current.x, current.y, e.clientX, e.clientY, current.color, context.lineWidth, true);
        }
    }).mousemove(function (e) {
        if(!throttle){
            if (!drawing) {
                return;
            }
            if(!guess) {
                drawLine(current.x, current.y, e.clientX, e.clientY, current.color, context.lineWidth, true);
            }
            current.x = e.clientX;
            current.y = e.clientY;
            throttle = true;
            setTimeout(function(){ throttle = false; },10);
        }

    });

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
        var w = canvas.width;
        var h = canvas.height;

        socket.emit('drawing_c', {
            x0: x0 / w,
            y0: y0 / h,
            x1: x1 / w,
            y1: y1 / h,
            color: color,
            width: width
        });
    }

    socket.on('drawer', function (word) {
        drawer(word);
    });

    socket.on('guesser', function () {
        guesser();
    });

    socket.on('drawing_s', function (data) {
        var w = canvas.width;
        var h = canvas.height;
        drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color, data.width, false);
    });

    socket.on('guess_s', function (result) {
        if(result){
            alert('You Win!');
        }
        else{
            alert("Incorrect!")
        }
    });

    socket.on('clear_s', function () {
        context.clearRect(0, 0, canvas.width, canvas.height)
    });

    $('#brush').click(function (e) {
        $('#dropdownContent').toggle();
        e.stopPropagation();
    });

    $('#clear').click(function () {
        socket.emit('clear_c');
    });

    $('.color-box').click(function () {
        current.color = '#' + $(this).attr('id');
        $('.color-box').css('border', '');
        $(this).css("border", "2px solid #FFFFFF");
        $('#customColor').val(current.color);
    });

    $('#brushSlider').on('change', function (e) {
        context.lineWidth = e.target.value;
    });

    $('#customColor').on('change', function () {
        //https://stackoverflow.com/questions/8027423/how-to-check-if-a-string-is-a-valid-hex-color-representation
        var isOk  = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test($(this).val());
        if(isOk){
            current.color = $(this).val();
        }
        else{
            $(this).val(current.color);
        }
    });

    $('#userGuess').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            socket.emit('guess_c', $(this).val());
            $(this).val('');
        }

    });

    function drawer(word){
        guess = false;
        $('#userGuess').hide();
        $('#clear, #word, #brush').show();
        $('#word').text("Your word is '" + word + "'");
    }

    function guesser() {
        guess = true;
        $('#userGuess').show();
        $('#clear, #word, #brush, #dropdownContent').hide();
    }
};