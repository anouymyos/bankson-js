export default class Webhooks {
  constructor(base) {
    this.base = base;
  }

  fetch() {
    return this.base.get('/webhooks');
  }

  create(data) {
    return this.base.post('/webhooks', data);
  }
}
