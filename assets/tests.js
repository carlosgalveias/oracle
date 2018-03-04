'use strict';

define('oracle/tests/app.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | app');

  QUnit.test('app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/application.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/application.js should pass ESLint\n\n7:3 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)\n12:3 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)\n13:3 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)\n14:3 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)\n15:3 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)\n21:5 - Unexpected console statement. (no-console)\n28:29 - \'R\' is not defined. (no-undef)\n32:23 - \'R\' is not defined. (no-undef)\n36:14 - \'k\' is already defined. (no-redeclare)\n38:13 - \'matjson\' is already defined. (no-redeclare)\n39:41 - \'R\' is not defined. (no-undef)\n54:24 - \'R\' is not defined. (no-undef)\n56:11 - \'out_struct\' is already defined. (no-redeclare)\n56:24 - \'R\' is not defined. (no-undef)\n63:17 - \'R\' is not defined. (no-undef)\n66:12 - Unexpected constant condition. (no-constant-condition)\n82:19 - \'R\' is not defined. (no-undef)\n84:13 - \'ix\' is already defined. (no-redeclare)\n84:18 - \'R\' is not defined. (no-undef)\n86:13 - \'ix\' is already defined. (no-redeclare)\n86:18 - \'R\' is not defined. (no-undef)\n95:3 - Call this._super(...arguments) in init hook (ember/require-super-in-init)\n96:5 - \'$\' is not defined. (no-undef)\n104:9 - \'text\' is already defined. (no-redeclare)\n105:9 - \'index\' is assigned a value but never used. (no-unused-vars)\n110:24 - Unnecessary escape character: \\.. (no-useless-escape)\n110:29 - Unnecessary escape character: \\?. (no-useless-escape)\n110:31 - Unnecessary escape character: \\(. (no-useless-escape)\n110:33 - Unnecessary escape character: \\). (no-useless-escape)\n115:7 - Use import { later } from \'@ember/runloop\'; instead of using Ember.run.later (ember/new-module-imports)\n115:7 - \'Ember\' is not defined. (no-undef)\n121:5 - Use import { later } from \'@ember/runloop\'; instead of using Ember.run.later (ember/new-module-imports)\n121:5 - \'Ember\' is not defined. (no-undef)');
  });

  QUnit.test('resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass ESLint\n\n');
  });

  QUnit.test('router.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass ESLint\n\n');
  });
});
define('oracle/tests/helpers/destroy-app', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = destroyApp;
  function destroyApp(application) {
    Ember.run(application, 'destroy');
  }
});
define('oracle/tests/helpers/module-for-acceptance', ['exports', 'qunit', 'oracle/tests/helpers/start-app', 'oracle/tests/helpers/destroy-app'], function (exports, _qunit, _startApp, _destroyApp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (name) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    (0, _qunit.module)(name, {
      beforeEach: function beforeEach() {
        this.application = (0, _startApp.default)();

        if (options.beforeEach) {
          return options.beforeEach.apply(this, arguments);
        }
      },
      afterEach: function afterEach() {
        var _this = this;

        var afterEach = options.afterEach && options.afterEach.apply(this, arguments);
        return Ember.RSVP.resolve(afterEach).then(function () {
          return (0, _destroyApp.default)(_this.application);
        });
      }
    });
  };
});
define('oracle/tests/helpers/start-app', ['exports', 'oracle/app', 'oracle/config/environment'], function (exports, _app, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = startApp;
  function startApp(attrs) {
    var attributes = Ember.merge({}, _environment.default.APP);
    attributes.autoboot = true;
    attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

    return Ember.run(function () {
      var application = _app.default.create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
      return application;
    });
  }
});
define('oracle/tests/test-helper', ['oracle/app', 'oracle/config/environment', '@ember/test-helpers', 'ember-qunit'], function (_app, _environment, _testHelpers, _emberQunit) {
  'use strict';

  (0, _testHelpers.setApplication)(_app.default.create(_environment.default.APP));

  (0, _emberQunit.start)();
});
define('oracle/tests/tests.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | tests');

  QUnit.test('helpers/destroy-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/destroy-app.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/module-for-acceptance.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/module-for-acceptance.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/start-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/start-app.js should pass ESLint\n\n');
  });

  QUnit.test('test-helper.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/application-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/application-test.js should pass ESLint\n\n');
  });
});
define('oracle/tests/unit/controllers/application-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:application', 'Unit | Controller | application', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
require('oracle/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map