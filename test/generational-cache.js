var Cache = require("../");
var test = require("tap").test;

test("get and set", function(t) {
  t.plan(2);
  var cache = new Cache();

  cache.get("foo", function(err, value) {
    t.equal(value, null);
    cache.set("foo", 42, function(err) {
      cache.get("foo", function(err, value) {
        t.equal(value, 42);
      });
    });
  });

});

test("get and set with group", function(t) {
  t.plan(3);
  var cache = new Cache();

  cache.get("foo", "bar", function(err, value) {
    t.equal(value, null);
    cache.set("foo", 42, "bar", function(err) {

      cache.get("foo", function(err, value) {
        t.equal(value, null);
      });

      cache.get("foo", "bar", function(err, value) {
        t.equal(value, 42);
      });

    });
  });

});

test("invalidate group", function(t) {
  t.plan(2);
  var cache = new Cache();

  cache.set("foo", 42, "bar", function(err) {
    cache.get("foo", "bar", function(err, value) {

      t.equal(value, 42);

      cache.invalidateGroup("bar", function(err) {
        cache.get("foo", "bar", function(err, value) {
          t.equal(value, null);
        });
      });

    });
  });

});

test("multiple groups", function(t) {
  t.plan(6);
  var cache = new Cache();

  cache.set("foo", 42, ["bar", "baz"], function(err) {
    cache.get("foo", ["bar", "baz"], function(err, value) {
      t.equal(value, 42);
      cache.get("foo", "bar", function(err, value) {
        t.equal(value, null);
        cache.get("foo", "baz", function(err, value) {
          t.equal(value, null);

          cache.invalidateGroup("bar", function(err) {
            cache.get("foo", ["bar", "baz"], function(err, value) {
              t.equal(value, null);
              cache.set("foo", 42, ["bar", "baz"], function(err) {
                cache.get("foo", ["bar", "baz"], function(err, value) {
                  t.equal(value, 42);
                  cache.invalidateGroup("baz", function(err) {
                    cache.get("foo", ["bar", "baz"], function(err, value) {
                      t.equal(value, null);
                    });
                  });
                });
              });
            });
          });

        });
      });
    });
  });

});
