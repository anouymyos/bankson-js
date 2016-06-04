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
}
