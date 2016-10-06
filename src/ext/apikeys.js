export default class ApiKeys {
  constructor(base) {
    this.base = base;
  }

  fetch() {
    return this.base.get('/apikeys');
  }

  create(data) {
    return this.base.post('/apikeys', data);
  }

  remove(id) {
    return this.base.delete(`/apikeys/${id}`);
  }
}
