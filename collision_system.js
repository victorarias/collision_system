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

  this.loadResources = function() {
    var circles = [];
    for(var i = 0; i < 1000; i++) {
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
