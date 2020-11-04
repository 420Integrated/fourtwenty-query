like web3 but for minimalists


```js
var provider = { sendAsync: function(params, cb){/* ... */} }
var query = new FourtwentyQuery(provider)

query.getBalance(address, cb)
```