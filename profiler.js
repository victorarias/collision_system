function Profiler() {
  this.times = {};

  this.profileFunc = function(key, object, fn) {
    this.times[key] = { count: 0, ts: [], sum: 0 };
    var fnToProfile = object[fn];
    var that = this;
    object[fn] = function() {
      var t = new Date().getTime();  
      fnToProfile.apply(object, arguments);
      t = new Date().getTime() - t;

      that.saveTimeFor(key, t);
    }.bind(object);
  }

  this.saveTimeFor = function(key, time) {
    var timesForKey = this.times[key];
    
    timesForKey.sum += time;
    timesForKey.count++;

    timesForKey.ts.push(time);
  };

  this.getAvgForKey = function(key) {
    var t = this.times[key];
    return t.sum/t.count;
  }
}
