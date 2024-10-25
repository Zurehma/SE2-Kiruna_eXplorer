
class Queue {
  constructor() {
    this.queue = [];
  }

  enqueue(ticket) {
    this.queue.push(ticket);
  }

  dequeue() {
    return this.queue.shift();
  }

  length() {
    return this.queue.length;
  }

  isEmpty() {
    return this.queue.length === 0;
  }

  clear() {
    this.queue = [];
  }

}

export default Queue;