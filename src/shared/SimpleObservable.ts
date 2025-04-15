class SimpleObservable<T = unknown> {
  observers: Function[];

  constructor() {
    this.observers = [];
  }

  subscribe(func: Function) {
    this.observers.push(func);
  }

  unsubscribe(func: Function) {
    this.observers = this.observers.filter((observer) => observer !== func);
  }

  notify(evtStr: string, data: T) {
    this.observers.forEach((observer) => observer({ event: evtStr, data }));
  }
}

export default SimpleObservable;
