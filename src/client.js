import Applications from './ext/applications';
import Webhooks from './ext/webhooks';
import Certificates from './ext/certificates';
import Calls from './ext/calls';
import BankAccounts from './ext/bank-accounts';
import BankAccountStatements from './ext/bank-account-statements';
import Payments from './ext/payments';
import InboundPayments from './ext/inbound-payments';
import ApiKeys from './ext/apikeys';

import NodeRSA from 'node-rsa';

import FormData from 'form-data';
import fetch from 'node-fetch';
const Headers = fetch.Headers || window.Headers; // We are in a browser

export default class Client {

  constructor(opts = {}) {
    this.applications = new Applications(this);
    this.webhooks = new Webhooks(this);
    this.certificates = new Certificates(this);
    this.calls = new Calls(this);
    this.bankAccounts = new BankAccounts(this);
    this.bankAccountStatements = new BankAccountStatements(this);
    this.payments = new Payments(this);
    this.apikeys = new ApiKeys(this);
    this.inboundPayments = new InboundPayments(this);
    this.beforeRequest = opts.beforeRequest || (() => Promise.resolve());
    this.bearerToken = opts.bearerToken || '-';
    this.baseUrl = opts.baseUrl || 'https://api.bankson.fi';
    this.testMode = typeof opts.test !== 'undefined' ? opts.test : false;
    if (opts.privateKey && opts.apiKey) {
      // ApiKey authentication
      this.bearerToken = false;
      this.privateKey = new NodeRSA();
      this.privateKey.importKey(opts.privateKey, 'private');
      if (!this.privateKey.isPrivate()) throw new Error('Invalid private key');
      this.apiKey = opts.apiKey;
    }
  }

  me() {
    return this.get('/me');
  }

  authorizationHeader(bearerToken) {
    if (this.bearerToken) return 'Bearer ' + bearerToken;
    let timestamp = Date.now()
      , str = this.apiKey + timestamp
      , signature = this.privateKey.sign(str, 'base64');
    return 'BanksonRSA ' + [
      'ApiKey=' + this.apiKey,
      'Timestamp=' + timestamp,
      'Signature=' + signature
    ].join(', ');
  }

  headers(additionalHeaders = {}) {
    return this.beforeRequest().then(result => {
      let bearerToken = result && result.bearerToken || this.bearerToken
        , banksonTest = result && typeof result.test !== 'undefined' ? result.test : this.testMode
        , headers = new Headers();
      headers.append('Accept', additionalHeaders.Accept || 'application/json');
      headers.append('Authorization', this.authorizationHeader(bearerToken));
      if (banksonTest) headers.append('X-Bankson-Environment', 'Test');
      return headers;
    });
  }

  get(path, options = {}) {
    return this.headers(options.headers).then(headers => fetch(`${this.baseUrl}${path}`, { headers }).then(resp => this.handleResponse(resp, options)));
  }

  post(path, data) {
    return this.headers().then(headers => {
      let isFormData = data instanceof FormData;
      if (!isFormData) {
        headers.append('Content-Type', 'application/json');
      }
      return fetch(`${this.baseUrl}${path}`, {
        method: 'POST',
        body: isFormData ? data : JSON.stringify(data),
        headers
      }).then(this.handleResponse);
    });
  }

  delete(path) {
    return this.headers().then(headers => fetch(`${this.baseUrl}${path}`, {
      method: 'DELETE',
      headers
    })).then(this.handleResponse);
  }

  handleResponse(resp, options = {}) {
    if (!resp.ok) {
      if (resp.status >= 500 || resp.status < 400) throw new Error('Internal error');
      return getBody(resp).then(json => {
        let err = new Error('Request unsuccessfull');
        err.status = resp.status;
        err.body = json; 
        throw err;
      });
    }
    return getBody(resp);

    function getBody(resp) {
      if (!/application\/json/.test(resp.headers.get('Content-Type'))) {
        if (options.responseType === 'arraybuffer') return resp.arrayBuffer();
        return resp.text();
      }
      return resp.json();
    }
  }
}
