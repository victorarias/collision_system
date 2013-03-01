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
