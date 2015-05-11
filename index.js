var LRU = require("lru-cache");

function Cache(options) {
  this._storage = LRU(options);
}

Cache.prototype.set = function(key, value, groups) {
  key = this._make_key(key, groups);
  this._storage.set(key, value);
};

Cache.prototype.get = function(key, groups) {
  var result;
  key = this._make_key(key, groups);
  result = this._storage.get(key);
  return result === undefined ? null : result;
};

Cache.prototype.invalidateGroup = function(group) {
  this._storage.set(group, (this._storage.get(group) || 0) + 1);
};


Cache.prototype._make_key = function(key, groups) {
  var storage = this._storage;
  if (!groups) {
    return key;
  }
  if (!Array.isArray(groups)) {
    groups = [groups];
  }
  groups = groups.reduce(function(memo, item) {
    var generation = storage.get(item) || 0;
    memo += ':' + item + '_'  + generation;
    return memo;
  }, '');
  return key + groups;
}

module.exports = Cache;
