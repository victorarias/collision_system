function Circle(x, y, radius, mass, vX, vY) {
  this.x = x;
  this.y = y;
  this.mass = mass;
  this.radius = radius;

  this.vX = vX;
  this.vY = vY;
  this.color = 'rgb(0, 0, 0)';

  this.drawIn = function(context) {
    context.fillStyle = this.color;

    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.closePath();
    context.fill();
  };

  this.move = function() {
    this.x += this.vX;
    this.y += this.vY;
  }

  this.checkCollisionOnX = function(width) {
    if (this.x - this.radius < 0) {
      this.x = this.radius;
      this.vX *= -1;
    } else if (this.x + this.radius > width) {
      this.x = width - this.radius; 
      this.vX *= -1;
    }
  }

  this.checkCollisionOnY = function(height) {
    if (this.y - this.radius < 0) {
      this.y = this.radius;
      this.vY *= -1;
    } else if (this.y + this.radius > height) {
      this.y = height - this.radius; 
      this.vY *= -1;
    }
  }

  this.checkCollisionOnAnotherCircle = function(circle2) {
    var dX = circle2.x - this.x;
    var dY = circle2.y - this.y;
    var distance = Math.sqrt( dX * dX + dY * dY );

    if(distance < this.radius + circle2.radius) {
      var angle = Math.atan2(dY, dX);
      var sine = Math.sin(angle);
      var cosine = Math.cos(angle);

      var x = 0;
      var y = 0;
      var xB = dX * cosine + dY * sine;
      var yB = dY * cosine - dX * sine;

      var vX = this.vX * cosine + this.vY * sine;
      var vY = this.vY * cosine - this.vX * sine;

      var vXb = circle2.vX * cosine + circle2.vY * sine;
      var vYb = circle2.vY * cosine - circle2.vX * sine;

      var vTotal = vX - vXb;
      vX = (
          (this.mass - circle2.mass) * vX + 2 * circle2.mass * vXb
          )
        / (this.mass + circle2.mass);

      vXb = vTotal + vX;

      xB = x + (this.radius + circle2.radius);

      this.x = this.x + (x * cosine - y * sine);
      this.y = this.y + (y * cosine + x * sine);

      circle2.x = this.x + (xB * cosine - yB * sine);
      circle2.y = this.y + (yB * cosine + xB * sine);

      this.vX = vX * cosine - vY * sine;
      this.vY = vY * cosine + vX * sine;

      circle2.vX = vXb * cosine - vYb * sine;
      circle2.vY = vYb * cosine + vXb * sine;
    }
  }
}

function FpsCounter() {
  this.fps = 0;
  this.lastUpdate = (new Date) * 1 - 1;
  this.fpsFilter = 50;

  this.tick = function() {
    var now;
    var thisFrameFPS = 1000 / ((now = new Date) - this.lastUpdate);
    this.fps += (thisFrameFPS - this.fps) / this.fpsFilter;
    this.lastUpdate = now;
  };

  this.start = function() {
    setInterval(function() {
      document.title = "FPS = " + this.fps;
    }.bind(this), 1000);
    return this;
  };
}

function CollisionSystem() {
  this.start = function() {
    this.canvas = document.getElementsByTagName("CANVAS")[0];
    this.context = this.canvas.getContext("2d");
    this.fpsCounter = new FpsCounter().start();

    this.attachResizeEvent();
    this.loadResources();
    this.loop();
  };

  this.loop = function() {
    this.update();
    this.draw();

    this.fpsCounter.tick(); 

    setTimeout(this.loop.bind(this), 1);
  };

  this.update = function() {
    for(var a = 0; a < this.circles.length; a++) {
      var circle1 = this.circles[a];

      for(var b = a + 1; b < this.circles.length; b++) {
        var circle2 = this.circles[b];

        circle1.checkCollisionOnAnotherCircle(circle2);
      }

      circle1.move();
      circle1.checkCollisionOnX(this.canvas.width);
      circle1.checkCollisionOnY(this.canvas.height);
    }
  }

  this.loadResources = function() {
    var circles = [];
    for(var i = 0; i < 100; i++) {
      var x = 40 + (Math.random() * this.canvas.width - 20);
      var y = 40 + (Math.random() * this.canvas.height - 20);
      var vX = Math.random() * 4;
      var vY = Math.random() * 4;
      var radius = 2 * Math.random() * 10;
      var mass = radius / 2;

      circles.push(new Circle(x, y, radius, mass, vX, vY));
    }

    this.circles = circles;
  };

  this.draw = function(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for(var i = 0; i < this.circles.length; i++) {
      this.circles[i].drawIn(this.context);
    }
  };


  this.attachResizeEvent = function() {
    var resize = function() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }.bind(this);
    window.onresize = function() {
      resize();
    }.bind(this)
    resize();
  };
}

new CollisionSystem().start();
