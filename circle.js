function Circle(x, y, radius, mass, vX, vY) {
  this.x = x;
  this.y = y;
  this.mass = mass;
  this.radius = radius;

  this.vX = vX;
  this.vY = vY;

  this.count = 0;

  this.timeToHit = function(b) {
    var a = this;
    if (a === b) return Infinity;
    var dx  = b.x - a.x;
    var dy  = b.y - a.y;
    var dvx = b.vX - a.vX;
    var dvy = b.vY- a.vY;
    var dvdr = dx*dvx + dy*dvy;
    if (dvdr > 0) return Infinity;
    var dvdv = dvx*dvx + dvy*dvy;
    var drdr = dx*dx + dy*dy;
    var sigma = a.radius + b.radius;
    var d = (dvdr*dvdr) - dvdv * (drdr - sigma*sigma);
    if (d < 0) return Infinity;
    return -(dvdr + Math.sqrt(d)) / dvdv;
  };

  this.round = function(n) {
    return n;
    //return Math.floor(n * 1000)/1000;
  };

  this.timeToHitVerticalWall = function(width) {
    if (this.vX > 0) return (width - (this.x + this.radius)) / this.vX;
    else if (this.vX < 0) return (this.radius - this.x) / this.vX;
    else return Infinity;
  };

  this.timeToHitHorizontalWall = function(height) {
    if (this.vY > 0) return (height - (this.y + this.radius)) / this.vY;
    else if (this.vY < 0) return (this.radius - this.y) / this.vY;
    else return Infinity;
  };

  this.bounceOff = function(that) {
    var dx  = that.x - this.x;
    var dy  = that.y - this.y;
    var dvx = that.vX - this.vX;
    var dvy = that.vY - this.vY;
    var dvdr = dx*dvx + dy*dvy;             // dv dot dr
    var dist = this.radius + that.radius;   // distance between particle centers at collison

    var F = 2 * this.mass * that.mass * dvdr / ((this.mass + that.mass) * dist);
    var fx = F * dx / dist;
    var fy = F * dy / dist;

    this.vX += fx / this.mass;
    this.vY += fy / this.mass;
    that.vX -= fx / that.mass;
    that.vY -= fy / that.mass;

    this.count++;
    that.count++;
  };

  this.bounceOffVerticalWall = function() {
    this.vX *= -1;
    this.count++;
  };

  this.bounceOffHorizontalWall = function() {
    this.vY *= -1;
    this.count++;
  };

  this.drawIn = function(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.closePath();
    context.fill();
  };

  this.move = function(time, width, height) {
    if(typeof(time) != "undefined") {
      this.x += this.vX * time;
      this.y += this.vY * time;
    }
    else {
      this.x += this.vX;
      this.y += this.vY;
    }
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
