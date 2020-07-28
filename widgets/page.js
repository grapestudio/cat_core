"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newPage = void 0;

var _typestyle = require("typestyle");

var _csstips = require("csstips");

var _popmotion = require("popmotion");

var _verge = _interopRequireDefault(require("verge"));

var _anujs = require("anujs");

var _core = require("@capacitor/core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var App = _core.Plugins.App;

var screenWidth = _verge.default.viewportW();

var Page = /*#__PURE__*/function (_Component) {
  _inherits(Page, _Component);

  var _super = _createSuper(Page);

  function Page(props) {
    var _this;

    _classCallCheck(this, Page);

    _this = _super.call(this, props);
    _this.dom = (0, _anujs.createRef)();
    _this.startListener = null;
    _this.endListner = null;
    _this.close = null;
    return _this;
  }

  _createClass(Page, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var page = (0, _popmotion.styler)(this.dom.current);
      var pageX = (0, _popmotion.value)(0, function (x) {
        return page.set("x", x);
      });

      this.close = function () {
        (0, _popmotion.tween)({
          from: pageX.get(),
          to: screenWidth
        }).start({
          update: function update(x) {
            return page.set("x", x);
          },
          complete: function complete() {
            return (0, _anujs.unmountComponentAtNode)(_this2.dom.current.parentNode);
          }
        });
      };

      (0, _popmotion.tween)({
        from: screenWidth,
        to: 0,
        duration: 250
      }).start({
        update: function update(x) {
          return page.set("x", x);
        },
        complete: function complete() {
          _this2.startListener = (0, _popmotion.listen)(_this2.dom.current, "mousedown touchstart").start(function (e) {
            // 捕捉鼠标坐标和点击坐标
            var tapX = e.touches ? e.touches[0].pageX : e.pageX;

            if (tapX < 25) {
              // 在边缘位置才滑动页面
              (0, _popmotion.pointer)({
                x: pageX.get()
              }).filter(function (_ref) {
                var x = _ref.x;
                return x > 0;
              }).pipe(function (_ref2) {
                var x = _ref2.x;
                return x;
              }).start(pageX);
            }
          });
          _this2.endListner = (0, _popmotion.listen)(_this2.dom.current, "mouseup touchend").start(function () {
            var criticalLine = screenWidth / 4;

            if (pageX.get() <= criticalLine && pageX.get() > 0) {
              (0, _popmotion.tween)({
                from: pageX.get(),
                to: 0
              }).start(pageX);
            } else if (pageX.get() > criticalLine) {
              _this2.close();
            }
          });
        }
      });
      App.addListener("backButton", this.close);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.startListener.stop();
      this.endListner.stop();
      App.removeAllListeners();
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("c-page", {
        class: (0, _typestyle.style)(_csstips.vertical, (0, _csstips.width)("100%"), (0, _csstips.height)("100%"), {
          position: "fixed",
          top: 0,
          backgroundColor: "white",
          zIndex: 999,
          boxShadow: "-5px 0 10px #b8b8b8"
        }),
        ref: this.dom
      }, this.props.children);
    }
  }]);

  return Page;
}(_anujs.Component);

var newPage = function newPage(children) {
  return (0, _anujs.render)( /*#__PURE__*/React.createElement(Page, null, children), document.getElementById("core"));
};

exports.newPage = newPage;