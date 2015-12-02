/**
* Provides requestAnimationFrame in a cross browser way.
* http://paulirish.com/2011/requestanimationframe-for-smart-animating/
*/

if ( !window.requestAnimationFrame ) {
    window.requestAnimationFrame = ( function() {
        return window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame || // comment out if FF4 is slow (it caps framerate at ~30fps: https://bugzilla.mozilla.org/show_bug.cgi?id=630127)
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
            window.setTimeout( callback, 1000 / 60 );
        };
    } )();
}

var el = get('screen');

var audio = new window.AudioContext();

var canv = {
    screen : get('screen').getContext('2d'),
    play : [],
    page : function () {
        var context = this.screen;
        
        context.fillStyle = '#eef8fb';
        context.fillRect(0, 0, 800, 858);
    },
    string : function () {
        var context = this.screen;

        context.lineWidth = 4;
        context.strokeStyle = '#04141a';

        context.beginPath();
        context.moveTo(0, 150);
        context.lineTo(800, 150);
        context.stroke();
    },
    triangleLeft : function () {
        var context = this.screen;
        
        context.strokeStyle = '#04141a';

        context.beginPath();
        context.moveTo(0, 140);
        context.lineTo(20, 150);
        context.moveTo(0, 160);
        context.lineTo(20, 150);
        context.stroke();
    },
    triangleRight : function () {
        var context = this.screen;
        
        context.strokeStyle = '#04141a';

        context.beginPath();
        context.moveTo(800, 140);
        context.lineTo(780, 150);
        context.moveTo(800, 160);
        context.lineTo(780, 150);
        context.stroke();
    },
    drawBull : function (e) {
        var canvas = get('screen'),
            context = canv.screen,
            loc = windowToCanvas(canvas, e.clientX, e.clientY);

        canv.play.push(loc);

        context.fillStyle = '#04141a';

        context.beginPath();
        context.arc(loc.x, loc.y, 8, 0, Math.PI*2, false);
        context.closePath();
        context.fill();
    },
    move : function () {
        var canvas = get('screen'),
            context = canv.screen,
            array = canv.play;

        context.clearRect(0, 0, canvas.width, canvas.height);
        canv.page();
        canv.string();
        canv.triangleLeft();
        canv.triangleRight();

        array.forEach(function (item, index) {
            var self = item;

            self.y -= 4;
            if (self.y < 0) {
                self.y = 628;
                self.y += 4;
            }

            if (self.y == 150 || self.y == 151 || self.y == 152 || self.y == 153 || self.y == 154) {
                play(self.x);
            }

            context.fillStyle = '#04141a';
            context.beginPath();
            context.arc(self.x, self.y, 8, 0, Math.PI*2, false);
            context.closePath();
            context.fill();
        });
    }
};

function play(freq) {
    var osc = audio.createOscillator();

    osc.frequency.value = freq;
    osc.type = 'square';
    osc.connect(audio.destination);
    osc.start(0);

    setTimeout(function() {
        osc.stop(0);
        osc.disconnect(audio.destination);
    }, 1000 / 4);
}

function windowToCanvas(canvas, x, y) {
    var bbox = canvas.getBoundingClientRect();
    return { x: x - bbox.left * (canvas.width  / bbox.width),
             y: y - bbox.top  * (canvas.height / bbox.height)
            };
}

function animate() {
    requestAnimationFrame(animate);
    canv.move();
}

function get (id) { 
    return document.getElementById(id);
}

//init
canv.page();
canv.string();
canv.triangleLeft();
canv.triangleRight();
animate();

el.addEventListener('mousedown', canv.drawBull, false);