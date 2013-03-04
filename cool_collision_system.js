function Event(time, circleA, circleB) {
  this.time = time;
  this.circleA = circleA;
  this.circleB = circleB;

  var countA = circleA ? circleA.count : -1;
  var countB = circleB ? circleB.count : -1;

  this.isValid = function(e) {
    if(circleA && circleA.count != countA){ return false; }
    if(circleB && circleB.count != countB){ return false; }
    return true;
  };
};
function eventComparator(a, b) {
  return a.time > b.time ? 1 : a.time == b.time ? 0 : -1;
};

function CoolCollisionSystem() {
  this.limit = 5000;
  this.currentTime = 0;
  this.pq = new PriorityQueue(eventComparator);

  this.warmUp = function() {
    for(var i = 0; i < this.circles.length; i++) {
      this.predict(this.circles[i]);
    }
    this.redraw();
  };
  this.predict = function(circle) {
    if(!circle) return;

    //for(var i = 0; i < this.circles.length; i++) {
    //  var circleToHit = this.circles[i];
    //  var dt = circle.timeToHit(circleToHit);
    //  if(this.currentTime + dt <= this.limit)
    //    this.pq.enqueue(new Event(this.currentTime + dt, circle, circleToHit));
    //}

    //if(circle.timeToHitVerticalWall(this.canvas.width) < 0)
    //  debugger;
    //if(circle.timeToHitHorizontalWall(this.canvas.height) < 0)
    //  debugger;

    var dtX = circle.timeToHitVerticalWall(this.canvas.width);
    var dtY = circle.timeToHitHorizontalWall(this.canvas.height);

    if (dtX < 0)
      console.log("dtX < 0");

    if(dtY < 0)
      console.log("dtY < 0");

    if(dtX <= this.limit) 
      this.pq.enqueue(new Event(this.currentTime + dtX, circle, null));
    if(dtY <= this.limit) 
      this.pq.enqueue(new Event(this.currentTime + dtY, null, circle));
  };

  this.redraw = function() {
    this.draw();
    this.pq.enqueue(new Event(this.currentTime + 1, null, null));
  };

  this.update = function() {
    var e = this.pq.dequeue();

    while(!e.isValid())
      e = this.pq.dequeue();

    var a = e.circleA;
    var b = e.circleB;

    for(var i = 0; i < this.circles.length; i++) {
      this.circles[i].move(e.time - this.currentTime, this.canvas.width, this.canvas.height);
    }
    this.currentTime = e.time;

    if(a && b) a.bounceOff(b);
    else if(a && !b) a.bounceOffVerticalWall();
    else if(!a && b) b.bounceOffHorizontalWall();
    else { this.redraw(); }

    this.predict(a);
    this.predict(b);
  };

  this.loop = function() {
    this.update();
    setTimeout(this.loop.bind(this), 1);
  };
}

CoolCollisionSystem.prototype = new CollisionSystem
