const extend = require('xtend')
const createRandomId = require('json-rpc-random-id')()

module.exports = FourtwentyQuery


function FourtwentyQuery(provider){
  const self = this
  self.currentProvider = provider
}

//
// base queries
//

// default block
FourtwentyQuery.prototype.getBalance =                          generateFnWithDefaultBlockFor(2, 'fourtwenty_getBalance')
FourtwentyQuery.prototype.getCode =                             generateFnWithDefaultBlockFor(2, 'fourtwenty_getCode')
FourtwentyQuery.prototype.getTransactionCount =                 generateFnWithDefaultBlockFor(2, 'fourtwenty_getTransactionCount')
FourtwentyQuery.prototype.getStorageAt =                        generateFnWithDefaultBlockFor(3, 'fourtwenty_getStorageAt')
FourtwentyQuery.prototype.call =                                generateFnWithDefaultBlockFor(2, 'fourtwenty_call')
// standard
FourtwentyQuery.prototype.protocolVersion =                     generateFnFor('fourtwenty_protocolVersion')
FourtwentyQuery.prototype.syncing =                             generateFnFor('fourtwenty_syncing')
FourtwentyQuery.prototype.coinbase =                            generateFnFor('fourtwenty_coinbase')
FourtwentyQuery.prototype.mining =                              generateFnFor('fourtwenty_mining')
FourtwentyQuery.prototype.hashrate =                            generateFnFor('fourtwenty_hashrate')
FourtwentyQuery.prototype.smokePrice =                            generateFnFor('fourtwenty_smokePrice')
FourtwentyQuery.prototype.accounts =                            generateFnFor('fourtwenty_accounts')
FourtwentyQuery.prototype.blockNumber =                         generateFnFor('fourtwenty_blockNumber')
FourtwentyQuery.prototype.getBlockTransactionCountByHash =      generateFnFor('fourtwenty_getBlockTransactionCountByHash')
FourtwentyQuery.prototype.getBlockTransactionCountByNumber =    generateFnFor('fourtwenty_getBlockTransactionCountByNumber')
FourtwentyQuery.prototype.getUncleCountByBlockHash =            generateFnFor('fourtwenty_getUncleCountByBlockHash')
FourtwentyQuery.prototype.getUncleCountByBlockNumber =          generateFnFor('fourtwenty_getUncleCountByBlockNumber')
FourtwentyQuery.prototype.sign =                                generateFnFor('fourtwenty_sign')
FourtwentyQuery.prototype.sendTransaction =                     generateFnFor('fourtwenty_sendTransaction')
FourtwentyQuery.prototype.sendRawTransaction =                  generateFnFor('fourtwenty_sendRawTransaction')
FourtwentyQuery.prototype.estimateSmoke =                         generateFnFor('fourtwenty_estimateSmoke')
FourtwentyQuery.prototype.getBlockByHash =                      generateFnFor('fourtwenty_getBlockByHash')
FourtwentyQuery.prototype.getBlockByNumber =                    generateFnFor('fourtwenty_getBlockByNumber')
FourtwentyQuery.prototype.getTransactionByHash =                generateFnFor('fourtwenty_getTransactionByHash')
FourtwentyQuery.prototype.getTransactionByBlockHashAndIndex =   generateFnFor('fourtwenty_getTransactionByBlockHashAndIndex')
FourtwentyQuery.prototype.getTransactionByBlockNumberAndIndex = generateFnFor('fourtwenty_getTransactionByBlockNumberAndIndex')
FourtwentyQuery.prototype.getTransactionReceipt =               generateFnFor('fourtwenty_getTransactionReceipt')
FourtwentyQuery.prototype.getUncleByBlockHashAndIndex =         generateFnFor('fourtwenty_getUncleByBlockHashAndIndex')
FourtwentyQuery.prototype.getUncleByBlockNumberAndIndex =       generateFnFor('fourtwenty_getUncleByBlockNumberAndIndex')
FourtwentyQuery.prototype.getCompilers =                        generateFnFor('fourtwenty_getCompilers')
FourtwentyQuery.prototype.compileLLL =                          generateFnFor('fourtwenty_compileLLL')
FourtwentyQuery.prototype.compileSolidity =                     generateFnFor('fourtwenty_compileSolidity')
FourtwentyQuery.prototype.compileSerpent =                      generateFnFor('fourtwenty_compileSerpent')
FourtwentyQuery.prototype.newFilter =                           generateFnFor('fourtwenty_newFilter')
FourtwentyQuery.prototype.newBlockFilter =                      generateFnFor('fourtwenty_newBlockFilter')
FourtwentyQuery.prototype.newPendingTransactionFilter =         generateFnFor('fourtwenty_newPendingTransactionFilter')
FourtwentyQuery.prototype.uninstallFilter =                     generateFnFor('fourtwenty_uninstallFilter')
FourtwentyQuery.prototype.getFilterChanges =                    generateFnFor('fourtwenty_getFilterChanges')
FourtwentyQuery.prototype.getFilterLogs =                       generateFnFor('fourtwenty_getFilterLogs')
FourtwentyQuery.prototype.getLogs =                             generateFnFor('fourtwenty_getLogs')
FourtwentyQuery.prototype.getWork =                             generateFnFor('fourtwenty_getWork')
FourtwentyQuery.prototype.submitWork =                          generateFnFor('fourtwenty_submitWork')
FourtwentyQuery.prototype.submitHashrate =                      generateFnFor('fourtwenty_submitHashrate')

// network level

FourtwentyQuery.prototype.sendAsync = function(opts, cb){
  const self = this
  self.currentProvider.sendAsync(createPayload(opts), function(err, response){
    if (!err && response.error) err = new Error('FourtwentyQuery - RPC Error - '+response.error.message)
    if (err) return cb(err)
    cb(null, response.result)
  })
}

// util

function generateFnFor(methodName){
  return function(){
    const self = this
    var args = [].slice.call(arguments)
    var cb = args.pop()
    self.sendAsync({
      method: methodName,
      params: args,
    }, cb)
  }
}

function generateFnWithDefaultBlockFor(argCount, methodName){
  return function(){
    const self = this
    var args = [].slice.call(arguments)
    var cb = args.pop()
    // set optional default block param
    if (args.length < argCount) args.push('latest')
    self.sendAsync({
      method: methodName,
      params: args,
    }, cb)
  }
}

function createPayload(data){
  return extend({
    // defaults
    id: createRandomId(),
    jsonrpc: '2.0',
    params: [],
    // user-specified
  }, data)
}
