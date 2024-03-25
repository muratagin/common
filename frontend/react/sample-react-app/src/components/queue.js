const State = {
  IDLE: 0,
  RUNNING: 1,
  STOPPED: 2,
};

export default function createQueue(options = {}) {
  const eventHandlers = {};

  function on(event, handler) {
    if (!eventHandlers[event]) {
      eventHandlers[event] = [];
    }
    eventHandlers[event].push(handler);
  }

  function emit(event, data) {
    const handlers = eventHandlers[event];
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  const queue = {
    tasks: new Map(),
    uniqueId: 0,
    lastRan: 0,
    timeoutId: undefined,
    currentlyHandled: 0,
    state: State.IDLE,
    on,
    emit,
    options: {
      concurrent: 5,
      interval: 500,
      start: true,
      ...options,
    },

    start() {
      if (queue.state !== State.RUNNING && !queue.isEmpty) {
        queue.state = State.RUNNING;
        queue.emit('start');

        const processQueue = async () => {
          while (queue.shouldRun) {
            await queue.dequeue();
          }
        };

        processQueue();
      }
    },

    stop() {
      clearTimeout(queue.timeoutId);
      queue.state = State.STOPPED;
      queue.emit('stop');
    },

    finalize() {
      queue.currentlyHandled -= 1;

      if (queue.currentlyHandled === 0 && queue.isEmpty) {
        queue.stop();
        queue.state = State.IDLE;
        queue.emit('end');
      }
    },

    async execute() {
      const promises = [];

      queue.tasks.forEach((promise, id) => {
        if (queue.currentlyHandled < queue.options.concurrent) {
          queue.currentlyHandled++;
          queue.tasks.delete(id);

          promises.push(
            Promise.resolve(promise())
              .then(value => {
                queue.emit('resolve', value);
                return value;
              })
              .catch(error => {
                queue.emit('reject', error);
                return error;
              })
              .finally(() => {
                queue.emit('dequeue');
                queue.finalize();
              })
          );
        }
      });

      const output = await Promise.all(promises);

      return queue.options.concurrent === 1 ? output[0] : output;
    },

    dequeue() {
      const { interval } = queue.options;

      return new Promise(resolve => {
        const timeout = Math.max(0, interval - (Date.now() - queue.lastRan));

        clearTimeout(queue.timeoutId);
        queue.timeoutId = setTimeout(() => {
          queue.lastRan = Date.now();
          queue.execute().then(resolve);
        }, timeout);
      });
    },

    enqueue(tasks) {
      if (Array.isArray(tasks)) {
        tasks.forEach(task => queue.enqueue(task));
        return;
      }

      if (typeof tasks !== 'function') {
        throw new Error(`You must provide a function, not ${typeof tasks}.`);
      }

      queue.uniqueId = (queue.uniqueId + 1) % Number.MAX_SAFE_INTEGER;
      queue.tasks.set(queue.uniqueId, tasks);

      if (queue.options.start && queue.state !== State.STOPPED) {
        queue.start();
      }
    },

    add(tasks) {
      queue.enqueue(tasks);
    },

    clear() {
      queue.tasks.clear();
    },

    get size() {
      return queue.tasks.size;
    },

    get isEmpty() {
      return queue.size === 0;
    },

    get shouldRun() {
      return !queue.isEmpty && queue.state !== State.STOPPED;
    },
  };

  return queue;
}

// // Example Usage:
// const myQueue = createQueue({
//   concurrent: 3,
//   interval: 1000,
//   start: true,
// });

// myQueue.enqueue(() => {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       console.log('Task 1 completed');
//       resolve('Task 1 result');
//     }, 2000);
//   });
// });

// myQueue.enqueue(() => {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       console.log('Task 2 completed');
//       resolve('Task 2 result');
//     }, 1500);
//   });
// });
