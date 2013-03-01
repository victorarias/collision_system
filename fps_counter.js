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
