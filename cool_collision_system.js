function Event(time, circleA, circleB) {
  this.time = time;
  this.circleA = circleA;
  this.circleB = circleB;

  var countA = circleA ? circleA.count : -1;
  var countB = circleB ? circleB.count : -1;

  this.isValid = function(e) {
    if(circleA && circleA.count != countA) return false;
    if(circleB && circleB.count != countB) return false;
    return true;
  };
};
function eventComparator(a, b) {
  return a.time > b.time ? 1 : a.time == b.time ? 0 : -1;
};

function CoolCollisionSystem() {
  this.limit = 1000;
  this.currentTime = 0;
  this.pq = new PriorityQueue(eventComparator);

  this.warmUp = function() {
    for(var i = 0; i < this.circles.length; i++) {
      this.predict(this.circles[i]);
    }
    this.draw();
  };
  this.predict = function(circle) {
    if(!circle) return;

    for(var i = 0; i < this.circles.length; i++) {
      var circleToHit = this.circles[i];
      var dt = circle.timeToHit(circleToHit);
      if(this.currentTime + dt <= this.limit)
        this.pq.enqueue(new Event(this.currentTime + dt, circle, circleToHit));
    }

    if(circle.timeToHitVerticalWall(this.canvas.width) < 0)
      debugger;
    if(circle.timeToHitHorizontalWall(this.canvas.height) < 0)
      debugger;

    var dtX = circle.timeToHitVerticalWall(this.canvas.width);
    var dtY = circle.timeToHitHorizontalWall(this.canvas.height);

    if(this.currentTime + dtX <= this.limit) 
      this.pq.enqueue(new Event(this.currentTime + dtX, circle, null));
    if(this.currentTime + dtY <= this.limit) 
      this.pq.enqueue(new Event(this.currentTime + dtY, null, circle));
  };

  this.update = function() {
    if(this.pq.isEmpty())
      console.log("omg");

    var e = this.pq.dequeue();
    while(e.isValid() == false) {
      if(this.pq.isEmpty())
        console.log("omg!");
      e = this.pq.dequeue();
    }

    var a = e.circleA;
    var b = e.circleB;

    for(var i = 0; i < this.circles.length; i++) {
      this.circles[i].move(e.time - this.currentTime, this.canvas.width, this.canvas.height);
    }
    this.currentTime = e.time;

    if(a && b) a.bounceOff(b);
    else if(a && !b) a.bounceOffVerticalWall();
    else if(!a && b) b.bounceOffHorizontalWall();

    this.predict(a);
    this.predict(b);
  };
}

CoolCollisionSystem.prototype = new CollisionSystem
