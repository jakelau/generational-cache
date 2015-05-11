var Cache = require("../");
var test = require("tap").test;

test("get and set", function(t) {

  var cache = new Cache();

  t.equal(cache.get("foo"), null);

  cache.set("foo", 42);

  t.equal(cache.get("foo"), 42);
  t.end();

});

test("get and set with group", function(t) {

  var cache = new Cache();

  t.equal(cache.get("foo", "bar"), null);

  cache.set("foo", 42, "bar");

  t.equal(cache.get("foo"), null);

  t.equal(cache.get("foo", "bar"), 42);
  t.end();

});

test("invalidate group", function(t) {

  var cache = new Cache();

  cache.set("foo", 42, "bar");
  t.equal(cache.get("foo", "bar"), 42);

  cache.invalidateGroup("bar");

  t.equal(cache.get("foo", "bar"), null);
  t.end();

});

test("multiple groups", function(t) {

  var cache = new Cache();

  cache.set("foo", 42, ["bar", "baz"]);
  t.equal(cache.get("foo", ["bar", "baz"]), 42);

  t.equal(cache.get("foo"), null);
  t.equal(cache.get("foo", "bar"), null);
  t.equal(cache.get("foo", "baz"), null);

  cache.invalidateGroup("bar");
  t.equal(cache.get("foo", ["bar", "baz"]), null);

  cache.set("foo", 42, ["bar", "baz"]);
  t.equal(cache.get("foo", ["bar", "baz"]), 42);

  cache.invalidateGroup("baz");
  t.equal(cache.get("foo", ["bar", "baz"]), null);

  t.end();

});
