function  SimpleCollisionSystem() {
  this.update = function() {
    for(var a = 0, length = this.circles.length; a < length; a++) {
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
};

SimpleCollisionSystem.prototype = new CollisionSystem;
