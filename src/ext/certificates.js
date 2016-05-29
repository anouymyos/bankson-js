export default class Certificates {
  constructor(base) {
    this.base = base;
  }

  fetch() {
    return this.base.get('/certificates');
  }

  upload(file, params) {
    let data = new FormData();
    Object.keys(params).forEach(k => data.append(k, params[k]));
    data.append('certificate', file);
    return this.base.post('/certificates/upload', data);
  }

  request(data) {
    return this.base.post('/certificates/request', data);
  }

  remove(id) {
    return this.base.delete(`/certificates/${id}`);
  }

  renew(id, data = {}) {
    return this.base.post(`/certificates/${id}/renew`, data);
  }
}
