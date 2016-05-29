export default class BankAccounts {
  constructor(base) {
    this.base = base;
  }

  fetch() {
    return this.base.get('/bankaccounts');
  }

  create(data) {
    return this.base.post('/bankaccounts', data);
  }
}
