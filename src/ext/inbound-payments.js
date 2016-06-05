import Qs from 'qs';

export default class InboundPayments {
  constructor(base) {
    this.base = base;
  }

  fetch(opts) {
    return this.base.get('/inboundpayments?' + Qs.stringify(opts));
  }

  refresh(certificateId) {
    return this.base.post('/inboundpayments', {certificate_id: certificateId});
  }

  batch(batchId, type = 'json') {
    let opts;
    if (type !== 'json') {
      opts = {
        headers: {
          'Accept': type === 'xml' ? 'application/xml' : 'text/plain'
        },
        responseType: 'arraybuffer'
      };
    }
    return this.base.get(`/inboundpayments/batches/${batchId}`, opts);
  }
}
