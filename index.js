var LRU = require("lru-cache");

function nullFn() {};

function Cache(options) {
  this._storage = LRU(options);
}

Cache.prototype.set = function(key, value, groups, callback) {
  var storage = this._storage;
  callback = callback || nullFn;
  if (callback === undefined) {
    callback = groups;
    groups = null;
  }
  this._make_key(key, groups, function(err, key) {
    if (err) { return callback(err); }
    storage.set(key, value);
    console.log("SET", key, value);
    callback(null);
  });
};

Cache.prototype.get = function(key, groups, callback) {
  var storage = this._storage;
  callback = callback || nullFn;
  if (callback === undefined) {
    callback = groups;
    groups = null;
  }
  this._make_key(key, groups, function(err, key) {
    if (err) { return callback(err); }
    process.nextTick(function() {
      var result = storage.get(key);
      console.log("GET", key);
      callback(null, result === undefined ? null : result);
    });
  });
};

Cache.prototype.invalidateGroup = function(group, callback) {
  var generation = (this._storage.get(group) || 0) + 1;
  callback = callback || nullFn;
  this._storage.set(group, generation);
  console.log("SET", group, generation);
  callback(null);
};

Cache.prototype._make_key = function(key, groups, callback) {
  var storage = this._storage;
  if (!groups) {
    return callback(null, key);
  }
  if (!Array.isArray(groups)) {
    groups = [groups];
  }
  groups = groups.reduce(function(memo, item) {
    var generation = storage.get(item) || 0;
    memo += ':' + item + '_'  + generation;
    return memo;
  }, '');
  callback(null, key + groups);
}

module.exports = Cache;
