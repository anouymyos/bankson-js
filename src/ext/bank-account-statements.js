export default class BankAccountStatements {
  constructor(base) {
    this.base = base;
  }

  fetch() {
    return this.base.get('/bankaccountstatements');
  }

  statementHtml(id) {
    return this.base.get(`/bankaccountstatements/${id}`, {
      headers: {
        'Accept': 'text/html'
      },
      responseType: 'arraybuffer'
    });
  }

  statementXml(id) {
    return this.base.get(`/bankaccountstatements/${id}`, {
      headers: {
        'Accept': 'application/xml'
      },
      responseType: 'arraybuffer'
    });
  }

  statementText(id) {
    return this.base.get(`/bankaccountstatements/${id}`, {
      headers: {
        'Accept': 'text/plain'
      },
      responseType: 'arraybuffer'
    });
  }

  refresh(id) {
    return this.base.post('/bankaccountstatements', {
      certificate_id: id
    });
  }
}
