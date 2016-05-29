export default class Payments {
  constructor(base) {
    this.base = base;
  }

  fetch() {
    return this.base.get('/payments');
  }

  fetchFeedback() {
    return this.base.post('/payments/feedback', {});
  }
}
