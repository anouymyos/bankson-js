export default class Applications {
  constructor(base) {
    this.base = base;
  }

  fetch() {
    return this.base.get('/applications');
  }

  create(data) {
    return this.base.post('/applications', data);
  }
}
