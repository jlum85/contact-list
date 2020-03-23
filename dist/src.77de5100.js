// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
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

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
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
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
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
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
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
})({"index.ts":[function(require,module,exports) {
"use strict";

run(); // The entire app is in a function just to make sure we don't polute the global namespace

function run() {
  var rootEl = getElementByIdOrThrow("root");

  if (rootEl === null) {
    throw new Error("Missing element");
  } // The list of contacts


  var contacts = [{
    id: "p9n51g",
    name: "Alice",
    email: null,
    phone: "02345678"
  }, {
    id: "8mopn7",
    name: "Bob",
    email: "bob@gmail.com",
    phone: null
  }, {
    id: "u7oo0d",
    name: "Paul",
    email: "paul@gmail.com",
    phone: null
  }]; // Call createApp to initialize the App
  // and get the contactsEl used for updates

  var contactsEl = createApp().contactsEl; // Make sure the App is updated at when stating

  renderApp(); // This function create the HTML structure
  // and add it to the root element in the DOM

  function createApp() {
    var titleEl = createElement("h1", {
      children: "Contacts",
      className: "title"
    });
    var contactsEl = createElement("div", {
      className: "contacts"
    });
    var addFormEl = createAddForm().addFormEl;
    var appEl = createElement("div", {
      className: "app",
      children: [titleEl, contactsEl, addFormEl]
    });
    rootEl.appendChild(appEl);
    return {
      contactsEl: contactsEl
    };
  } // Create the add form structure


  function createAddForm() {
    // on peut caster en HTMLInputElement mais autant mettre any car de toute facon c'ets un cast forcé et il faudrait plutôt revoir createElement
    // const inputNameEl: HTMLInputElement = <HTMLInputElement>(
    //   createElement("input")
    // );
    var inputNameEl = createElement("input");
    inputNameEl.placeholder = "name";
    var inputEmailEl = createElement("input");
    inputEmailEl.placeholder = "email";
    var inputPhoneEl = createElement("input");
    inputPhoneEl.placeholder = "phone";
    var addButtonEl = createElement("button", {
      children: "Add"
    });

    var onAddClick = function onAddClick() {
      if (inputNameEl.value.length === 0) {
        // no name, return to stop the function
        return;
      } // add a contact


      contacts.push({
        id: randomShortId(),
        name: inputNameEl.value,
        email: inputEmailEl.value.length > 0 ? inputEmailEl.value : null,
        phone: inputPhoneEl.value.length > 0 ? inputPhoneEl.value : null
      }); // then update the app

      renderApp(); // and clear the inputs

      inputNameEl.value = "";
      inputEmailEl.value = "";
      inputPhoneEl.value = "";
    };

    addButtonEl.addEventListener("click", onAddClick);
    var addFormEl = createElement("div", {
      className: "add",
      children: [inputNameEl, inputEmailEl, inputPhoneEl, addButtonEl]
    });
    return {
      addFormEl: addFormEl
    };
  } // This function is used to update the App, mainly the list of contacts


  function renderApp() {
    renderContacts();
  } // This function update the list of contacts


  function renderContacts() {
    // clear the content of the container first
    contactsEl.innerHTML = ""; // the create new elements

    var contactItemEls = contacts.map(function (contact) {
      var deleteEl = createElement("button", {
        className: "remove",
        children: "Delete"
      });
      deleteEl.addEventListener("click", function () {
        // remove the contact
        contacts = contacts.filter(function (c) {
          return c.id !== contact.id;
        }); // and update the app

        renderApp();
      });
      return createElement("div", {
        className: "contact",
        children: [createElement("div", {
          className: "infos",
          children: [createElement("h2", {
            children: contact.name
          }), contact.email === null ? null : createElement("p", {
            children: contact.email
          }), contact.phone === null ? null : createElement("p", {
            children: contact.phone
          })]
        }), deleteEl]
      });
    }); // and add them to the container

    contactItemEls.forEach(function (elem) {
      contactsEl.appendChild(elem);
    });
  }
} // ou methode 2
// interface PropsOption {
//   className?: string;
//   children?: string | Array<string | HTMLElement | null>;
// }


function createElement(type, props) {
  if (props === void 0) {
    props = {};
  } // function createElement(type, props = {}) {


  var elem = document.createElement(type);

  if (props.className) {
    elem.className = props.className;
  }

  if (props.children) {
    var childrenArray = Array.isArray(props.children) ? props.children : [props.children];
    childrenArray // pas nécessaire de typer le map mais si on veut le faire alors on a la ligne ci-dessous
    // .map((children: ChildrenItem): Text | null | HTMLElement => {
    .map(function (children) {
      if (typeof children === "string") {
        return document.createTextNode(children);
      }

      return children;
    }).forEach(function (item) {
      if (item) {
        elem.appendChild(item);
      }
    });
  }

  return elem;
}
/**
 * Like document.getElementById but throw an error
 * if the element does not exist
 */


function getElementByIdOrThrow(id) {
  var elem = document.getElementById(id);

  if (!elem) {
    throw new Error("Cannot find element with id \"" + id + "\"");
  }

  return elem;
}

var a = getThrow("2");

function getThrow(id) {
  throw new Error("Cannot find element with id \"" + id + "\"");
}
/**
 * Return a short (5 chars) string ID
 */


function randomShortId() {
  return Math.random().toString(36).substring(7);
}
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "49766" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
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
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
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

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
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
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
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

  return getParents(global.parcelRequire, id).some(function (id) {
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
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.ts"], null)
//# sourceMappingURL=/src.77de5100.js.map