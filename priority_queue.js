function PriorityQueue(comparator) {
  this._comparator = comparator;
  this.size = 0;
  this._itens = [];

  this.isEmpty = function() {
    return this.size == 0;
  }

  this.enqueue = function(item) {
    this._itens[this.size] = item;
    this._swim(this.size++);
  };

  this.dequeue = function() {
    var tmp = this._itens[0];
    this._exchange(0, --this.size);
    this._sink(0);
    this._itens[this.size] = null;

    if (this.size > 0 && this.size == Math.floor(this._itens.length / 4)) 
      this._resize(Math.floor(this._itens.length  / 2));

    return tmp;
  };

  this.min = function() {
    return this._itens[0];
  };

  this._resize = function(newSize) {
    this._itens = this._itens.slice(0, newSize);
  };

  this._swim = function(position) {
    while(position > 0 && this._greater( (position - 1) / 2, position)) {
      this._exchange(position, (position - 1) / 2);
      position = Math.floor((position - 1) / 2);
    };
  };

  this._sink = function(position) {
    while(2 * position + 1 < this.size) {
      var j = 2 * position + 1;
      if(j < (this.size - 1) && this._greater(j, j + 1)) j++;
      if(!this._greater(position, j)) break;
      this._exchange(position, j);
      position = j;
    }
  };

  this._exchange = function(a, b) {
    a = Math.floor(a);
    b = Math.floor(b);
    var tmp = this._itens[a];
    this._itens[a] = this._itens[b];
    this._itens[b] = tmp; 
  };

  this._greater = function(a, b) {
    a = Math.floor(a);
    b = Math.floor(b);
    return this._comparator(this._itens[a], this._itens[b]) > 0;
  }

  this.cloneItens = function() {
    var es = [];
    for(var i = 0; i < this.size; i++) {
      var e = this._itens[i];
      es[i] = {time: e.time}; 
    }
    return es;
  }
}
