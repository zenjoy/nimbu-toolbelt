if (typeof Promise === 'undefined') {
  window.Promise = require('promise/lib/es6-extensions.js');
}

export function loadScript(src, resolve, reject) {
  let js = document.createElement('script');
  js.src = src;
  js.onload = function() {
    resolve();
  };
  js.onerror = function() {
    reject(new Error('Failed to load script ' + src));
  };
  document.head.appendChild(js);
}

export default function loadPolyfills() {

  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
  }

  const fillFetch = () => new Promise((resolve, reject) => {
    if('fetch' in window) {
      return resolve();
    } else {
      loadScript('//cdn.nimbu.io/js/polyfills/fetch-2.0.3.min.js', resolve, reject);
    }
  });

  const fillCoreJs = () => new Promise((resolve, reject) => {
    if(
      'assign' in Object &&
      'from' in Array &&
      'startsWith' in String.prototype &&
      'endsWith' in String.prototype &&
      'includes' in Array.prototype &&
      'keys' in Object
    ) {
      return resolve();
    } else {
      loadScript('//cdn.nimbu.io/js/polyfills/core-2.5.3.min.js', resolve, reject);
    }
  });

  return Promise.all([
    fillFetch(),
    fillCoreJs(),
  ])
}
