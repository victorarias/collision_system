var comparator = function(a, b) {
  return a > b ? 1 : a == b ? 0 : -1;
};

module("priority queue");
test("should enqueue itens", function() {
  var pq = new PriorityQueue(comparator);
  pq.enqueue(1);
  pq.enqueue(2);

  equal(pq.size, 2);
});

test("should dequeue itens in the right order", function() {
  var pq = new PriorityQueue(comparator);

  pq.enqueue(2);
  pq.enqueue(1);
  pq.enqueue(4);
  pq.enqueue(3);

  equal(4, pq.size);
  equal(pq.dequeue(), 1);
  equal(pq.dequeue(), 2);
  equal(pq.dequeue(), 3);
  equal(pq.dequeue(), 4);
});


test("should support multiple queue and dequeue", function() {
  var pq = new PriorityQueue(comparator);

  pq.enqueue(2);
  pq.enqueue(1);
  pq.enqueue(10);
  pq.enqueue(7);

  equal(pq.dequeue(), 1);
  equal(pq.dequeue(), 2);
  equal(pq.size, 2);
  
  pq.enqueue(5);

  equal(pq.dequeue(), 5);

  pq.enqueue(9);

  equal(pq.dequeue(), 7);
  equal(pq.dequeue(), 9);
  equal(pq.dequeue(), 10);
  equal(pq.size, 0);
});
