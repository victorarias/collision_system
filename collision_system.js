function CollisionSystem() {
  this.start = function() {
    this.canvas = document.getElementsByTagName("CANVAS")[0];
    this.context = this.canvas.getContext("2d");
    this.fpsCounter = new FpsCounter().start();
    this.profiler = new Profiler();

    this.profiler.profileFunc("update", this, "update");

    this.attachResizeEvent();
    this.loadResources();
    this.warmUp();
    this.loop();
  };

  this.warmUp = function (){};

  this.loop = function() {
    this.update();
    this.draw();

    //document.title = "update avg = " + this.profiler.getAvgForKey("update"); 
    setTimeout(this.loop.bind(this), 1);
  };

  this.loadResources = function() {
    var circles = [];
    for(var i = 0; i < 1000; i++) {
      var radius = 3;
      var x = Math.max(radius * 2, Math.random() * this.canvas.width - 10 - radius*2);
      var y = Math.max(radius * 2, Math.random() * this.canvas.height - 10 - radius*2);
      var vX = Math.random() * 5 * (Math.random() - .5);
      var vY = Math.random() * 5 * (Math.random() - .5);
      var mass = radius / 2;

      circles.push(new Circle(x, y, radius, mass, vX, vY));
    }

    this.circles = circles;
  };

  this.draw = function(){
    this.fpsCounter.tick(); 
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.fillStyle = '#AA0000';
    for(var i = 0, length = this.circles.length; i < length; i++) {
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
