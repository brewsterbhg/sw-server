// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function(modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this,
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x) {
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function(id, exports) {
    modules[id] = [
      function(require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function() {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})(
  {
    'node_modules/regenerator-runtime/runtime.js': [
      function(require, module, exports) {
        /**
         * Copyright (c) 2014-present, Facebook, Inc.
         *
         * This source code is licensed under the MIT license found in the
         * LICENSE file in the root directory of this source tree.
         */

        var runtime = (function(exports) {
          'use strict';

          var Op = Object.prototype;
          var hasOwn = Op.hasOwnProperty;
          var undefined; // More compressible than void 0.
          var $Symbol = typeof Symbol === 'function' ? Symbol : {};
          var iteratorSymbol = $Symbol.iterator || '@@iterator';
          var asyncIteratorSymbol = $Symbol.asyncIterator || '@@asyncIterator';
          var toStringTagSymbol = $Symbol.toStringTag || '@@toStringTag';

          function wrap(innerFn, outerFn, self, tryLocsList) {
            // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
            var protoGenerator =
              outerFn && outerFn.prototype instanceof Generator
                ? outerFn
                : Generator;
            var generator = Object.create(protoGenerator.prototype);
            var context = new Context(tryLocsList || []);

            // The ._invoke method unifies the implementations of the .next,
            // .throw, and .return methods.
            generator._invoke = makeInvokeMethod(innerFn, self, context);

            return generator;
          }
          exports.wrap = wrap;

          // Try/catch helper to minimize deoptimizations. Returns a completion
          // record like context.tryEntries[i].completion. This interface could
          // have been (and was previously) designed to take a closure to be
          // invoked without arguments, but in all the cases we care about we
          // already have an existing method we want to call, so there's no need
          // to create a new function object. We can even get away with assuming
          // the method takes exactly one argument, since that happens to be true
          // in every case, so we don't have to touch the arguments object. The
          // only additional allocation required is the completion record, which
          // has a stable shape and so hopefully should be cheap to allocate.
          function tryCatch(fn, obj, arg) {
            try {
              return { type: 'normal', arg: fn.call(obj, arg) };
            } catch (err) {
              return { type: 'throw', arg: err };
            }
          }

          var GenStateSuspendedStart = 'suspendedStart';
          var GenStateSuspendedYield = 'suspendedYield';
          var GenStateExecuting = 'executing';
          var GenStateCompleted = 'completed';

          // Returning this object from the innerFn has the same effect as
          // breaking out of the dispatch switch statement.
          var ContinueSentinel = {};

          // Dummy constructor functions that we use as the .constructor and
          // .constructor.prototype properties for functions that return Generator
          // objects. For full spec compliance, you may wish to configure your
          // minifier not to mangle the names of these two functions.
          function Generator() {}
          function GeneratorFunction() {}
          function GeneratorFunctionPrototype() {}

          // This is a polyfill for %IteratorPrototype% for environments that
          // don't natively support it.
          var IteratorPrototype = {};
          IteratorPrototype[iteratorSymbol] = function() {
            return this;
          };

          var getProto = Object.getPrototypeOf;
          var NativeIteratorPrototype =
            getProto && getProto(getProto(values([])));
          if (
            NativeIteratorPrototype &&
            NativeIteratorPrototype !== Op &&
            hasOwn.call(NativeIteratorPrototype, iteratorSymbol)
          ) {
            // This environment has a native %IteratorPrototype%; use it instead
            // of the polyfill.
            IteratorPrototype = NativeIteratorPrototype;
          }

          var Gp = (GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(
            IteratorPrototype,
          ));
          GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
          GeneratorFunctionPrototype.constructor = GeneratorFunction;
          GeneratorFunctionPrototype[
            toStringTagSymbol
          ] = GeneratorFunction.displayName = 'GeneratorFunction';

          // Helper for defining the .next, .throw, and .return methods of the
          // Iterator interface in terms of a single ._invoke method.
          function defineIteratorMethods(prototype) {
            ['next', 'throw', 'return'].forEach(function(method) {
              prototype[method] = function(arg) {
                return this._invoke(method, arg);
              };
            });
          }

          exports.isGeneratorFunction = function(genFun) {
            var ctor = typeof genFun === 'function' && genFun.constructor;
            return ctor
              ? ctor === GeneratorFunction ||
                  // For the native GeneratorFunction constructor, the best we can
                  // do is to check its .name property.
                  (ctor.displayName || ctor.name) === 'GeneratorFunction'
              : false;
          };

          exports.mark = function(genFun) {
            if (Object.setPrototypeOf) {
              Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
            } else {
              genFun.__proto__ = GeneratorFunctionPrototype;
              if (!(toStringTagSymbol in genFun)) {
                genFun[toStringTagSymbol] = 'GeneratorFunction';
              }
            }
            genFun.prototype = Object.create(Gp);
            return genFun;
          };

          // Within the body of any async function, `await x` is transformed to
          // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
          // `hasOwn.call(value, "__await")` to determine if the yielded value is
          // meant to be awaited.
          exports.awrap = function(arg) {
            return { __await: arg };
          };

          function AsyncIterator(generator) {
            function invoke(method, arg, resolve, reject) {
              var record = tryCatch(generator[method], generator, arg);
              if (record.type === 'throw') {
                reject(record.arg);
              } else {
                var result = record.arg;
                var value = result.value;
                if (
                  value &&
                  typeof value === 'object' &&
                  hasOwn.call(value, '__await')
                ) {
                  return Promise.resolve(value.__await).then(
                    function(value) {
                      invoke('next', value, resolve, reject);
                    },
                    function(err) {
                      invoke('throw', err, resolve, reject);
                    },
                  );
                }

                return Promise.resolve(value).then(
                  function(unwrapped) {
                    // When a yielded Promise is resolved, its final value becomes
                    // the .value of the Promise<{value,done}> result for the
                    // current iteration.
                    result.value = unwrapped;
                    resolve(result);
                  },
                  function(error) {
                    // If a rejected Promise was yielded, throw the rejection back
                    // into the async generator function so it can be handled there.
                    return invoke('throw', error, resolve, reject);
                  },
                );
              }
            }

            var previousPromise;

            function enqueue(method, arg) {
              function callInvokeWithMethodAndArg() {
                return new Promise(function(resolve, reject) {
                  invoke(method, arg, resolve, reject);
                });
              }

              return (previousPromise =
                // If enqueue has been called before, then we want to wait until
                // all previous Promises have been resolved before calling invoke,
                // so that results are always delivered in the correct order. If
                // enqueue has not been called before, then it is important to
                // call invoke immediately, without waiting on a callback to fire,
                // so that the async generator function has the opportunity to do
                // any necessary setup in a predictable way. This predictability
                // is why the Promise constructor synchronously invokes its
                // executor callback, and why async functions synchronously
                // execute code before the first await. Since we implement simple
                // async functions in terms of async generators, it is especially
                // important to get this right, even though it requires care.
                previousPromise
                  ? previousPromise.then(
                      callInvokeWithMethodAndArg,
                      // Avoid propagating failures to Promises returned by later
                      // invocations of the iterator.
                      callInvokeWithMethodAndArg,
                    )
                  : callInvokeWithMethodAndArg());
            }

            // Define the unified helper method that is used to implement .next,
            // .throw, and .return (see defineIteratorMethods).
            this._invoke = enqueue;
          }

          defineIteratorMethods(AsyncIterator.prototype);
          AsyncIterator.prototype[asyncIteratorSymbol] = function() {
            return this;
          };
          exports.AsyncIterator = AsyncIterator;

          // Note that simple async functions are implemented on top of
          // AsyncIterator objects; they just return a Promise for the value of
          // the final result produced by the iterator.
          exports.async = function(innerFn, outerFn, self, tryLocsList) {
            var iter = new AsyncIterator(
              wrap(innerFn, outerFn, self, tryLocsList),
            );

            return exports.isGeneratorFunction(outerFn)
              ? iter // If outerFn is a generator, return the full iterator.
              : iter.next().then(function(result) {
                  return result.done ? result.value : iter.next();
                });
          };

          function makeInvokeMethod(innerFn, self, context) {
            var state = GenStateSuspendedStart;

            return function invoke(method, arg) {
              if (state === GenStateExecuting) {
                throw new Error('Generator is already running');
              }

              if (state === GenStateCompleted) {
                if (method === 'throw') {
                  throw arg;
                }

                // Be forgiving, per 25.3.3.3.3 of the spec:
                // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
                return doneResult();
              }

              context.method = method;
              context.arg = arg;

              while (true) {
                var delegate = context.delegate;
                if (delegate) {
                  var delegateResult = maybeInvokeDelegate(delegate, context);
                  if (delegateResult) {
                    if (delegateResult === ContinueSentinel) continue;
                    return delegateResult;
                  }
                }

                if (context.method === 'next') {
                  // Setting context._sent for legacy support of Babel's
                  // function.sent implementation.
                  context.sent = context._sent = context.arg;
                } else if (context.method === 'throw') {
                  if (state === GenStateSuspendedStart) {
                    state = GenStateCompleted;
                    throw context.arg;
                  }

                  context.dispatchException(context.arg);
                } else if (context.method === 'return') {
                  context.abrupt('return', context.arg);
                }

                state = GenStateExecuting;

                var record = tryCatch(innerFn, self, context);
                if (record.type === 'normal') {
                  // If an exception is thrown from innerFn, we leave state ===
                  // GenStateExecuting and loop back for another invocation.
                  state = context.done
                    ? GenStateCompleted
                    : GenStateSuspendedYield;

                  if (record.arg === ContinueSentinel) {
                    continue;
                  }

                  return {
                    value: record.arg,
                    done: context.done,
                  };
                } else if (record.type === 'throw') {
                  state = GenStateCompleted;
                  // Dispatch the exception by looping back around to the
                  // context.dispatchException(context.arg) call above.
                  context.method = 'throw';
                  context.arg = record.arg;
                }
              }
            };
          }

          // Call delegate.iterator[context.method](context.arg) and handle the
          // result, either by returning a { value, done } result from the
          // delegate iterator, or by modifying context.method and context.arg,
          // setting context.delegate to null, and returning the ContinueSentinel.
          function maybeInvokeDelegate(delegate, context) {
            var method = delegate.iterator[context.method];
            if (method === undefined) {
              // A .throw or .return when the delegate iterator has no .throw
              // method always terminates the yield* loop.
              context.delegate = null;

              if (context.method === 'throw') {
                // Note: ["return"] must be used for ES3 parsing compatibility.
                if (delegate.iterator['return']) {
                  // If the delegate iterator has a return method, give it a
                  // chance to clean up.
                  context.method = 'return';
                  context.arg = undefined;
                  maybeInvokeDelegate(delegate, context);

                  if (context.method === 'throw') {
                    // If maybeInvokeDelegate(context) changed context.method from
                    // "return" to "throw", let that override the TypeError below.
                    return ContinueSentinel;
                  }
                }

                context.method = 'throw';
                context.arg = new TypeError(
                  "The iterator does not provide a 'throw' method",
                );
              }

              return ContinueSentinel;
            }

            var record = tryCatch(method, delegate.iterator, context.arg);

            if (record.type === 'throw') {
              context.method = 'throw';
              context.arg = record.arg;
              context.delegate = null;
              return ContinueSentinel;
            }

            var info = record.arg;

            if (!info) {
              context.method = 'throw';
              context.arg = new TypeError('iterator result is not an object');
              context.delegate = null;
              return ContinueSentinel;
            }

            if (info.done) {
              // Assign the result of the finished delegate to the temporary
              // variable specified by delegate.resultName (see delegateYield).
              context[delegate.resultName] = info.value;

              // Resume execution at the desired location (see delegateYield).
              context.next = delegate.nextLoc;

              // If context.method was "throw" but the delegate handled the
              // exception, let the outer generator proceed normally. If
              // context.method was "next", forget context.arg since it has been
              // "consumed" by the delegate iterator. If context.method was
              // "return", allow the original .return call to continue in the
              // outer generator.
              if (context.method !== 'return') {
                context.method = 'next';
                context.arg = undefined;
              }
            } else {
              // Re-yield the result returned by the delegate method.
              return info;
            }

            // The delegate iterator is finished, so forget it and continue with
            // the outer generator.
            context.delegate = null;
            return ContinueSentinel;
          }

          // Define Generator.prototype.{next,throw,return} in terms of the
          // unified ._invoke helper method.
          defineIteratorMethods(Gp);

          Gp[toStringTagSymbol] = 'Generator';

          // A Generator should always return itself as the iterator object when the
          // @@iterator function is called on it. Some browsers' implementations of the
          // iterator prototype chain incorrectly implement this, causing the Generator
          // object to not be returned from this call. This ensures that doesn't happen.
          // See https://github.com/facebook/regenerator/issues/274 for more details.
          Gp[iteratorSymbol] = function() {
            return this;
          };

          Gp.toString = function() {
            return '[object Generator]';
          };

          function pushTryEntry(locs) {
            var entry = { tryLoc: locs[0] };

            if (1 in locs) {
              entry.catchLoc = locs[1];
            }

            if (2 in locs) {
              entry.finallyLoc = locs[2];
              entry.afterLoc = locs[3];
            }

            this.tryEntries.push(entry);
          }

          function resetTryEntry(entry) {
            var record = entry.completion || {};
            record.type = 'normal';
            delete record.arg;
            entry.completion = record;
          }

          function Context(tryLocsList) {
            // The root entry object (effectively a try statement without a catch
            // or a finally block) gives us a place to store values thrown from
            // locations where there is no enclosing try statement.
            this.tryEntries = [{ tryLoc: 'root' }];
            tryLocsList.forEach(pushTryEntry, this);
            this.reset(true);
          }

          exports.keys = function(object) {
            var keys = [];
            for (var key in object) {
              keys.push(key);
            }
            keys.reverse();

            // Rather than returning an object with a next method, we keep
            // things simple and return the next function itself.
            return function next() {
              while (keys.length) {
                var key = keys.pop();
                if (key in object) {
                  next.value = key;
                  next.done = false;
                  return next;
                }
              }

              // To avoid creating an additional object, we just hang the .value
              // and .done properties off the next function object itself. This
              // also ensures that the minifier will not anonymize the function.
              next.done = true;
              return next;
            };
          };

          function values(iterable) {
            if (iterable) {
              var iteratorMethod = iterable[iteratorSymbol];
              if (iteratorMethod) {
                return iteratorMethod.call(iterable);
              }

              if (typeof iterable.next === 'function') {
                return iterable;
              }

              if (!isNaN(iterable.length)) {
                var i = -1,
                  next = function next() {
                    while (++i < iterable.length) {
                      if (hasOwn.call(iterable, i)) {
                        next.value = iterable[i];
                        next.done = false;
                        return next;
                      }
                    }

                    next.value = undefined;
                    next.done = true;

                    return next;
                  };

                return (next.next = next);
              }
            }

            // Return an iterator with no values.
            return { next: doneResult };
          }
          exports.values = values;

          function doneResult() {
            return { value: undefined, done: true };
          }

          Context.prototype = {
            constructor: Context,

            reset: function(skipTempReset) {
              this.prev = 0;
              this.next = 0;
              // Resetting context._sent for legacy support of Babel's
              // function.sent implementation.
              this.sent = this._sent = undefined;
              this.done = false;
              this.delegate = null;

              this.method = 'next';
              this.arg = undefined;

              this.tryEntries.forEach(resetTryEntry);

              if (!skipTempReset) {
                for (var name in this) {
                  // Not sure about the optimal order of these conditions:
                  if (
                    name.charAt(0) === 't' &&
                    hasOwn.call(this, name) &&
                    !isNaN(+name.slice(1))
                  ) {
                    this[name] = undefined;
                  }
                }
              }
            },

            stop: function() {
              this.done = true;

              var rootEntry = this.tryEntries[0];
              var rootRecord = rootEntry.completion;
              if (rootRecord.type === 'throw') {
                throw rootRecord.arg;
              }

              return this.rval;
            },

            dispatchException: function(exception) {
              if (this.done) {
                throw exception;
              }

              var context = this;
              function handle(loc, caught) {
                record.type = 'throw';
                record.arg = exception;
                context.next = loc;

                if (caught) {
                  // If the dispatched exception was caught by a catch block,
                  // then let that catch block handle the exception normally.
                  context.method = 'next';
                  context.arg = undefined;
                }

                return !!caught;
              }

              for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                var entry = this.tryEntries[i];
                var record = entry.completion;

                if (entry.tryLoc === 'root') {
                  // Exception thrown outside of any try block that could handle
                  // it, so set the completion value of the entire function to
                  // throw the exception.
                  return handle('end');
                }

                if (entry.tryLoc <= this.prev) {
                  var hasCatch = hasOwn.call(entry, 'catchLoc');
                  var hasFinally = hasOwn.call(entry, 'finallyLoc');

                  if (hasCatch && hasFinally) {
                    if (this.prev < entry.catchLoc) {
                      return handle(entry.catchLoc, true);
                    } else if (this.prev < entry.finallyLoc) {
                      return handle(entry.finallyLoc);
                    }
                  } else if (hasCatch) {
                    if (this.prev < entry.catchLoc) {
                      return handle(entry.catchLoc, true);
                    }
                  } else if (hasFinally) {
                    if (this.prev < entry.finallyLoc) {
                      return handle(entry.finallyLoc);
                    }
                  } else {
                    throw new Error('try statement without catch or finally');
                  }
                }
              }
            },

            abrupt: function(type, arg) {
              for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                var entry = this.tryEntries[i];
                if (
                  entry.tryLoc <= this.prev &&
                  hasOwn.call(entry, 'finallyLoc') &&
                  this.prev < entry.finallyLoc
                ) {
                  var finallyEntry = entry;
                  break;
                }
              }

              if (
                finallyEntry &&
                (type === 'break' || type === 'continue') &&
                finallyEntry.tryLoc <= arg &&
                arg <= finallyEntry.finallyLoc
              ) {
                // Ignore the finally entry if control is not jumping to a
                // location outside the try/catch block.
                finallyEntry = null;
              }

              var record = finallyEntry ? finallyEntry.completion : {};
              record.type = type;
              record.arg = arg;

              if (finallyEntry) {
                this.method = 'next';
                this.next = finallyEntry.finallyLoc;
                return ContinueSentinel;
              }

              return this.complete(record);
            },

            complete: function(record, afterLoc) {
              if (record.type === 'throw') {
                throw record.arg;
              }

              if (record.type === 'break' || record.type === 'continue') {
                this.next = record.arg;
              } else if (record.type === 'return') {
                this.rval = this.arg = record.arg;
                this.method = 'return';
                this.next = 'end';
              } else if (record.type === 'normal' && afterLoc) {
                this.next = afterLoc;
              }

              return ContinueSentinel;
            },

            finish: function(finallyLoc) {
              for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                var entry = this.tryEntries[i];
                if (entry.finallyLoc === finallyLoc) {
                  this.complete(entry.completion, entry.afterLoc);
                  resetTryEntry(entry);
                  return ContinueSentinel;
                }
              }
            },

            catch: function(tryLoc) {
              for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                var entry = this.tryEntries[i];
                if (entry.tryLoc === tryLoc) {
                  var record = entry.completion;
                  if (record.type === 'throw') {
                    var thrown = record.arg;
                    resetTryEntry(entry);
                  }
                  return thrown;
                }
              }

              // The context.catch method must only be called with a location
              // argument that corresponds to a known catch block.
              throw new Error('illegal catch attempt');
            },

            delegateYield: function(iterable, resultName, nextLoc) {
              this.delegate = {
                iterator: values(iterable),
                resultName: resultName,
                nextLoc: nextLoc,
              };

              if (this.method === 'next') {
                // Deliberately forget the last sent value so that we don't
                // accidentally pass it on to the delegate.
                this.arg = undefined;
              }

              return ContinueSentinel;
            },
          };

          // Regardless of whether this script is executing as a CommonJS module
          // or not, return the runtime object so that we can declare the variable
          // regeneratorRuntime in the outer scope, which allows this module to be
          // injected easily by `bin/regenerator --include-runtime script.js`.
          return exports;
        })(
          // If this script is executing as a CommonJS module, use module.exports
          // as the regeneratorRuntime namespace. Otherwise create a new empty
          // object. Either way, the resulting object will be used to initialize
          // the regeneratorRuntime variable at the top of this file.
          typeof module === 'object' ? module.exports : {},
        );

        try {
          regeneratorRuntime = runtime;
        } catch (accidentalStrictMode) {
          // This module should not be running in strict mode, so the above
          // assignment should always work unless something is misconfigured. Just
          // in case runtime.js accidentally runs in strict mode, we can escape
          // strict mode using a global Function call. This could conceivably fail
          // if a Content Security Policy forbids using Function, but in that case
          // the proper solution is to fix the accidental strict mode problem. If
          // you've misconfigured your bundler to force strict mode and applied a
          // CSP to forbid Function, and you're not willing to fix either of those
          // problems, please detail your unique predicament in a GitHub issue.
          Function('r', 'regeneratorRuntime = r')(runtime);
        }
      },
      {},
    ],
    'node_modules/idb/build/esm/wrap-idb-value.js': [
      function(require, module, exports) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });
        exports.r = replaceTraps;
        exports.w = wrap;
        exports.u = exports.i = exports.a = void 0;

        const instanceOfAny = (object, constructors) =>
          constructors.some(c => object instanceof c);

        exports.i = instanceOfAny;
        let idbProxyableTypes;
        let cursorAdvanceMethods; // This is a function to prevent it throwing up in node environments.

        function getIdbProxyableTypes() {
          return (
            idbProxyableTypes ||
            (idbProxyableTypes = [
              IDBDatabase,
              IDBObjectStore,
              IDBIndex,
              IDBCursor,
              IDBTransaction,
            ])
          );
        } // This is a function to prevent it throwing up in node environments.

        function getCursorAdvanceMethods() {
          return (
            cursorAdvanceMethods ||
            (cursorAdvanceMethods = [
              IDBCursor.prototype.advance,
              IDBCursor.prototype.continue,
              IDBCursor.prototype.continuePrimaryKey,
            ])
          );
        }

        const cursorRequestMap = new WeakMap();
        const transactionDoneMap = new WeakMap();
        const transactionStoreNamesMap = new WeakMap();
        const transformCache = new WeakMap();
        const reverseTransformCache = new WeakMap();
        exports.a = reverseTransformCache;

        function promisifyRequest(request) {
          const promise = new Promise((resolve, reject) => {
            const unlisten = () => {
              request.removeEventListener('success', success);
              request.removeEventListener('error', error);
            };

            const success = () => {
              resolve(wrap(request.result));
              unlisten();
            };

            const error = () => {
              reject(request.error);
              unlisten();
            };

            request.addEventListener('success', success);
            request.addEventListener('error', error);
          });
          promise
            .then(value => {
              // Since cursoring reuses the IDBRequest (*sigh*), we cache it for later retrieval
              // (see wrapFunction).
              if (value instanceof IDBCursor) {
                cursorRequestMap.set(value, request);
              } // Catching to avoid "Uncaught Promise exceptions"
            })
            .catch(() => {}); // This mapping exists in reverseTransformCache but doesn't doesn't exist in transformCache. This
          // is because we create many promises from a single IDBRequest.

          reverseTransformCache.set(promise, request);
          return promise;
        }

        function cacheDonePromiseForTransaction(tx) {
          // Early bail if we've already created a done promise for this transaction.
          if (transactionDoneMap.has(tx)) return;
          const done = new Promise((resolve, reject) => {
            const unlisten = () => {
              tx.removeEventListener('complete', complete);
              tx.removeEventListener('error', error);
              tx.removeEventListener('abort', error);
            };

            const complete = () => {
              resolve();
              unlisten();
            };

            const error = () => {
              reject(tx.error || new DOMException('AbortError', 'AbortError'));
              unlisten();
            };

            tx.addEventListener('complete', complete);
            tx.addEventListener('error', error);
            tx.addEventListener('abort', error);
          }); // Cache it for later retrieval.

          transactionDoneMap.set(tx, done);
        }

        let idbProxyTraps = {
          get(target, prop, receiver) {
            if (target instanceof IDBTransaction) {
              // Special handling for transaction.done.
              if (prop === 'done') return transactionDoneMap.get(target); // Polyfill for objectStoreNames because of Edge.

              if (prop === 'objectStoreNames') {
                return (
                  target.objectStoreNames ||
                  transactionStoreNamesMap.get(target)
                );
              } // Make tx.store return the only store in the transaction, or undefined if there are many.

              if (prop === 'store') {
                return receiver.objectStoreNames[1]
                  ? undefined
                  : receiver.objectStore(receiver.objectStoreNames[0]);
              }
            } // Else transform whatever we get back.

            return wrap(target[prop]);
          },

          set(target, prop, value) {
            target[prop] = value;
            return true;
          },

          has(target, prop) {
            if (
              target instanceof IDBTransaction &&
              (prop === 'done' || prop === 'store')
            ) {
              return true;
            }

            return prop in target;
          },
        };

        function replaceTraps(callback) {
          idbProxyTraps = callback(idbProxyTraps);
        }

        function wrapFunction(func) {
          // Due to expected object equality (which is enforced by the caching in `wrap`), we
          // only create one new func per func.
          // Edge doesn't support objectStoreNames (booo), so we polyfill it here.
          if (
            func === IDBDatabase.prototype.transaction &&
            !('objectStoreNames' in IDBTransaction.prototype)
          ) {
            return function(storeNames, ...args) {
              const tx = func.call(unwrap(this), storeNames, ...args);
              transactionStoreNamesMap.set(
                tx,
                storeNames.sort ? storeNames.sort() : [storeNames],
              );
              return wrap(tx);
            };
          } // Cursor methods are special, as the behaviour is a little more different to standard IDB. In
          // IDB, you advance the cursor and wait for a new 'success' on the IDBRequest that gave you the
          // cursor. It's kinda like a promise that can resolve with many values. That doesn't make sense
          // with real promises, so each advance methods returns a new promise for the cursor object, or
          // undefined if the end of the cursor has been reached.

          if (getCursorAdvanceMethods().includes(func)) {
            return function(...args) {
              // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
              // the original object.
              func.apply(unwrap(this), args);
              return wrap(cursorRequestMap.get(this));
            };
          }

          return function(...args) {
            // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
            // the original object.
            return wrap(func.apply(unwrap(this), args));
          };
        }

        function transformCachableValue(value) {
          if (typeof value === 'function') return wrapFunction(value); // This doesn't return, it just creates a 'done' promise for the transaction,
          // which is later returned for transaction.done (see idbObjectHandler).

          if (value instanceof IDBTransaction)
            cacheDonePromiseForTransaction(value);
          if (instanceOfAny(value, getIdbProxyableTypes()))
            return new Proxy(value, idbProxyTraps); // Return the same value back if we're not going to transform it.

          return value;
        }

        function wrap(value) {
          // We sometimes generate multiple promises from a single IDBRequest (eg when cursoring), because
          // IDB is weird and a single IDBRequest can yield many responses, so these can't be cached.
          if (value instanceof IDBRequest) return promisifyRequest(value); // If we've already transformed this value before, reuse the transformed value.
          // This is faster, but it also provides object equality.

          if (transformCache.has(value)) return transformCache.get(value);
          const newValue = transformCachableValue(value); // Not all types are transformed.
          // These may be primitive types, so they can't be WeakMap keys.

          if (newValue !== value) {
            transformCache.set(value, newValue);
            reverseTransformCache.set(newValue, value);
          }

          return newValue;
        }

        const unwrap = value => reverseTransformCache.get(value);

        exports.u = unwrap;
      },
      {},
    ],
    'node_modules/idb/build/esm/index.js': [
      function(require, module, exports) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });
        exports.deleteDB = deleteDB;
        exports.openDB = openDB;
        Object.defineProperty(exports, 'unwrap', {
          enumerable: true,
          get: function() {
            return _wrapIdbValue.u;
          },
        });
        Object.defineProperty(exports, 'wrap', {
          enumerable: true,
          get: function() {
            return _wrapIdbValue.w;
          },
        });

        var _wrapIdbValue = require('./wrap-idb-value.js');

        /**
         * Open a database.
         *
         * @param name Name of the database.
         * @param version Schema version.
         * @param callbacks Additional callbacks.
         */
        function openDB(
          name,
          version,
          { blocked, upgrade, blocking, terminated } = {},
        ) {
          const request = indexedDB.open(name, version);
          const openPromise = (0, _wrapIdbValue.w)(request);

          if (upgrade) {
            request.addEventListener('upgradeneeded', event => {
              upgrade(
                (0, _wrapIdbValue.w)(request.result),
                event.oldVersion,
                event.newVersion,
                (0, _wrapIdbValue.w)(request.transaction),
              );
            });
          }

          if (blocked) request.addEventListener('blocked', () => blocked());
          if (terminated) request.addEventListener('close', () => terminated());

          if (blocking) {
            openPromise
              .then(db => db.addEventListener('versionchange', blocking))
              .catch(() => {});
          }

          return openPromise;
        }
        /**
         * Delete a database.
         *
         * @param name Name of the database.
         */

        function deleteDB(name, { blocked } = {}) {
          const request = indexedDB.deleteDatabase(name);
          if (blocked) request.addEventListener('blocked', () => blocked());
          return (0, _wrapIdbValue.w)(request).then(() => undefined);
        }

        const readMethods = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'];
        const writeMethods = ['put', 'add', 'delete', 'clear'];
        const cachedMethods = new Map();

        function getMethod(target, prop) {
          if (
            !(
              target instanceof IDBDatabase &&
              !(prop in target) &&
              typeof prop === 'string'
            )
          ) {
            return;
          }

          if (cachedMethods.get(prop)) return cachedMethods.get(prop);
          const targetFuncName = prop.replace(/FromIndex$/, '');
          const useIndex = prop !== targetFuncName;
          const isWrite = writeMethods.includes(targetFuncName);

          if (
            // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
            !(
              targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype
            ) ||
            !(isWrite || readMethods.includes(targetFuncName))
          ) {
            return;
          }

          const method = async function(storeName, ...args) {
            // isWrite ? 'readwrite' : undefined gzipps better, but fails in Edge :(
            const tx = this.transaction(
              storeName,
              isWrite ? 'readwrite' : 'readonly',
            );
            let target = tx.store;
            if (useIndex) target = target.index(args.shift());
            const returnVal = target[targetFuncName](...args);
            if (isWrite) await tx.done;
            return returnVal;
          };

          cachedMethods.set(prop, method);
          return method;
        }

        (0, _wrapIdbValue.r)(oldTraps => ({
          ...oldTraps,
          get: (target, prop, receiver) =>
            getMethod(target, prop) || oldTraps.get(target, prop, receiver),
          has: (target, prop) =>
            !!getMethod(target, prop) || oldTraps.has(target, prop),
        }));
      },
      { './wrap-idb-value.js': 'node_modules/idb/build/esm/wrap-idb-value.js' },
    ],
    'src/instance.ts': [
      function(require, module, exports) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });
        exports.setDBInstance = setDBInstance;
        exports.getDBInstance = getDBInstance;
        var instance;
        /**
         * Sets the database instance
         *
         * @param {IDBPDatabase} db
         * @returns {void}
         */

        function setDBInstance(db) {
          instance = db;
        }
        /**
         * Returns the database instance
         *
         * @returns {IDBPDatabase}
         */

        function getDBInstance() {
          return instance;
        }
      },
      {},
    ],
    'schema/index.js': [
      function(require, module, exports) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });
        exports.schema = void 0;
        const schema = [
          {
            storeName: 'store1',
            autoIncrement: 'true',
            keyPath: 'id',
            data: [
              {
                foo: 'bar',
              },
            ],
          },
        ];
        exports.schema = schema;
      },
      {},
    ],
    'src/constants/db.ts': [
      function(require, module, exports) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });
        exports.VERSION = exports.DB_NAME = exports.WRITE_ACCESS = void 0;
        var WRITE_ACCESS = 'readwrite';
        exports.WRITE_ACCESS = WRITE_ACCESS;
        var DB_NAME = 'sw-server';
        exports.DB_NAME = DB_NAME;
        var VERSION = 1;
        exports.VERSION = VERSION;
      },
      {},
    ],
    'src/db.ts': [
      function(require, module, exports) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });
        exports.createStore = createStore;
        exports.setupTransaction = setupTransaction;
        exports.getObjectStore = getObjectStore;
        exports.find = find;
        exports.add = add;
        exports.remove = remove;
        exports.seed = seed;
        exports.removeDB = removeDB;

        require('regenerator-runtime/runtime');

        var _idb = require('idb');

        var _instance = require('./instance');

        var _schema = require('../schema');

        var _db = require('./constants/db');

        var __awaiter =
          (void 0 && (void 0).__awaiter) ||
          function(thisArg, _arguments, P, generator) {
            function adopt(value) {
              return value instanceof P
                ? value
                : new P(function(resolve) {
                    resolve(value);
                  });
            }

            return new (P || (P = Promise))(function(resolve, reject) {
              function fulfilled(value) {
                try {
                  step(generator.next(value));
                } catch (e) {
                  reject(e);
                }
              }

              function rejected(value) {
                try {
                  step(generator['throw'](value));
                } catch (e) {
                  reject(e);
                }
              }

              function step(result) {
                result.done
                  ? resolve(result.value)
                  : adopt(result.value).then(fulfilled, rejected);
              }

              step(
                (generator = generator.apply(thisArg, _arguments || [])).next(),
              );
            });
          };

        var __generator =
          (void 0 && (void 0).__generator) ||
          function(thisArg, body) {
            var _ = {
                label: 0,
                sent: function() {
                  if (t[0] & 1) throw t[1];
                  return t[1];
                },
                trys: [],
                ops: [],
              },
              f,
              y,
              t,
              g;
            return (
              (g = {
                next: verb(0),
                throw: verb(1),
                return: verb(2),
              }),
              typeof Symbol === 'function' &&
                (g[Symbol.iterator] = function() {
                  return this;
                }),
              g
            );

            function verb(n) {
              return function(v) {
                return step([n, v]);
              };
            }

            function step(op) {
              if (f) throw new TypeError('Generator is already executing.');

              while (_)
                try {
                  if (
                    ((f = 1),
                    y &&
                      (t =
                        op[0] & 2
                          ? y['return']
                          : op[0]
                          ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                          : y.next) &&
                      !(t = t.call(y, op[1])).done)
                  )
                    return t;
                  if (((y = 0), t)) op = [op[0] & 2, t.value];

                  switch (op[0]) {
                    case 0:
                    case 1:
                      t = op;
                      break;

                    case 4:
                      _.label++;
                      return {
                        value: op[1],
                        done: false,
                      };

                    case 5:
                      _.label++;
                      y = op[1];
                      op = [0];
                      continue;

                    case 7:
                      op = _.ops.pop();

                      _.trys.pop();

                      continue;

                    default:
                      if (
                        !((t = _.trys),
                        (t = t.length > 0 && t[t.length - 1])) &&
                        (op[0] === 6 || op[0] === 2)
                      ) {
                        _ = 0;
                        continue;
                      }

                      if (
                        op[0] === 3 &&
                        (!t || (op[1] > t[0] && op[1] < t[3]))
                      ) {
                        _.label = op[1];
                        break;
                      }

                      if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                      }

                      if (t && _.label < t[2]) {
                        _.label = t[2];

                        _.ops.push(op);

                        break;
                      }

                      if (t[2]) _.ops.pop();

                      _.trys.pop();

                      continue;
                  }

                  op = body.call(thisArg, _);
                } catch (e) {
                  op = [6, e];
                  y = 0;
                } finally {
                  f = t = 0;
                }

              if (op[0] & 5) throw op[1];
              return {
                value: op[0] ? op[1] : void 0,
                done: true,
              };
            }
          };

        /**
         * Create a new IndexedDB store
         *
         * @param {IDBPDatabase} db
         * @param {Store} store
         * @returns {Promise<void>}
         */
        function createStore(db, store) {
          return __awaiter(this, void 0, Promise, function() {
            var storeName, keyPath, autoIncrement;
            return __generator(this, function(_a) {
              (storeName = store.storeName),
                (keyPath = store.keyPath),
                (autoIncrement = store.autoIncrement);

              if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, {
                  keyPath: keyPath,
                  autoIncrement: autoIncrement,
                });
              }

              return [
                2,
                /*return*/
              ];
            });
          });
        }
        /**
         * Prepare an IndexedDB transaction
         *
         * @param {string} storeName
         * @returns {Promise<IDBPTransaction>}
         */

        function setupTransaction(storeName) {
          return __awaiter(this, void 0, Promise, function() {
            return __generator(this, function(_a) {
              return [
                2,
                /*return*/
                (0, _instance.getDBInstance)().transaction(
                  storeName,
                  _db.WRITE_ACCESS,
                ),
              ];
            });
          });
        }
        /**
         * Return an IndexedDB store by name
         *
         * @param {string} storeName
         * @param {IDBPTransaction} tx
         * @returns {Promsie<IDBPObjectStore>}
         */

        function getObjectStore(storeName, tx) {
          return __awaiter(this, void 0, Promise, function() {
            return __generator(this, function(_a) {
              return [
                2,
                /*return*/
                tx.objectStore(storeName),
              ];
            });
          });
        }
        /**
         * Find a value in a store by id
         *
         * @param {string} storeName
         * @param {string} id
         * @returns {Promise<unknown>}
         */

        function find(storeName, id) {
          return __awaiter(this, void 0, Promise, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [
                    4,
                    /*yield*/
                    (0, _instance.getDBInstance)().get(storeName, parseInt(id)),
                  ];

                case 1:
                  return [
                    2,
                    /*return*/
                    _a.sent(),
                  ];
              }
            });
          });
        }
        /**
         * Add a new value to a store
         *
         * @param {string} storeName
         * @param {object} data
         * @returns {Promise<void>}
         */

        function add(storeName, data) {
          return __awaiter(this, void 0, Promise, function() {
            var tx, store;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [
                    4,
                    /*yield*/
                    setupTransaction(storeName),
                  ];

                case 1:
                  tx = _a.sent();
                  return [
                    4,
                    /*yield*/
                    getObjectStore(storeName, tx),
                  ];

                case 2:
                  store = _a.sent();
                  return [
                    4,
                    /*yield*/
                    store.put(data),
                  ];

                case 3:
                  _a.sent();

                  return [
                    4,
                    /*yield*/
                    tx.done,
                  ];

                case 4:
                  _a.sent();

                  return [
                    2,
                    /*return*/
                  ];
              }
            });
          });
        }
        /**
         * Remove a value from a store by id
         *
         * @param {string} storeName
         * @param {number} id
         * @returns {Promise<void>}
         */

        function remove(storeName, id) {
          return __awaiter(this, void 0, Promise, function() {
            var tx, store;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [
                    4,
                    /*yield*/
                    setupTransaction(storeName),
                  ];

                case 1:
                  tx = _a.sent();
                  return [
                    4,
                    /*yield*/
                    getObjectStore(storeName, tx),
                  ];

                case 2:
                  store = _a.sent();
                  return [
                    4,
                    /*yield*/
                    store.delete(id),
                  ];

                case 3:
                  _a.sent();

                  return [
                    4,
                    /*yield*/
                    tx.done,
                  ];

                case 4:
                  _a.sent();

                  return [
                    2,
                    /*return*/
                  ];
              }
            });
          });
        }
        /**
         * Open IndexedDB and seed with schema data
         *
         * @returns {Promise<void>}
         */

        function seed() {
          return __awaiter(this, void 0, Promise, function() {
            var db;

            var _this = this;

            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  if (!_schema.schema) {
                    throw new Error(
                      'Schema must be provided to initialize database!',
                    );
                  }

                  return [
                    4,
                    /*yield*/
                    (0, _idb.openDB)(_db.DB_NAME, _db.VERSION, {
                      upgrade: function(db) {
                        var _this = this;

                        _schema.schema.forEach(function(store) {
                          return __awaiter(_this, void 0, void 0, function() {
                            return __generator(this, function(_a) {
                              switch (_a.label) {
                                case 0:
                                  return [
                                    4,
                                    /*yield*/
                                    createStore(db, store),
                                  ];

                                case 1:
                                  return [
                                    2,
                                    /*return*/
                                    _a.sent(),
                                  ];
                              }
                            });
                          });
                        });
                      },
                    }),
                  ];

                case 1:
                  db = _a.sent();
                  (0, _instance.setDBInstance)(db);

                  _schema.schema.forEach(function(_a) {
                    var _b = _a.storeName,
                      storeName = _b === void 0 ? '' : _b,
                      _c = _a.data,
                      data = _c === void 0 ? [] : _c;
                    return data.forEach(function(item) {
                      return __awaiter(_this, void 0, void 0, function() {
                        return __generator(this, function(_a) {
                          switch (_a.label) {
                            case 0:
                              return [
                                4,
                                /*yield*/
                                add(storeName, item),
                              ];

                            case 1:
                              return [
                                2,
                                /*return*/
                                _a.sent(),
                              ];
                          }
                        });
                      });
                    });
                  });

                  return [
                    2,
                    /*return*/
                  ];
              }
            });
          });
        }
        /**
         * Remove the IndexedDB
         *
         * @returns {Promise<void>}
         */

        function removeDB() {
          return __awaiter(this, void 0, Promise, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [
                    4,
                    /*yield*/
                    (0, _idb.deleteDB)(_db.DB_NAME),
                  ];

                case 1:
                  _a.sent();

                  return [
                    2,
                    /*return*/
                  ];
              }
            });
          });
        }
      },
      {
        'regenerator-runtime/runtime':
          'node_modules/regenerator-runtime/runtime.js',
        idb: 'node_modules/idb/build/esm/index.js',
        './instance': 'src/instance.ts',
        '../schema': 'schema/index.js',
        './constants/db': 'src/constants/db.ts',
      },
    ],
    'src/constants/methods.ts': [
      function(require, module, exports) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });
        exports.METHOD_POST = exports.METHOD_GET = void 0;
        var METHOD_GET = 'GET';
        exports.METHOD_GET = METHOD_GET;
        var METHOD_POST = 'POST';
        exports.METHOD_POST = METHOD_POST;
      },
      {},
    ],
    'src/constants/request.ts': [
      function(require, module, exports) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });
        exports.NO_OP = exports.PATH_DELIM = void 0;
        var PATH_DELIM = '/';
        exports.PATH_DELIM = PATH_DELIM;

        var NO_OP = function() {
          null;
        };

        exports.NO_OP = NO_OP;
      },
      {},
    ],
    'src/request.ts': [
      function(require, module, exports) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });
        exports.getPathParams = getPathParams;
        exports.getResource = getResource;
        exports.handleGet = handleGet;
        exports.handlePost = handlePost;
        exports.handleRequest = handleRequest;

        var _db = require('./db');

        var _methods = require('./constants/methods');

        var _request = require('./constants/request');

        var __awaiter =
          (void 0 && (void 0).__awaiter) ||
          function(thisArg, _arguments, P, generator) {
            function adopt(value) {
              return value instanceof P
                ? value
                : new P(function(resolve) {
                    resolve(value);
                  });
            }

            return new (P || (P = Promise))(function(resolve, reject) {
              function fulfilled(value) {
                try {
                  step(generator.next(value));
                } catch (e) {
                  reject(e);
                }
              }

              function rejected(value) {
                try {
                  step(generator['throw'](value));
                } catch (e) {
                  reject(e);
                }
              }

              function step(result) {
                result.done
                  ? resolve(result.value)
                  : adopt(result.value).then(fulfilled, rejected);
              }

              step(
                (generator = generator.apply(thisArg, _arguments || [])).next(),
              );
            });
          };

        var __generator =
          (void 0 && (void 0).__generator) ||
          function(thisArg, body) {
            var _ = {
                label: 0,
                sent: function() {
                  if (t[0] & 1) throw t[1];
                  return t[1];
                },
                trys: [],
                ops: [],
              },
              f,
              y,
              t,
              g;
            return (
              (g = {
                next: verb(0),
                throw: verb(1),
                return: verb(2),
              }),
              typeof Symbol === 'function' &&
                (g[Symbol.iterator] = function() {
                  return this;
                }),
              g
            );

            function verb(n) {
              return function(v) {
                return step([n, v]);
              };
            }

            function step(op) {
              if (f) throw new TypeError('Generator is already executing.');

              while (_)
                try {
                  if (
                    ((f = 1),
                    y &&
                      (t =
                        op[0] & 2
                          ? y['return']
                          : op[0]
                          ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                          : y.next) &&
                      !(t = t.call(y, op[1])).done)
                  )
                    return t;
                  if (((y = 0), t)) op = [op[0] & 2, t.value];

                  switch (op[0]) {
                    case 0:
                    case 1:
                      t = op;
                      break;

                    case 4:
                      _.label++;
                      return {
                        value: op[1],
                        done: false,
                      };

                    case 5:
                      _.label++;
                      y = op[1];
                      op = [0];
                      continue;

                    case 7:
                      op = _.ops.pop();

                      _.trys.pop();

                      continue;

                    default:
                      if (
                        !((t = _.trys),
                        (t = t.length > 0 && t[t.length - 1])) &&
                        (op[0] === 6 || op[0] === 2)
                      ) {
                        _ = 0;
                        continue;
                      }

                      if (
                        op[0] === 3 &&
                        (!t || (op[1] > t[0] && op[1] < t[3]))
                      ) {
                        _.label = op[1];
                        break;
                      }

                      if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                      }

                      if (t && _.label < t[2]) {
                        _.label = t[2];

                        _.ops.push(op);

                        break;
                      }

                      if (t[2]) _.ops.pop();

                      _.trys.pop();

                      continue;
                  }

                  op = body.call(thisArg, _);
                } catch (e) {
                  op = [6, e];
                  y = 0;
                } finally {
                  f = t = 0;
                }

              if (op[0] & 5) throw op[1];
              return {
                value: op[0] ? op[1] : void 0,
                done: true,
              };
            }
          };

        /**
         * This function splits a url path and returns the segments
         *
         * @param {string} path
         * @returns {string[]}
         */
        function getPathParams(path) {
          return path.slice(1).split(_request.PATH_DELIM);
        }
        /**
         * This function returns the path and query strings of a url
         *
         * @param {string} path
         * @returns {[string, string[]]}
         */

        function getResource(path) {
          var _a = getPathParams(path),
            resource = _a[0],
            rest = _a.slice(1);

          return [resource, rest];
        }
        /**
         * This function takes a GET request and handles returning the data
         *
         * @param {Object} request
         * @returns {Promise<unknown>}
         */

        function handleGet(request) {
          return __awaiter(this, void 0, Promise, function() {
            var pathname, _a, entity, params, item;

            return __generator(this, function(_b) {
              switch (_b.label) {
                case 0:
                  pathname = new URL(request.url).pathname;
                  (_a = getResource(pathname)),
                    (entity = _a[0]),
                    (params = _a[1]);
                  console.log(entity);
                  console.log(params);
                  return [
                    4,
                    /*yield*/
                    (0, _db.find)(entity, params[0]),
                  ];

                case 1:
                  item = _b.sent();
                  return [
                    2,
                    /*return*/
                    item,
                  ];
              }
            });
          });
        }
        /**
         * This function takes a POST request and handles adding the data
         *
         * @param {Object} request
         * @returns {Promise<void>}
         */

        function handlePost(request) {
          return __awaiter(this, void 0, Promise, function() {
            var pathname, entity, data;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  pathname = new URL(request.url).pathname;
                  entity = getResource(pathname)[0];
                  return [
                    4,
                    /*yield*/
                    request.json(),
                  ];

                case 1:
                  data = _a.sent();
                  (0, _db.add)(entity, data);
                  return [
                    2,
                    /*return*/
                  ];
              }
            });
          });
        }

        var methods = new Map([
          [_methods.METHOD_GET, handleGet],
          [_methods.METHOD_POST, handlePost],
        ]);
        /**
         * This function takes a request and calls the appropriate handler method
         *
         * @param {Object} request
         * @returns {void}
         */

        function handleRequest(request) {
          var fnHandler = methods.get(request.method) || _request.NO_OP;

          fnHandler(request);
        }
      },
      {
        './db': 'src/db.ts',
        './constants/methods': 'src/constants/methods.ts',
        './constants/request': 'src/constants/request.ts',
      },
    ],
    'sw.js': [
      function(require, module, exports) {
        'use strict';

        var _db = require('./src/db');

        var _request = require('./src/request');

        self.addEventListener('install', function(event) {});
        self.addEventListener('activate', async function(event) {
          await (0, _db.seed)();
        });
        self.addEventListener('fetch', async event => {
          (0, _request.handleRequest)(event.request);
        });
      },
      { './src/db': 'src/db.ts', './src/request': 'src/request.ts' },
    ],
    'node_modules/parcel-bundler/src/builtins/hmr-runtime.js': [
      function(require, module, exports) {
        var global = arguments[3];
        var OVERLAY_ID = '__parcel__error__overlay__';
        var OldModule = module.bundle.Module;

        function Module(moduleName) {
          OldModule.call(this, moduleName);
          this.hot = {
            data: module.bundle.hotData,
            _acceptCallbacks: [],
            _disposeCallbacks: [],
            accept: function(fn) {
              this._acceptCallbacks.push(fn || function() {});
            },
            dispose: function(fn) {
              this._disposeCallbacks.push(fn);
            },
          };
          module.bundle.hotData = null;
        }

        module.bundle.Module = Module;
        var checkedAssets, assetsToAccept;
        var parent = module.bundle.parent;

        if (
          (!parent || !parent.isParcelRequire) &&
          typeof WebSocket !== 'undefined'
        ) {
          var hostname = '' || location.hostname;
          var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
          var ws = new WebSocket(
            protocol + '://' + hostname + ':' + '58135' + '/',
          );

          ws.onmessage = function(event) {
            checkedAssets = {};
            assetsToAccept = [];
            var data = JSON.parse(event.data);

            if (data.type === 'update') {
              var handled = false;
              data.assets.forEach(function(asset) {
                if (!asset.isNew) {
                  var didAccept = hmrAcceptCheck(
                    global.parcelRequire,
                    asset.id,
                  );

                  if (didAccept) {
                    handled = true;
                  }
                }
              }); // Enable HMR for CSS by default.

              handled =
                handled ||
                data.assets.every(function(asset) {
                  return asset.type === 'css' && asset.generated.js;
                });

              if (handled) {
                console.clear();
                data.assets.forEach(function(asset) {
                  hmrApply(global.parcelRequire, asset);
                });
                assetsToAccept.forEach(function(v) {
                  hmrAcceptRun(v[0], v[1]);
                });
              } else if (location.reload) {
                // `location` global exists in a web worker context but lacks `.reload()` function.
                location.reload();
              }
            }

            if (data.type === 'reload') {
              ws.close();

              ws.onclose = function() {
                location.reload();
              };
            }

            if (data.type === 'error-resolved') {
              console.log('[parcel] ✨ Error resolved');
              removeErrorOverlay();
            }

            if (data.type === 'error') {
              console.error(
                '[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack,
              );
              removeErrorOverlay();
              var overlay = createErrorOverlay(data);
              document.body.appendChild(overlay);
            }
          };
        }

        function removeErrorOverlay() {
          var overlay = document.getElementById(OVERLAY_ID);

          if (overlay) {
            overlay.remove();
          }
        }

        function createErrorOverlay(data) {
          var overlay = document.createElement('div');
          overlay.id = OVERLAY_ID; // html encode message and stack trace

          var message = document.createElement('div');
          var stackTrace = document.createElement('pre');
          message.innerText = data.error.message;
          stackTrace.innerText = data.error.stack;
          overlay.innerHTML =
            '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' +
            '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' +
            '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' +
            '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' +
            message.innerHTML +
            '</div>' +
            '<pre>' +
            stackTrace.innerHTML +
            '</pre>' +
            '</div>';
          return overlay;
        }

        function getParents(bundle, id) {
          var modules = bundle.modules;

          if (!modules) {
            return [];
          }

          var parents = [];
          var k, d, dep;

          for (k in modules) {
            for (d in modules[k][1]) {
              dep = modules[k][1][d];

              if (
                dep === id ||
                (Array.isArray(dep) && dep[dep.length - 1] === id)
              ) {
                parents.push(k);
              }
            }
          }

          if (bundle.parent) {
            parents = parents.concat(getParents(bundle.parent, id));
          }

          return parents;
        }

        function hmrApply(bundle, asset) {
          var modules = bundle.modules;

          if (!modules) {
            return;
          }

          if (modules[asset.id] || !bundle.parent) {
            var fn = new Function(
              'require',
              'module',
              'exports',
              asset.generated.js,
            );
            asset.isNew = !modules[asset.id];
            modules[asset.id] = [fn, asset.deps];
          } else if (bundle.parent) {
            hmrApply(bundle.parent, asset);
          }
        }

        function hmrAcceptCheck(bundle, id) {
          var modules = bundle.modules;

          if (!modules) {
            return;
          }

          if (!modules[id] && bundle.parent) {
            return hmrAcceptCheck(bundle.parent, id);
          }

          if (checkedAssets[id]) {
            return;
          }

          checkedAssets[id] = true;
          var cached = bundle.cache[id];
          assetsToAccept.push([bundle, id]);

          if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
            return true;
          }

          return getParents(global.parcelRequire, id).some(function(id) {
            return hmrAcceptCheck(global.parcelRequire, id);
          });
        }

        function hmrAcceptRun(bundle, id) {
          var cached = bundle.cache[id];
          bundle.hotData = {};

          if (cached) {
            cached.hot.data = bundle.hotData;
          }

          if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
            cached.hot._disposeCallbacks.forEach(function(cb) {
              cb(bundle.hotData);
            });
          }

          delete bundle.cache[id];
          bundle(id);
          cached = bundle.cache[id];

          if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
            cached.hot._acceptCallbacks.forEach(function(cb) {
              cb();
            });

            return true;
          }
        }
      },
      {},
    ],
  },
  {},
  ['node_modules/parcel-bundler/src/builtins/hmr-runtime.js', 'sw.js'],
  null,
);
//# sourceMappingURL=/sw.js.map
