# Bankson.fi Node.JS client

API documentation: [Official bankson.fi documentation](http://docs.bankson.fi)

## Installation

```
npm install --save bankson-js
```

## Usage

```js
import Client from 'bankson-js';
var client = new Client({
  bearerToken: bearerTokenObtainedWithOAuth2
});

client.me().then(resp => {
  console.log('Current user', resp.user);
});

```

## Dynamic bearer token

Because of the expiring nature of bearer tokens you can validate and refresh them before every request by providing a `beforeRequest` function that returns
a promise:

```js
import Client from 'bankson-js';
var client = new Client({
  beforeRequest: () => {
    return refreshMyToken().then(token => {
      return {
        bearerToken: token
      };
    });
  }
});
```

## Test mode

To support API requests in test mode, you can either specify `test: true` in the constructor options or return `test: true` in the promised value in `beforeRequest`.

## License

MIT License
