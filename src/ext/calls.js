export default class Calls {
  constructor(base) {
    this.base = base;
  }

  fetch() {
    return this.base.get('/calls');
  }
}
