function CollisionSystem() {
  this.start = function(){
    this.canvas = document.getElementsByTagName("CANVAS")[0];
    this.context = this.canvas.getContext("2d");
    
    this.attachResizeEvent();
    this.loadResources();
    this.loop();
  };

  this.loop = function() {
      this.update();
      this.draw(); 
      setTimeout(this.loop.bind(this), 16.67);
  };

  this.update = function() {
    for(var i = 0; i < this.circles.length; i++) {
      var circle = this.circles[i];

      if(i % 2 == 0) {
        circle.x += 1;
        circle.y += 0.1;
      }
      else {
        circle.y += 1;
        circle.x += 0.1;
      }
    }
  }

  this.loadResources = function() {
    this.circles = [
    { color: "red", x: 10, y: 10, radius: 5 },
    { color: "green", x: 20, y: 10, radius: 10 }
    ];
  };

  this.draw = function(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for(var i = 0; i < this.circles.length; i++) {
      var circle = this.circles[i];
      this.context.fillStyle = circle.color;

      this.context.beginPath();
      this.context.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
      this.context.closePath();
      this.context.fill();
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
  };
}

new CollisionSystem().start();
