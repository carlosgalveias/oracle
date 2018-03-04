"use strict";



define('oracle/app', ['exports', 'oracle/resolver', 'ember-load-initializers', 'oracle/config/environment'], function (exports, _resolver, _emberLoadInitializers, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var App = Ember.Application.extend({
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix,
    Resolver: _resolver.default
  });

  (0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);

  exports.default = App;
});
define('oracle/components/welcome-page', ['exports', 'ember-welcome-page/components/welcome-page'], function (exports, _welcomePage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _welcomePage.default;
    }
  });
});
define('oracle/controllers/application', ['exports', 'oracle/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    waiting: true,
    answer: null,
    //var R = require('./r.js');
    model: {},
    hiddenSizes: null,
    generator: null,
    phraseSize: 100,
    solver: null,
    wordToIndex: [],
    indexToWord: [],
    vocab: [],
    pplList: [],
    tickIter: 0,
    maxWords: 100,
    message: '',
    sample: '.',
    sampleSoftmaxTemperature: 0.80,
    loadModel: function loadModel(j) {
      console.log(j);
      this.hiddenSizes = j.hiddenSizes;
      this.generator = j.generator;
      this.phraseSize = j.phraseSize;
      for (var k in j.model) {
        if (j.model.hasOwnProperty(k)) {
          var matjson = j.model[k];
          this.model[k] = new R.Mat(1, 1);
          this.model[k].fromJSON(matjson);
        }
      }
      this.solver = new R.Solver(); // have to reinit the solver since model changed
      this.solver.decay_rate = j.solver.decay_rate;
      this.solver.smooth_eps = j.solver.smooth_eps;
      this.solver.step_cache = {};
      for (var k in j.solver.step_cache) {
        if (j.solver.step_cache.hasOwnProperty(k)) {
          var matjson = j.solver.step_cache[k];
          this.solver.step_cache[k] = new R.Mat(1, 1);
          this.solver.step_cache[k].fromJSON(matjson);
        }
      }
      this.wordToIndex = j['wordToIndex'];
      this.indexToWord = j['indexToWord'];
      this.vocab = j['vocab'];
      // reinit these
      this.pplList = [];
      this.tickIter = 0;
    },
    forwardIndex: function forwardIndex(G, model, ix, prev) {
      var x = G.rowPluck(model['Wil'], ix);
      // forward prop the sequence learner
      if (this.generator === 'rnn') {
        var out_struct = R.forwardRNN(G, model, this.hiddenSizes, x, prev);
      } else {
        var out_struct = R.forwardLSTM(G, model, this.hiddenSizes, x, prev);
      }
      return out_struct;
    },
    predictSentence: function predictSentence(model, samplei, temperature) {
      if (typeof samplei === 'undefined') {
        samplei = false;
      }
      if (typeof temperature === 'undefined') {
        temperature = 1.0;
      }
      var G = new R.Graph(false);
      var s = [];
      var prev = {};
      while (true) {
        // RNN tick
        var ix = s.length === 0 ? 0 : this.wordToIndex[s[s.length - 1]];
        var lh = this.forwardIndex(G, model, ix, prev);
        prev = lh;
        // sample predicted letter
        var logprobs = lh.o;
        if (temperature !== 1.0 && samplei) {
          // scale log probabilities by temperature and renormalize
          // if temperature is high, logprobs will go towards zero
          // and the softmax outputs will be more diffuse. if temperature is
          // very low, the softmax outputs will be more peaky
          for (var q = 0, nq = logprobs.w.length; q < nq; q++) {
            logprobs.w[q] /= temperature;
          }
        }
        var probs = R.softmax(logprobs);
        if (samplei) {
          var ix = R.samplei(probs.w);
        } else {
          var ix = R.maxi(probs.w);
        }
        if (ix === 0) break; // END token predicted, break out
        if (s.length > this.maxWords) {
          break;
        } // something is wrong
        var word = this.indexToWord[ix];
        s.push(word);
      }
      return s;
    },
    init: function init() {
      var _this = this;

      $.getJSON(_environment.default.rootURL + "assets/data/en.json", function (data) {
        _this.loadModel(data);
      });
    },
    getPrediction: function getPrediction(text) {
      var _this2 = this;

      var pred = this.predictSentence(this.model, this.sample, this.sampleSoftmaxTemperature);
      this.set('waiting', false);
      var text = '';
      var index = 0;
      var time = 500;

      var _loop = function _loop() {
        var word = pred[n];
        var t = text;

        if (word.match(/[\.,:;\?\(\)]/)) {
          t += word;
        } else {
          _this2.set('sample', word);
          t += ' ' + word;
        }
        Ember.run.later(function () {
          _this2.set('message', t);
        }, time);
        time += 200;
        text = t;
      };

      for (var n = 0; n < pred.length; n++) {
        _loop();
      }
      Ember.run.later(function () {
        _this2.set('message', null);
        _this2.set('waiting', true);
        _this2.set('');
      }, 20000);
    },
    actions: {
      ask: function ask() {
        this.getPrediction(true);
      }
    }

  });
});
define('oracle/helpers/app-version', ['exports', 'oracle/config/environment', 'ember-cli-app-version/utils/regexp'], function (exports, _environment, _regexp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.appVersion = appVersion;
  var version = _environment.default.APP.version;
  function appVersion(_) {
    var hash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (hash.hideSha) {
      return version.match(_regexp.versionRegExp)[0];
    }

    if (hash.hideVersion) {
      return version.match(_regexp.shaRegExp)[0];
    }

    return version;
  }

  exports.default = Ember.Helper.helper(appVersion);
});
define('oracle/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _pluralize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _pluralize.default;
});
define('oracle/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _singularize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _singularize.default;
});
define('oracle/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'oracle/config/environment'], function (exports, _initializerFactory, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var name = void 0,
      version = void 0;
  if (_environment.default.APP) {
    name = _environment.default.APP.name;
    version = _environment.default.APP.version;
  }

  exports.default = {
    name: 'App Version',
    initialize: (0, _initializerFactory.default)(name, version)
  };
});
define('oracle/initializers/container-debug-adapter', ['exports', 'ember-resolver/resolvers/classic/container-debug-adapter'], function (exports, _containerDebugAdapter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _containerDebugAdapter.default);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('oracle/initializers/data-adapter', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'data-adapter',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('oracle/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data'], function (exports, _setupContainer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ember-data',
    initialize: _setupContainer.default
  };
});
define('oracle/initializers/export-application-global', ['exports', 'oracle/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_environment.default.exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _environment.default.exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember.String.classify(_environment.default.modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports.default = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('oracle/initializers/injectStore', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'injectStore',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('oracle/initializers/store', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'store',
    after: 'ember-data',
    initialize: function initialize() {}
  };
});
define('oracle/initializers/transforms', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'transforms',
    before: 'store',
    initialize: function initialize() {}
  };
});
define("oracle/instance-initializers/ember-data", ["exports", "ember-data/initialize-store-service"], function (exports, _initializeStoreService) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: "ember-data",
    initialize: _initializeStoreService.default
  };
});
define('oracle/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberResolver.default;
});
define('oracle/router', ['exports', 'oracle/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var Router = Ember.Router.extend({
    location: _environment.default.locationType,
    rootURL: _environment.default.rootURL
  });

  Router.map(function () {});

  exports.default = Router;
});
define('oracle/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _ajax) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _ajax.default;
    }
  });
});
define("oracle/templates/application", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "jl51z88t", "block": "{\"symbols\":[],\"statements\":[[0,\"  \"],[6,\"div\"],[9,\"class\",\"oracle-answer\"],[7],[0,\"\\n    \"],[6,\"h1\"],[9,\"class\",\"h1-oracle-answer\"],[7],[1,[18,\"message\"],false],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[4,\"if\",[[20,[\"waiting\"]]],null,{\"statements\":[[0,\"  \"],[6,\"div\"],[9,\"class\",\"oracle\"],[7],[0,\"\\n    \"],[6,\"h1\"],[9,\"class\",\"h1-oracle\"],[7],[0,\"The Oracle\"],[8],[0,\"\\n    \"],[6,\"button\"],[9,\"class\",\"oracle-input info\"],[9,\"name\",\"oracle\"],[3,\"action\",[[19,0,[]],\"ask\"]],[7],[0,\"Click\"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"  \"],[6,\"div\"],[7],[0,\"\\n \"],[6,\"div\"],[9,\"class\",\"homepage-hero-module\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"video-container\"],[7],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"filter\"],[7],[8],[0,\"\\n      \"],[6,\"video\"],[9,\"autoplay\",\"\"],[9,\"loop\",\"\"],[9,\"class\",\"fillWidth\"],[9,\"width\",\"100%\"],[7],[0,\"\\n        \"],[6,\"source\"],[10,\"src\",[26,[[18,\"rootURL\"],\"assets/video/bg.mp4\"]]],[9,\"type\",\"video/mp4\"],[7],[8],[0,\"Your browser does not support the video tag. I suggest you upgrade your browser.\\n        \"],[6,\"source\"],[10,\"src\",[26,[[18,\"rootURL\"],\"assets/video/bg.webm\"]]],[9,\"type\",\"video/webm\"],[7],[8],[0,\"Your browser does not support the video tag. I suggest you upgrade your browser.\\n      \"],[8],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\" \\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "oracle/templates/application.hbs" } });
});


define('oracle/config/environment', [], function() {
  var prefix = 'oracle';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

if (!runningTests) {
  require("oracle/app")["default"].create({"name":"oracle","version":"0.0.0+cb431948"});
}
//# sourceMappingURL=oracle.map
