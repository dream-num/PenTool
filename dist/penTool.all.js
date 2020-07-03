(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.Pen = factory());
}(this, (function () { 'use strict';

    var CONST = {
        OBJECT_TYPE: {
            PEN_AUX: "penAux",
            CIRCLE: "circle",
            LINE: "line",
            PATH: "path"
        },
        POINT_TYPE: {
            STRAIGHT: "straight",
            MIRRORED: "mirrored",
            DISJOINTED: "disjointed"
        },
        CONTROL_TYPE: {
            LEFT: "handleA",
            RIGHT: "handleB",
            MAIN: "main"
        },
        PATH_STATE: {
            NEW: "new"
        },
        CURSOR_TYPE: {
            ADD: 'add',
            NORMAL: 'normal',
            MOVE: 'move',
            CLOSE: 'close',
            DEFAULT: 'default'
        }
    };

    /**
     * author Siwei
     * 鼠标手势、鼠标位置
     */
    var cursorConfig = {
        normal: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAABIdJREFUSA3tVWsspFcY/uaW0dgiOqQimQ3iPmkQtyIShlWEbK0uUlGXdkkbTRBtGlIlQmls2B/qkobBH2JIMFHpBE0YGWwRxqWWBl1WMmu2SnXMfDN9zrQz2c5mN4bd/upJTs533vNevue9UnK5/Obk5GTb8fGxB/VfrIGBgZH4+Hh9dXW1cmxsbHR7e/vGq7TLEIvFEq1WK9RoNFqFQvHn7u6uVUpKypK3t3cPdjuDwdC+zB9gEmVWVlbHg4ODzOTk5J8KCgokGxsbzqWlpfe6urruz8/Pf63X621emlGCsKmpaWtiYuKH7OzsJ+vr66kwwENs77W1tSngbrqhoeHB1NSUCPTrVzXMhsv0REloaGje3Nzcj0D0paen5/chISGfwgCXnECc2tjY+N7w8PANqVQ67+bmVu3i4iK/lHGSNAQhEV5YWCiDW9UymayLGMNmG5VubW3dGhkZkWZlZT3u7+9fNdItPU0KiaCfn19NcXFxIpTfnpmZEep0Oo1EIvk5KCjoY0dHRzFYxENDQ8PIZIGlhoz8hqQxXoh7z8/POUggtqur60N3d3cFPOA3Pj4+CLS2hA8njYxmPI3eKH+R04iQQZiVSmVIUVGRd0lJyUB4ePhtQltZWfm8rKys2sPDoxjXChaLRavVavKjHGyLS+ZfCE9PT/knJyfWNjY2poTw9fX9zsvLS3l0dOQKAxSTydShbo0GCcmixTRmKZHi8/kzQPIIKwkuIwio5eXlPGyera3tQ3InCOH2Sxs0uBRGiS4K56/T09OjdXV17+/s7Mz29PQc19bWCtLS0jYDAwO/ITwE4T8uNYaDkC+8DC4FGpIE1kQqLCwsr7y8/C6bzdaiob+RmZkpi4mJeRc/85i8wyANl7IODg7eRl0OtbS0KJaWlj4kbxdZbCcnJ1VzczOfw+Hcn52dlUKoIjg4+AucZD+zuFwuBbTXampqRCqVyprH47HQhZoWFxdZKKvWZwTMCEx0ko/Quirs7Oz+qKqqyq+vr5+Hgm4g5pvxUug4Cfv7++90dnZyfXx8Xj88PGShZCgkFhcyn0GGZy5jfv87eKCCmbW2tnZndXX1g97e3rdQg09iY2PlUPwViv4XxLa5vb092d7e/jW0PnZlZSUF1xr0ZWRkUGgGNMqpPyoqKt3cyNN3U+ARIxoP35IN4VQY/kQkEkX7+/sLYYTC5LBOTExk9vX1UUgmkw60Qgpu1W1ubuppmlabHp7zYUJo/g7EtkA1jPiGCQQC5tnZGaO1tZV4wsCK2FM5OTkUXEpHRkbuC4XCxoCAgLvmeszvzzWIRi1DUw9OSEhgdXd3U3t7eybZ9PR0Cs1Bh4GtKSwsHI+Ojs6Fhx6ZGCz9AIrr+fn556hBvYODg2kje/UYU/q4uDgayB/AYK6luk0xNBP8zdnZWYlafBN0BmqPwliiMD10GMxq1KkkIiLiDlCpzOQuf8VMFCUlJWlQMgZUKH66o6MDibx26/JaXyAJt15D7JbReXS5ubm/4wc6QTN0oxeIXe0JoykOyTOKgRxzNU3/S79CD/wF1bAnj93p/FEAAAAASUVORK5CYII=",
        add: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAABUlJREFUSA29VnkspVcU/96ijxrrvFKVUPveILYiGoxJkUqrOihRW6cyTRpLtYpUiaU0JswfxpImtkSIJbFEZayJJZYpYqfMoMOQZxljGct7+ruv/V4673UmGNOb3Nx3zz3n/L7fueec+6j+/v6POzs7C3d2dvSp/2PU1tY2uru7n6ampvJaWlqaFxYWrr9OXEZNTU3TycmJ6/Hx8cnExMSzpaUlaW9v71EjI6NyzCIGg3FymR/AJM6kpaV36urqmF5eXr9HREQ0zczMqMfGxt4pLS29PzQ09PPp6an8pYEShrm5ufMdHR33goODt6enp30AwMXd3iksLJxAuPnZ2dl/dHd3l0Cu+arAbITslDixs7MLGxwc7AKjHw0MDH6ztbX9BgAcsoKxT05OzmcNDQ3XW1tbh3R0dFK1tLT6LwROkoYwJMbDw8MJCOthb29vKQHDZNNO5+fnP21sbGwNCgraqK6unqTl511FDomhubl5enR0tCec3+jr63MVCATHTU1Ns9bW1rdUVFRqoFJTX1/fgEw2PS8QrS9MGnpDwnt0dCSFBGJra2s/0tPTm0AEzNvb2+vAVoHoYeUjoxn/Zk/bn2WlGTKIMo/Hs42KijKKiYmpdXBwuEFk4+Pj3yckJKTq6+tHY5vEYrH4h4eH5EOlMM9dMs8x3Nvb09jd3ZWVl5cXJYSJicmvhoaGvM3NTW0AUEwmU4C6pQGJ6FyDSWcpsdLQ0OgDk8cYHyFkhAE1NjYWhslVUFB4RPaEIcJ+YUBhSAFKfFFY/+zp6WnOzMwMWFxcHCgvL9/JyMgw9fX1nbOysvqF6BCG/4SUvg4iPvMQhhRsSBLIEit7e/uwxMTE22w2+wQN/WpgYGDvtWvXPsHHbJBzAPIRUtbq6ur7qMv6/Pz8idHR0XBydpbBVlNT28rLy9OQkpK6PzAw0AqjJBsbmx+wkikxOBwOBbZX0tPTS7a2tmS5XC4LXSh3ZGSEhbIqkDAQEzDRSb5E60pSVFTcT0lJ+SorK2sIDsrAWENMl0LH8VhZWfmwuLiYY2xsLLe2tsZCyVBILA5svoMNV9xGfP/35UEKZdbU1NTNycnJLyorK99DDW67ubn1w/FPKPoHuNu8oqIiL2VlZRm0PnZycjKF0Ar9+fv7U2gGfJRTtbOzsx98kYRj4RqeiQOKLh6HfBzeJRPGPgD+uqSkxMXCwsIVIBReDllPT09mVVUVhWQS+UErpBBWwdzc3Cmfzz8kB21tbb37+/tXAawDv8JeTRuIGNICeoWyAlg14H7tTU1NmQcHB4yCggISCaEK7p4KCQmhEFK+k5PTiqura46lpeVtcohX5uH29vZbeOIUAPhccxAxpIHoFT20GU3dxsPDg1VWVkYtLy/TR5Sfnx+F5iDo6uo6joyMbHdxcQmF48cihZf8EJaF+DlYaCLlreCIhWwUgeFJotDmqNnZWYG6uvqDtLS0W2DmAfsnsFGlJ/bCyKF01PEP4h0y0UyEZfcihk/gkIdafJsYo/YoPEsUXg8BHuZD1GmTo6PjTbDaQqK9W1FR0Y9u9CaOpchEXTJJQq2vrz+EvXCYmZnxcM8f/CcgHG3jTbyHLvN5XFwcG+2MwlsoCAgImA0PD0/Efx3yVAmHqqrqFs6fampqHtOyjY0NZXSjN3R1dUVhlpGR2ZeTk+PROhIrwnMFdzeGziMIDQ19ig8ohkwYFgllMQFJGtTzHvQlCEkIaFuw3MXT9G18fHwkGGXjbwXpQq88XghIPKMcWrCQeWnjpYAXRSElg0Qj9ScQ9/FaAJWUlILRKLi4FgnAvwBe6YatAEV1yQAAAABJRU5ErkJggg==",
        close: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAABbRJREFUSA29VnssnWcY/845ONWhtNWgmjFpKUG7IGadRqcdm5IwI5lL0rXjD8kydMXQiJpayxAtSuaeSKWn7NDWiLjXrXOndQtd3OpWzlYO5zvffu+pT/SwLKzbm3znPd/zPs/ze5/3eX7P+1FNTU0u1dXVd5aWlgyp/2Pcv39f6ODgwFy7dm32Ecbz588/+S9xOQKBoFQikdiLxWJJf3//yujo6B43N7fO48ePF+C5w+FwJG9zA1ziTFFRUVRSUsI9f/78b/7+/qXPnj07fPny5aTc3NwnbW1t1xmG2ffWQMmRJiUlDSOP5T4+Pot9fX0eADjQ0tKSlJGR0ePo6EjHx8cP1dfX50Cu96+B1wFH4Ez35s2bI4iqG/9ViWPM/O7u7uC7d+82u7u7v7py5cpURUVF6eDgoPWugVlA4qCzszPU2dlZ3NDQkA8wJTwKrOPh4WHX0tLSSl9f37mioqJ+Vr7TWeYQhSGzMzMzux4cHPzZyMiIO+hiJ5VK18rKygbMzc0DdHV1BVASCIXCXxChGTbDhZ10p4CyomGN4IBZXV1VROXyDAwMJo8ePdpbXFxsXltbKwCA+rqeBDpkh4qs3U5mWYRwJgtxdnbWMjAw0DgoKKj41KlTnxNHvb29wWFhYbHHjh0LwmsEl8uVApBslNiK8exokGNhWIvl5eUjIpFIRU1NrZWVGRsb/2xiYjIzNzf3HpFtAtxVhG8cKfLUDLJPvnjx4lNELXPY09PzVUdHh6a6uvo4AeTxePTa2hoPf3cFyB4p8UUh2nFU6MO4uDgvdJzW/Pz8xdjYWBNQYsjKyupHoqOgoEAAd51DWYQkh3hUiEMbG5uL4eHh8XC8hoZ+wMvL67GdnZ0rNjNL1jGkaIO86elpS1KxaWlpvTiBr18v/fOvgra29vytW7eOKCkptTU3N1fBJBLRhGEmz5bB5/MprKvExMTkIK8qmpqavLq6up8Ayj1x4kTaFgM5ARfGfugwkRoaGq+io6Mv4Thb0cbyEPG7croUeqzjxMSEY3Z2thJyrTYzM8OrrKykTE1N+aDOd7A5JG8j//6a8ZBCmYc+eunp06e+hYWF5uDgy7NnzzajQqMQxTBym5qZmemM4lE2MjJSiIqKonDLyPx5eHhQY2NjNCglwPF/IQ+y+X0DcLMQbcwNV1XAvXv33scxcfbv30/l5OS84+TkxEVbowYGBjbU0QopPT09prGxkQZ/C9vb2/2xwUhlZWU9bGgJuY7DRoZYg20BySIiVkNUwtTU1A/BRe7KygonPT2dyGW2Wlpa1IULF6iqqioaTWISl3gSwICl+Q26Ex8XOYXToFxdXWmAP8bGPmJBt53RqBvs7e0liYmJjIWFBQNHG09AQACDSqZdXFzEAHyITWgjrz/cvn2bNjQ0FBcUFLSDv01Ye2JraztP9OGvaVsgIoQDXVzEYnBwA4QAWlpaMmQDiIZOSUkZRs4vrutzUDwifX19enx8vBH2ZutyncXFxQeohWmkRJqcnGwtIz5ZlBsiHR2dWXQVLcjRzbiUt7c3UZHiFlkNDQ19gJ1fAjfniRBcvIjqVUEkPbALh7yLyDFPAPzLGzduVOAuPeTn53f1jdZGlMiA4iJ29Sv4xYSEhFAAoMAzKagwGBER4XP69Gk3Fozog5uHwEnq5MmTq3htJzJ2QG8BuRSheIie+raARNna2jrA09OzD5XKdHV1/QEaFKBILECTItYZO6PzTKKBUPj+4UP2ASsnMyLcRxrEwYMHKei93Ly25T8+L86hfT3ChXtuy6KcoKamRoQ7lMbRtgJE9gmC+fDCwoLwzJkzM+AwjRxayZnt/jUrK+tqXl4eqdJVzB04lZby8vI29OYF5I7BV2E98f63PNwNNKEGrrhvwcM9uG0oVVVVCtSRoE/Xgo8fv3VA4jAhIUEZRfL93r17j9A0/efU1FQsOtDvbAB/ATu47sdIopyeAAAAAElFTkSuQmCC",
        move: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAstJREFUSA3Nld9rklEYx+cMBX/QTaIIKjkYbqibiOAfINJNNxt6E8KIjIVEUBRBRHTRv2Ajhxde7c4LyboJvIguYhqDyS4G2RxqTRvOWkaSp+/zsgOv+r7h/BEdODzvec7zfT7vec9zzjvDGHN1Op3gzL9qAF7LZrOHjUbjGZ5np84FJOL3+38GAoGjg4ODlxhfmioUgDWfz9cGhBmNxl/5fP49fP6pQZH8utfr/UFA6kqlkiUSid1Wq3VvKlAAb3g8nlMO5DYcDpdrtdoW5vUTBSPhzaWlpe8cJLZ2u/10b2/vLWKcE4Mi2S2n0/lNDBI/q9Vqlk6nP7Tb7bWJQAGMLS4utsQQqedYLLZfr9dfIF49FhgJbjscjhMpSL/P7XYfl0qlN9BcHhkK8Z35+flmf3K5sV6v/53L5ejoXB0JCuHdubm5YzkA9ysUCmYwGJjL5WLBYJAVi8UvuBLvnxd6AYLZbrdLZ7CnRaPRLs5nU6PRnOh0OupNQA9RRPtWq3XXZrN9hOATF+HFtXi+gv4acXTMpBsCH0DcwKxw8Mmur6934/H4c2nFoBc5LpbL5e2VlRVGlsaDUWceTD60WCx1DAVgJBJhGxsbW7KCvgkOW1hYEPRk/wqF4JHZbD4iIL3h5ubmq76cskOCVavVbdxUjM4r5SBLY/LT/IAYzscmk+kzFUIymXw3ECDj4DBYoVUqFQFIljdJKCaf4N78mkqldpBbIZO/xw2NsGfLy8s8N5MC0koHPi8UTzOZzE4oFFL2ZJUZIF5LSWivVCqVACJYoVAQVkiWxtTp84r2lKoYH50xI/rQf3rErtJek3TYTvGkI965G4TCCnH/jrbCcxMhAFTYQ9oj3obew1GApCHoWRUKTCmgZJWOChRDaaVUQPQeZKl6Jw7jL0orpaqlPSWgqCoHDz0XjWs5dKi7dFwY1wOqRV8ly33/hf0D+qqSk3G9oaMAAAAASUVORK5CYII="
    };

    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

    function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

    function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    var PenObject = function PenObject() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, PenObject);

        /**
         * Identify the object as an auxiliary point or line of the path
         * Since js does not support static attributes,
         * this attribute will be used as read-only. Please do not modify during use
         */
        // static penType: string = CONST.OBJECT_TYPE.PEN_AUX;
        this.penType = CONST.OBJECT_TYPE.PEN_AUX;
        /**
         * property of the Canvas 2D API specifies the color, gradient, or pattern
         * to use for the strokes (outlines) around shapes.
         */
        this.stroke = '#ff56b1';
        /**
         * property of the Canvas 2D API specifies the color, gradient, or pattern
         * to use inside shapes.
         */
        this.fill = '#006cff';
        /**
         * property of the Canvas 2D API sets the thickness of lines.
         */
        this.lineWidth = 1;
        this.penType = CONST.OBJECT_TYPE.PEN_AUX;
        this.stroke = options.stroke || '#ff56b1';
        this.fill = options.fill || '#006cff';
        this.lineWidth = options.lineWidth || 1;
    };
    /**
     * aux Circle of penTool
     */


    var PenCircle = function (_PenObject) {
        _inherits(PenCircle, _PenObject);

        function PenCircle() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            _classCallCheck(this, PenCircle);

            /**
             * Radius of Circle
             */
            var _this = _possibleConstructorReturn(this, (PenCircle.__proto__ || Object.getPrototypeOf(PenCircle)).call(this, options));

            _this.radius = 3;
            /**
             * property of the Canvas 2D API specifies the color, gradient, or pattern
             * to use for the strokes (outlines) around shapes.
             */
            _this.stroke = '#006cff';
            /**
             * property of the Canvas 2D API specifies the color, gradient, or pattern
             * to use inside shapes.
             */
            _this.fill = '#fff';
            _this.x = options.x;
            _this.y = options.y;
            _this.radius = options.radius || 3;
            _this.keyPointIndex = options.keyPointIndex;
            _this.handleName = options.handleName;
            _this.fill = options.fill || '#fff';
            _this.stroke = options.stroke || '#006cff';
            _this.type = CONST.OBJECT_TYPE.CIRCLE;
            return _this;
        }

        return PenCircle;
    }(PenObject);
    /**
     * aux Line of penTool
     */


    var PenLine = function (_PenObject2) {
        _inherits(PenLine, _PenObject2);

        function PenLine() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            _classCallCheck(this, PenLine);

            var _this2 = _possibleConstructorReturn(this, (PenLine.__proto__ || Object.getPrototypeOf(PenLine)).call(this, options));

            _this2.x1 = options.x1;
            _this2.y1 = options.y1;
            _this2.x2 = options.x2;
            _this2.y2 = options.y2;
            _this2.type = CONST.OBJECT_TYPE.LINE;
            return _this2;
        }

        return PenLine;
    }(PenObject);
    /**
     * declare path keyPoint Class
     */


    var KeyPoint = function KeyPoint() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            type = _ref.type,
            point = _ref.point,
            pointType = _ref.pointType,
            relationPoints = _ref.relationPoints,
            keyPointIndex = _ref.keyPointIndex,
            controller1 = _ref.controller1,
            controller2 = _ref.controller2,
            auxLine1 = _ref.auxLine1,
            auxLine2 = _ref.auxLine2,
            handleName = _ref.handleName;

        _classCallCheck(this, KeyPoint);

        /**
         * Indicate the relationship between current keyPoint and previous keyPoint
         * 'straight' means drawing a Line from previous to current
         * 'mirrored' means drawing a curve. Cause there will be 2 handlers which are mirror symmetry centered on current keyPoint and in a straight line
         * 'disjointed' means the curve's handlers are not in a straight line
         * @default 'straight'
         */
        this.pointType = CONST.POINT_TYPE.STRAIGHT;
        this.type = type;
        this.point = point;
        this.pointType = pointType || CONST.POINT_TYPE.STRAIGHT;
        this.relationPoints = relationPoints || [];
        this.keyPointIndex = keyPointIndex;
        this.controller1 = controller1;
        this.controller2 = controller2;
        this.auxLine1 = auxLine1;
        this.auxLine2 = auxLine2;
        this.handleName = handleName;
    };
    /**
     * declare Pen Tool Class
     */


    var Pen = function () {
        function Pen(canvasId, options) {
            _classCallCheck(this, Pen);

            /**
             * Whether the penTool's edit mode is opened. Default false.
             */
            this.penModeOn = false;
            /**
             * Store final path keyPoints data.
             */
            this.keyPointData = [];
            /**
             * Store the real path keyPoints data, cause it's different from keyPointData when mousemove.
             */
            this.keyPointDataCache = [];
            /**
             * Whether the path is closed
             */
            this.closeState = false;
            /**
             * Whether the real-path is closed.
             * Fill the path containing area when cursor position and path start-point coincide during mousemoving (but not mouseup).
             */
            this.cacheCloseState = false;
            /**
             * Whether the mousedown event is triggered
             */
            this.penMouseDown = false;
            /**
             * Custom setting options
             */
            this.options = {
                circle: new PenCircle(),
                line: new PenLine(),
                pathColor: '#000',
                pathFillColor: '#ebebeb',
                isFillPath: false
            };
            /**
             * Collection of objects drawn on canvas
             */
            this.objects = [];
            /**
             * Whether edit the keyPoint position
             */
            this.isEdit = false;
            try {
                if (!canvasId) {
                    console.error("PenTool must based a canvas, please confirm that the canvasId is passed.");
                } else {
                    this.canvas = document.getElementById(canvasId);
                    this.canvasCtx = this.canvas.getContext('2d');
                    this.options = Object.assign({
                        circle: new PenCircle(),
                        line: new PenLine(),
                        pathColor: '#000',
                        pathFillColor: '#ebebeb' // default pathFillColor
                    }, options);
                    // fire mouse event
                    this._mouseDown();
                    this._mouseMove();
                    this._mouseUp();
                    this._keydown();
                    this._mouseDblclick();
                }
            } catch (error) {
                console.error(error.message);
            }
        }
        /**
         * Open drawing mode
         */


        _createClass(Pen, [{
            key: 'enablePen',
            value: function enablePen() {
                this.penModeOn = true;
                this.setCursor(CONST.CURSOR_TYPE.NORMAL);
            }
            /**
             * Exist drawing mode
             * The first call sets currentKeyPointIndex to null and set keyPoint editable
             * The second call removes auxPoints and auxLines
             */

        }, {
            key: 'existPenMode',
            value: function existPenMode() {
                if (this.currentKeyPointIndex != null) {
                    this.currentKeyPointIndex = null;
                    this.isEdit = true; // set editable
                    this.setCursor(CONST.CURSOR_TYPE.NORMAL);
                    this.refreshEditPath();
                } else {
                    this.penModeOn = false;
                    if (this.pathRealObject) {
                        // remove auxPoint and auxLine
                        var auxPointAndLines = this.objects.filter(function (object) {
                            return object.penType === CONST.OBJECT_TYPE.PEN_AUX;
                        });
                        this.removeObjects.apply(this, _toConsumableArray(auxPointAndLines));
                    }
                    this.setCursor(CONST.CURSOR_TYPE.DEFAULT);
                    // reset params
                    this.currentKeyPointIndex = null;
                    this.isEdit = false;
                }
                this.refreshRender();
            }
            /**
             * Set cursor style
             * @param type cursor type
             */

        }, {
            key: 'setCursor',
            value: function setCursor(type) {
                if (type === CONST.CURSOR_TYPE.DEFAULT) {
                    this.canvas.style.cursor = 'default';
                } else {
                    this.canvas.style.cursor = 'url(' + cursorConfig[type] + '), default';
                }
            }
            /**
             * fire mousedown event
             */

        }, {
            key: '_mouseDown',
            value: function _mouseDown() {
                var _this3 = this;

                this.canvas.addEventListener("mousedown", function (event) {
                    if (_this3.penModeOn) {
                        _this3._penMouseDown(event);
                    }
                });
            }
            /**
             * fire mouseMove event
             */

        }, {
            key: '_mouseMove',
            value: function _mouseMove() {
                var _this4 = this;

                this.canvas.addEventListener("mousemove", function (event) {
                    if (_this4.penModeOn) {
                        if (_this4.penMouseDown) {
                            _this4.setCursor(CONST.CURSOR_TYPE.MOVE);
                        }
                        _this4._penMouseMove(event);
                    }
                });
            }
            /**
             * fire mouseup event
             */

        }, {
            key: '_mouseUp',
            value: function _mouseUp() {
                var _this5 = this;

                this.canvas.addEventListener("mouseup", function (event) {
                    if (_this5.penModeOn) {
                        _this5.setCursor(CONST.CURSOR_TYPE.NORMAL);
                        _this5._penMouseUp(event);
                    }
                });
            }
            /**
             * fire path double click event
             */

        }, {
            key: '_mouseDblclick',
            value: function _mouseDblclick() {
                var _this6 = this;

                this.canvas.addEventListener("dblclick", function (event) {
                    if (_this6.penModeOn) {
                        var target = _this6._getMouseOverTarget(event);
                        if (target && target.penType === CONST.OBJECT_TYPE.PEN_AUX && target.handleName == null) {
                            _this6.changeKeyPointType(target);
                            _this6.refreshRender();
                        }
                    } else {
                        var point = {
                            x: event.offsetX,
                            y: event.offsetY
                        },
                            path = new Path2D(_this6.realPathStr),
                            isInPath = _this6.canvasCtx.isPointInPath(path, point.x, point.y);
                        if (isInPath) {
                            _this6.setCursor(CONST.CURSOR_TYPE.NORMAL);
                            _this6.generateEditablePath();
                        }
                    }
                });
            }
            /**
             * fire keydown event
             * Support to press ESC to exit drawing mode
             */

        }, {
            key: '_keydown',
            value: function _keydown() {
                var _this7 = this;

                // Set the tabIndex value of canvas so that canvas can get focus. Only in this way can canvas respond to keyboard events
                this.canvas.setAttribute("tabIndex", "0");
                this.canvas.addEventListener("keydown", function (event) {
                    if (_this7.penModeOn) {
                        if (event.keyCode === 27) {
                            _this7.existPenMode();
                        }
                    }
                });
            }
            /**
             * Implementation of MouseDown
             * @param event
             */

        }, {
            key: '_penMouseDown',
            value: function _penMouseDown(event) {
                var target = this._getMouseOverTarget(event),
                    x = event.offsetX,
                    y = event.offsetY,
                    index = void 0;
                this.penMouseDown = true;
                this.mousedownTarget = target;
                this.keyPointDataCache = null;
                this.penMouseMoveFix = { x: x, y: y };
                // update aux point fill color
                this._matchObjectsByProrerty("penType", CONST.OBJECT_TYPE.PEN_AUX, function (object) {
                    object.fill = "#fff";
                });
                // checks if the target is aux point
                if (target !== null && target.penType === CONST.OBJECT_TYPE.PEN_AUX) {
                    index = target.keyPointIndex;
                    // fill the aux point 
                    target.fill = target.stroke;
                    /**
                     * When the first and the last keyPoint coincide, the path is closed.
                     * Path is closed, set keyPoints editable.
                     */
                    if (this.keyPointData.length > 1 && this.currentKeyPointIndex === this.keyPointData.length - 1 && index === 0) {
                        this.closeState = true;
                    }
                    if (this.closeState || index !== this.keyPointData.length - 1) {
                        this.isEdit = true;
                    }
                    this.currentKeyPointIndex = index;
                    this.setMousedownOrigin();
                    this.refreshEditPath();
                    return;
                }
                /**
                 * Normally, add keyPoint
                 */
                if (this.keyPointData.length === 0 || this.currentKeyPointIndex === this.keyPointData.length - 1 && !this.closeState) {
                    var keyPoint = void 0;
                    // first keyPoint, set type 'M'
                    if (this.keyPointData.length === 0) {
                        keyPoint = new KeyPoint({
                            type: 'M',
                            point: { x: x, y: y },
                            pointType: CONST.POINT_TYPE.STRAIGHT,
                            relationPoints: [x, y],
                            keyPointIndex: this.keyPointData.length
                        });
                    } else {
                        var preKeyPoint = this.keyPointData[this.keyPointData.length - 1],
                            preLeft = preKeyPoint.point.x,
                            preTop = preKeyPoint.point.y;
                        if (preKeyPoint.pointType !== CONST.POINT_TYPE.STRAIGHT) {
                            preLeft = preKeyPoint.controller2.x;
                            preTop = preKeyPoint.controller2.y;
                        }
                        keyPoint = new KeyPoint({
                            type: 'C',
                            point: { x: x, y: y },
                            pointType: CONST.POINT_TYPE.STRAIGHT,
                            relationPoints: [preLeft, preTop, x, y, x, y],
                            keyPointIndex: this.keyPointData.length
                        });
                    }
                    var circle = new PenCircle({
                        x: x,
                        y: y,
                        keyPointIndex: keyPoint.keyPointIndex,
                        fill: this.options.circle.fill,
                        stroke: this.options.circle.stroke
                    });
                    this.addCanvasObjects(circle);
                    this.keyPointData.push(keyPoint);
                    this.currentKeyPointIndex = this.keyPointData.length - 1;
                    this.refreshEditPath();
                    // add new keyPoint, set state
                    this.keyPointState = CONST.PATH_STATE.NEW;
                }
                // clickoutside or 'ESC' keypress to exit penmode when editmode
                else if (this.currentKeyPointIndex == null) {
                        this.existPenMode();
                    }
                    // first time: clickoutside or 'ESC' keypress set edit mode and reset currentKeyPointIndex
                    else if (this.keyPointData.length > 0 && (this.closeState || this.currentKeyPointIndex !== this.keyPointData.length - 1)) {
                            this.currentKeyPointIndex = null;
                            this.isEdit = true;
                        }
                this.refreshRender();
            }
            /**
             * Implementation of MouseMove
             * @param event
             */

        }, {
            key: '_penMouseMove',
            value: function _penMouseMove(event) {
                var x = event.offsetX,
                    y = event.offsetY,
                    target = this._getMouseOverTarget(event);
                if (!this.isEdit) {
                    // keep mousedown and mousemoving will draw a curve on canvas when current keyPoint is new
                    if (this.keyPointState === CONST.PATH_STATE.NEW) {
                        if (Math.abs(this.penMouseMoveFix.x - x) > 2 || Math.abs(this.penMouseMoveFix.y - y) > 2) {
                            this.changeKeyPointPos(x, y, CONST.CONTROL_TYPE.RIGHT);
                        }
                    } else {
                        /**
                         * when target is keyPoint
                         * 1. target is not start or
                         * 2. the path is closed or
                         * 3. target is start but currentkeyPointIndex is not the last keyPoint's index(otherwise the path is closed).
                         */
                        if (target != null && target.penType === CONST.OBJECT_TYPE.PEN_AUX && (target.keyPointIndex !== 0 || this.closeState || target.keyPointIndex === 0 && this.currentKeyPointIndex !== this.keyPointData.length - 1)) {
                            if (!this.penMouseDown) {
                                this.setCursor(CONST.CURSOR_TYPE.MOVE);
                            }
                        } else {
                            this.setCursor(CONST.CURSOR_TYPE.NORMAL);
                            if (this.currentKeyPointIndex === this.keyPointData.length - 1 && !this.closeState) {
                                var keyPoint = void 0,
                                    prev = this.keyPointData[this.currentKeyPointIndex],
                                    prevLeft = void 0,
                                    prevTop = void 0;
                                if (this.keyPointDataCache == null) {
                                    this.keyPointDataCache = JSON.parse(JSON.stringify(this.keyPointData));
                                    this.keyPointDataCache.push(new KeyPoint());
                                } else {
                                    this.cacheCloseState = false;
                                }
                                if (this.keyPointData[this.currentKeyPointIndex].type === "M") {
                                    prevLeft = prev.relationPoints[0];
                                    prevTop = prev.relationPoints[1];
                                } else {
                                    prevLeft = prev.relationPoints[4];
                                    prevTop = prev.relationPoints[5];
                                }
                                if (prev.pointType !== CONST.POINT_TYPE.STRAIGHT) {
                                    prevLeft = prev.controller2.x;
                                    prevTop = prev.controller2.y;
                                }
                                keyPoint = new KeyPoint({
                                    type: "C",
                                    point: { x: x, y: y },
                                    pointType: CONST.POINT_TYPE.STRAIGHT,
                                    relationPoints: [prevLeft, prevTop, x, y, x, y],
                                    keyPointIndex: this.keyPointDataCache.length - 1
                                });
                                this.keyPointDataCache[this.keyPointDataCache.length - 1] = keyPoint;
                                // path closed
                                if (this.keyPointData.length > 1 && target !== null && target.penType === CONST.OBJECT_TYPE.PEN_AUX && target.keyPointIndex === 0) {
                                    this.cacheCloseState = true;
                                    this.setCursor(CONST.CURSOR_TYPE.CLOSE);
                                } else {
                                    this.setCursor(CONST.CURSOR_TYPE.ADD);
                                }
                                this.refreshEditPath(true);
                            }
                        }
                    }
                }
                /**
                 * keyPoint moving
                 * alt + handler keypoint moving: change path curve
                 */
                else if (this.mousedownTarget != null && this.mousedownTarget.penType === CONST.OBJECT_TYPE.PEN_AUX && this.penMouseDown) {
                        var _target = this.mousedownTarget;
                        _target.x = x;
                        _target.y = y;
                        if (_target.handleName === CONST.CONTROL_TYPE.LEFT) {
                            if (event.altKey) {
                                this.changeKeyPointType(_target, CONST.POINT_TYPE.DISJOINTED);
                            } else {
                                this.changeKeyPointType(_target);
                            }
                            this.changeKeyPointPos(x, y, CONST.CONTROL_TYPE.LEFT);
                        } else if (_target.handleName === CONST.CONTROL_TYPE.RIGHT) {
                            if (event.altKey) {
                                this.changeKeyPointType(_target, CONST.POINT_TYPE.DISJOINTED);
                            } else {
                                this.changeKeyPointType(_target);
                            }
                            this.changeKeyPointPos(x, y, CONST.CONTROL_TYPE.RIGHT);
                        } else {
                            this.changeKeyPointPos(x, y, CONST.CONTROL_TYPE.MAIN);
                        }
                    }
                this.refreshRender();
            }
            /**
             * Implementation of MouseUp
             * @param event
             */

        }, {
            key: '_penMouseUp',
            value: function _penMouseUp(event) {
                var _this8 = this;

                this.penMouseDown = false;
                if (this.currentKeyPointIndex === this.keyPointData.length - 1 && !this.closeState && this.penMouseMoveFix && event.offsetX === this.penMouseMoveFix.x && event.offsetY === this.penMouseMoveFix.y) {
                    this.isEdit = false;
                }
                // set main keyPoint fill
                this._matchObjectsByProrerty("penType", CONST.OBJECT_TYPE.PEN_AUX, function (object) {
                    if (object.keyPointIndex === _this8.currentKeyPointIndex && object.handleName == null) {
                        object.fill = object.stroke;
                    }
                });
                /** reset params */
                this.keyPointState = null;
                this.penMouseMoveFix = null;
                this.penMouseDownOrigin = null;
                this.refreshRender();
            }
            /**
             * update keyPoint or handle point position
             * @param x mouseOffsetX relative to canvas
             * @param y mouseOffsetY relative to canvas
             * @param type control point type
             */

        }, {
            key: 'changeKeyPointPos',
            value: function changeKeyPointPos(x, y) {
                var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : CONST.CONTROL_TYPE.MAIN;

                var index = this.currentKeyPointIndex,
                    curKeyPoint = this.keyPointData[index],
                    originPoint = curKeyPoint.point;
                if ((type === CONST.CONTROL_TYPE.LEFT || type === CONST.CONTROL_TYPE.RIGHT) && curKeyPoint.pointType == CONST.POINT_TYPE.STRAIGHT) {
                    this.createPathCurveAux(curKeyPoint);
                }
                // keyPoint
                if (type === CONST.CONTROL_TYPE.MAIN) {
                    var x1 = void 0,
                        x2 = void 0,
                        y1 = void 0,
                        y2 = void 0,
                        minulsX = void 0,
                        minulsY = void 0;
                    if (this.penMouseDownOrigin) {
                        if (this.penMouseDownOrigin.x) {
                            minulsX = this.penMouseDownOrigin.x - x;
                            minulsY = this.penMouseDownOrigin.y - y;
                        }
                        if (this.penMouseDownOrigin.x1) {
                            x1 = this.penMouseDownOrigin.x1 - minulsX;
                            y1 = this.penMouseDownOrigin.y1 - minulsY;
                        }
                        if (this.penMouseDownOrigin.x2) {
                            x2 = this.penMouseDownOrigin.x2 - minulsX;
                            y2 = this.penMouseDownOrigin.y2 - minulsY;
                        }
                        this.updatePenPathControll(curKeyPoint, { x: x, y: y, x1: x1, y1: y1, x2: x2, y2: y2 });
                    }
                    originPoint.x = x;
                    originPoint.y = y;
                    if (curKeyPoint.type === "M") {
                        curKeyPoint.relationPoints[0] = x;
                        curKeyPoint.relationPoints[1] = y;
                        if (index + 1 <= this.keyPointData.length - 1) {
                            var _nextItem = this.keyPointData[index + 1];
                            if (curKeyPoint.pointType != CONST.POINT_TYPE.STRAIGHT) {
                                _nextItem.relationPoints[0] = x2;
                                _nextItem.relationPoints[1] = y2;
                            } else {
                                _nextItem.relationPoints[0] = x;
                                _nextItem.relationPoints[1] = y;
                            }
                        }
                        if (curKeyPoint.pointType != CONST.POINT_TYPE.STRAIGHT) {
                            curKeyPoint.relationPoints[2] = x1;
                            curKeyPoint.relationPoints[3] = y1;
                        }
                        curKeyPoint.point = { x: x, y: y };
                    } else {
                        if (curKeyPoint.pointType != CONST.POINT_TYPE.STRAIGHT) {
                            curKeyPoint.relationPoints[2] = x1;
                            curKeyPoint.relationPoints[3] = y1;
                        } else {
                            curKeyPoint.relationPoints[2] = x;
                            curKeyPoint.relationPoints[3] = y;
                        }
                        curKeyPoint.relationPoints[4] = x;
                        curKeyPoint.relationPoints[5] = y;
                        if (index + 1 <= this.keyPointData.length - 1) {
                            var _nextItem2 = this.keyPointData[index + 1];
                            if (curKeyPoint.pointType != CONST.POINT_TYPE.STRAIGHT) {
                                _nextItem2.relationPoints[0] = x2;
                                _nextItem2.relationPoints[1] = y2;
                            } else {
                                _nextItem2.relationPoints[0] = x;
                                _nextItem2.relationPoints[1] = y;
                            }
                        }
                        curKeyPoint.point = { x: x, y: y };
                    }
                }
                // handle aux keyPoint
                else if (type === CONST.CONTROL_TYPE.LEFT || type === CONST.CONTROL_TYPE.RIGHT) {
                        if (curKeyPoint.pointType == CONST.POINT_TYPE.STRAIGHT) {
                            curKeyPoint.pointType = CONST.POINT_TYPE.MIRRORED;
                        }
                        var _x6 = void 0,
                            _y = void 0,
                            _x7 = void 0,
                            _y2 = void 0;
                        var originX = curKeyPoint.relationPoints[4],
                            originY = curKeyPoint.relationPoints[5];
                        if (curKeyPoint.type == "M") {
                            originX = curKeyPoint.relationPoints[0];
                            originY = curKeyPoint.relationPoints[1];
                        }
                        if (curKeyPoint.pointType == CONST.POINT_TYPE.MIRRORED) {
                            if (type === CONST.CONTROL_TYPE.RIGHT) {
                                _x6 = originX * 2 - x;
                                _y = originY * 2 - y;
                                _x7 = x;
                                _y2 = y;
                            } else {
                                _x7 = originX * 2 - x;
                                _y2 = originY * 2 - y;
                                _x6 = x;
                                _y = y;
                            }
                            this.updatePenPathControll(curKeyPoint, { x: originX, y: originY, x1: _x6, y1: _y, x2: _x7, y2: _y2 });
                            if (curKeyPoint.type === "M") {
                                if (index + 1 <= this.keyPointData.length - 1) {
                                    var _nextItem3 = this.keyPointData[index + 1];
                                    _nextItem3.relationPoints[0] = _x7;
                                    _nextItem3.relationPoints[1] = _y2;
                                }
                                if (curKeyPoint.pointType != CONST.POINT_TYPE.STRAIGHT) {
                                    curKeyPoint.relationPoints[2] = _x6;
                                    curKeyPoint.relationPoints[3] = _y;
                                }
                            } else {
                                curKeyPoint.relationPoints[2] = _x6;
                                curKeyPoint.relationPoints[3] = _y;
                                if (index + 1 <= this.keyPointData.length - 1) {
                                    var nextItem = this.keyPointData[index + 1];
                                    nextItem.relationPoints[0] = _x7;
                                    nextItem.relationPoints[1] = _y2;
                                }
                            }
                        } else if (curKeyPoint.pointType == CONST.POINT_TYPE.DISJOINTED) {
                            if (type === CONST.CONTROL_TYPE.RIGHT) {
                                _x7 = x;
                                _y2 = y;
                                this.updatePenPathControll(curKeyPoint, { x: originX, y: originY, x2: _x7, y2: _y2 }, CONST.CONTROL_TYPE.RIGHT);
                                if (curKeyPoint.type === "M") {
                                    if (index + 1 <= this.keyPointData.length - 1) {
                                        var _nextItem4 = this.keyPointData[index + 1];
                                        _nextItem4.relationPoints[0] = _x7;
                                        _nextItem4.relationPoints[1] = _y2;
                                    }
                                } else {
                                    if (index + 1 <= this.keyPointData.length - 1) {
                                        var _nextItem5 = this.keyPointData[index + 1];
                                        _nextItem5.relationPoints[0] = _x7;
                                        _nextItem5.relationPoints[1] = _y2;
                                    }
                                }
                            } else {
                                _x6 = x;
                                _y = y;
                                this.updatePenPathControll(curKeyPoint, { x: originX, y: originY, x1: _x6, y1: _y }, CONST.CONTROL_TYPE.LEFT);
                                if (curKeyPoint.type === "M") {
                                    if (curKeyPoint.pointType != "straight") {
                                        curKeyPoint.relationPoints[2] = _x6;
                                        curKeyPoint.relationPoints[3] = _y;
                                    }
                                } else {
                                    curKeyPoint.relationPoints[2] = _x6;
                                    curKeyPoint.relationPoints[3] = _y;
                                }
                            }
                        }
                    }
                this.refreshEditPath();
            }
            /**
             * creating aux control handlers for curve
             * @param curKeyPoint the current operating keyPoint
             */

        }, {
            key: 'createPathCurveAux',
            value: function createPathCurveAux(curKeyPoint) {
                var originPoint = curKeyPoint.point,
                    x = originPoint.x,
                    y = originPoint.y;
                var circle1 = new PenCircle({
                    x: x,
                    y: y,
                    handleName: CONST.CONTROL_TYPE.LEFT,
                    keyPointIndex: curKeyPoint.keyPointIndex,
                    fill: this.options.circle.fill,
                    stroke: this.options.circle.stroke,
                    lineWidth: this.options.circle.lineWidth
                }),
                    circle2 = new PenCircle({
                    x: x,
                    y: y,
                    handleName: CONST.CONTROL_TYPE.RIGHT,
                    keyPointIndex: curKeyPoint.keyPointIndex,
                    fill: this.options.circle.fill,
                    stroke: this.options.circle.stroke,
                    lineWidth: this.options.circle.lineWidth
                }),
                    line1 = new PenLine({
                    x1: x, y1: y, x2: x, y2: y,
                    stroke: this.options.line.stroke,
                    lineWidth: this.options.line.lineWidth
                }),
                    line2 = new PenLine({
                    x1: x, y1: y, x2: x, y2: y,
                    stroke: this.options.line.stroke,
                    lineWidth: this.options.line.lineWidth
                });
                curKeyPoint.controller1 = circle1;
                curKeyPoint.controller2 = circle2;
                curKeyPoint.auxLine1 = line1;
                curKeyPoint.auxLine2 = line2;
                this.addCanvasObjects(circle1, circle2, line1, line2);
            }
            /**
             * update the handlers of the curve
             * @param item operating keyPoint
             * @param position the key coordinates. {x, y, x1, y1, x2, y2}
             * (x, y) is the main keyPoint's coordinates. (x1, y1) and (x2, y2) is the two controllers' coordinates.
             * @param type Indicates which auxLine and controller to update
             */

        }, {
            key: 'updatePenPathControll',
            value: function updatePenPathControll(item, position, type) {
                var x = position.x,
                    y = position.y,
                    x1 = position.x1,
                    y1 = position.y1,
                    x2 = position.x2,
                    y2 = position.y2,
                    _Object$assign = Object.assign({}, item),
                    controller1 = _Object$assign.controller1,
                    controller2 = _Object$assign.controller2,
                    auxLine1 = _Object$assign.auxLine1,
                    auxLine2 = _Object$assign.auxLine2;
                if (type == null || type === CONST.CONTROL_TYPE.LEFT) {
                    if (controller1 != null) {
                        controller1.x = x1;
                        controller1.y = y1;
                    }
                    if (auxLine1 != null) {
                        auxLine1.x1 = x1;
                        auxLine1.y1 = y1;
                        auxLine1.x2 = x;
                        auxLine1.y2 = y;
                    }
                }
                if (type == null || type === CONST.CONTROL_TYPE.RIGHT) {
                    if (controller2 != null) {
                        controller2.x = x2;
                        controller2.y = y2;
                    }
                    if (auxLine2 != null) {
                        auxLine2.x1 = x2;
                        auxLine2.y1 = y2;
                        auxLine2.x2 = x;
                        auxLine2.y2 = y;
                    }
                }
            }
            /**
             * save the coordinate informations when mousedown
             * (x, y) is the main keyPoint's coordinate
             * (x1, y1) and (x2, y2) is the controllers' coordinate
             */

        }, {
            key: 'setMousedownOrigin',
            value: function setMousedownOrigin() {
                var curKeyPoint = this.keyPointData[this.currentKeyPointIndex],
                    controller1 = curKeyPoint.controller1,
                    controller2 = curKeyPoint.controller2,
                    originPoint = curKeyPoint.point,
                    origin = {};
                if (controller1 != null) {
                    origin.x1 = controller1.x;
                    origin.y1 = controller1.y;
                }
                if (controller1 != null) {
                    origin.x2 = controller2.x;
                    origin.y2 = controller2.y;
                }
                if (originPoint != null) {
                    origin.x = originPoint.x;
                    origin.y = originPoint.y;
                }
                this.penMouseDownOrigin = origin;
            }
        }, {
            key: 'refreshEditPath',

            /**
             * update the pathObject when path is modified
             * @param isCashed whether update path with the keyPointDataCache
             */
            value: function refreshEditPath() {
                var isCashed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

                var keyPointData = this.keyPointData,
                    closeState = this.closeState;
                if (keyPointData.length === 0) return;
                if (isCashed) {
                    keyPointData = this.keyPointDataCache;
                    closeState = this.cacheCloseState;
                }
                var pathStr = this._generatePathStr(keyPointData),
                    fillColor = null,
                    realPathStr = pathStr;
                if (closeState) {
                    fillColor = this.options.pathFillColor;
                    realPathStr += ' Z';
                }
                if (this.realPathStr != null && this.realPathStr === pathStr && isCashed) {
                    return;
                } else {
                    this.realPathStr = realPathStr;
                    // remove and redraw path
                    var pathObjects = this.objects.filter(function (object) {
                        return object.type === CONST.OBJECT_TYPE.PATH;
                    });
                    this.removeObjects.apply(this, _toConsumableArray(pathObjects));
                    this.pathRealObject = {
                        pathStr: this.realPathStr,
                        type: CONST.OBJECT_TYPE.PATH,
                        fill: fillColor || '#ebebeb',
                        closeState: closeState,
                        index: -Infinity // path's z-index keep lowest
                    };
                    this.addCanvasObjects(this.pathRealObject);
                }
            }
            /**
             * generate the pathStr according to keyPointData
             * @param keyPointData
             */

        }, {
            key: '_generatePathStr',
            value: function _generatePathStr(keyPointData) {
                var pathStr = "";
                keyPointData.forEach(function (keyPoint) {
                    var pathSection = "";
                    if (keyPoint.type === "M") {
                        var str = 'M ' + keyPoint.relationPoints[0] + ' ' + keyPoint.relationPoints[1] + ' ';
                        pathSection += str;
                    } else if (keyPoint.type === "C") {
                        pathSection += "C ";
                        keyPoint.relationPoints.forEach(function (value) {
                            pathSection += value + " ";
                        });
                    }
                    pathStr += pathSection;
                });
                if (this.closeState) {
                    var firstKeyPoint = keyPointData[0],
                        lastkeyPoint = keyPointData[keyPointData.length - 1];
                    pathStr += "C ";
                    if (lastkeyPoint.pointType !== CONST.POINT_TYPE.STRAIGHT) {
                        pathStr += lastkeyPoint.controller2.x + ' ' + lastkeyPoint.controller2.y + ' ';
                    } else {
                        pathStr += lastkeyPoint.relationPoints[4] + ' ' + lastkeyPoint.relationPoints[5] + ' ';
                    }
                    if (firstKeyPoint.pointType !== CONST.POINT_TYPE.STRAIGHT) {
                        pathStr += firstKeyPoint.relationPoints[2] + ' ' + firstKeyPoint.relationPoints[3] + ' ';
                    } else {
                        pathStr += firstKeyPoint.relationPoints[0] + ' ' + firstKeyPoint.relationPoints[1] + ' ';
                    }
                    pathStr += firstKeyPoint.relationPoints[0] + ' ' + firstKeyPoint.relationPoints[1] + ' ';
                }
                return pathStr;
            }
            /**
             * refresh and redraw the canvas
             */

        }, {
            key: 'refreshRender',
            value: function refreshRender() {
                var _this9 = this;

                this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this._matchObjectsByProrerty("penType", CONST.OBJECT_TYPE.PEN_AUX, function (object) {
                    if (object.type === CONST.OBJECT_TYPE.CIRCLE) {
                        _this9._bringToFront(object);
                    }
                });
                this.drawObjects(this.objects || []);
            }
            /**
             * drawing object on canvas
             * @param objects objects to be drawing
             */

        }, {
            key: 'drawObjects',
            value: function drawObjects(objects) {
                var _this10 = this;

                objects.forEach(function (object) {
                    switch (object.type) {
                        case CONST.OBJECT_TYPE.CIRCLE:
                            _this10.drawCircle(object);
                            break;
                        case CONST.OBJECT_TYPE.LINE:
                            _this10.drawLine(object);
                            break;
                        case CONST.OBJECT_TYPE.PATH:
                            _this10.drawPath(object);
                            break;
                    }
                });
            }
            /**
             * draw circle on canvas
             * @param options config of circle
             */

        }, {
            key: 'drawCircle',
            value: function drawCircle(options) {
                this.canvasCtx.fillStyle = options.fill;
                this.canvasCtx.strokeStyle = options.stroke;
                this.canvasCtx.beginPath();
                this.canvasCtx.arc(options.x, options.y, options.radius, 0, 2 * Math.PI);
                this.canvasCtx.fill();
                this.canvasCtx.stroke();
            }
            /**
             * draw path on canvas
             * @param options config of circle
             */

        }, {
            key: 'drawPath',
            value: function drawPath(options) {
                this.canvasCtx.fillStyle = this.options.pathFillColor;
                this.canvasCtx.strokeStyle = this.options.pathColor;
                this.canvasCtx.beginPath();
                var path = new Path2D(this.realPathStr);
                this.canvasCtx.stroke(path);
                if (options.closeState) {
                    /**
                     * keyPointDataCache is null indicate that the drawing is completed.
                     */
                    if (!this.keyPointDataCache && this.options.isFillPath) {
                        this.canvasCtx.fill(path);
                    }
                    /**
                     * when drawing uncomplete, the cache path closed, then fill
                     */
                    else if (this.keyPointDataCache && this.keyPointData.length !== this.keyPointDataCache.length) {
                            this.canvasCtx.fill(path);
                        }
                }
            }
            /**
             * draw straight line on canvas
             * @param options config of circle
             */

        }, {
            key: 'drawLine',
            value: function drawLine(options) {
                this.canvasCtx.fillStyle = options.fill;
                this.canvasCtx.strokeStyle = options.stroke;
                // this.canvasCtx.lineWidth = 5;
                this.canvasCtx.beginPath();
                this.canvasCtx.moveTo(options.x1, options.y1);
                this.canvasCtx.lineTo(options.x2, options.y2);
                this.canvasCtx.stroke();
            }
            /**
             * Add objects to Pen instance for rendering
             * @param objects objects for rendering
             * @returns returns adding objects
             */

        }, {
            key: 'addCanvasObjects',
            value: function addCanvasObjects() {
                var _this11 = this;

                for (var _len = arguments.length, objects = Array(_len), _key = 0; _key < _len; _key++) {
                    objects[_key] = arguments[_key];
                }

                objects.forEach(function (object) {
                    if (object.index == null) {
                        object.index = _this11.objects.length;
                    }
                    _this11.objects.push(object);
                });
                return objects;
            }
            /**
             * remove objects from Pen instance
             * @param objects objects to remove
             */

        }, {
            key: 'removeObjects',
            value: function removeObjects() {
                var _this12 = this;

                for (var _len2 = arguments.length, objects = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    objects[_key2] = arguments[_key2];
                }

                objects.forEach(function (object) {
                    _this12.removeSingleObject(object);
                });
            }
            /**
             * match currect object and remove it from instance
             * @param object object to remove
             */

        }, {
            key: 'removeSingleObject',
            value: function removeSingleObject(object) {
                for (var i = this.objects.length - 1; i >= 0; i--) {
                    var item = this.objects[i];
                    if (item === object) {
                        this.objects.splice(i, 1);
                        break;
                    }
                }
            }
            /**
             * Get the mouseover target
             * @param event
             */

        }, {
            key: '_getMouseOverTarget',
            value: function _getMouseOverTarget(event) {
                var point = {
                    x: event.offsetX,
                    y: event.offsetY
                },
                    target = null;
                // sort objects by index
                this.objects.sort(function (a, b) {
                    return a - b;
                });
                for (var i = this.objects.length - 1; i >= 0; i--) {
                    var object = this.objects[i];
                    if (this._containsPoint(point, object)) {
                        target = object;
                        break;
                    }
                }
                return target;
            }
            /**
             * Checks if point is inside the object
             * @param point target point, always mouse position
             * @param object target object
             */

        }, {
            key: '_containsPoint',
            value: function _containsPoint(point, object) {
                if (!object.type) return false;
                if (object.type === CONST.OBJECT_TYPE.CIRCLE) {
                    var radius = object.radius,
                        x = object.x,
                        y = object.y;
                    return point.x <= x + radius && point.x >= x - radius && point.y <= y + radius && point.y >= y - radius;
                } else if (object.type === CONST.OBJECT_TYPE.LINE) {
                    // calculate the slope of line
                    var slope = (object.y1 - object.y2) / (object.x1 - object.x2),
                        slope2 = (point.y - object.y1) / (point.x - object.x1);
                    // slope is equal and the point coordinate is included in the line area indicate collinearity
                    return slope === slope2 && (point.x >= object.x1 && point.x <= object.x2 && point.y >= object.y1 && point.y <= object.y2 || point.x >= object.x2 && point.x <= object.x1 && point.y >= object.y2 && point.y <= object.y1);
                } else if (object.type === CONST.OBJECT_TYPE.PATH) {
                    var path = new Path2D(object.pathStr);
                    return this.canvasCtx.isPointInStroke(path, point.x, point.y);
                }
                return false;
            }
            /**
             * Matches the object with the specified property name and value, and then performs the callback
             * @param key property name
             * @param value property value
             * @param callback callback function
             */

        }, {
            key: '_matchObjectsByProrerty',
            value: function _matchObjectsByProrerty(key, value, callback) {
                var objects = this.objects;
                objects.forEach(function (object) {
                    // match object
                    if (object[key] === value) {
                        callback(object);
                    }
                });
            }
            /**
             * Put the object at the end of the array to make canvas draw last
             * so as to achieve the purpose of the object at the top after drawing
             * @param object
             */

        }, {
            key: '_bringToFront',
            value: function _bringToFront(object) {
                object.index = Infinity; // Make sure the index is the largest
                // resort objects and set index
                this.objects.sort(function (a, b) {
                    return a.index - b.index;
                });
                this.objects.forEach(function (item, index) {
                    item.index = index;
                });
            }
            /**
             * change the keyPoint type when dblclick on the keyPoint
             * when keyPoint is the straight line keyPoint, it will be a curve keyPoint after dblclick
             * when keyPoint is the curve keyPoint, it will be a straight line keyPoint after dblclick
             * @param target
             * @param pointType the pointType attribute of current operating keyPoint
             */

        }, {
            key: 'changeKeyPointType',
            value: function changeKeyPointType(target, pointType) {
                var index = target.keyPointIndex,
                    curPoint = this.keyPointData[index],
                    typelist = Object.assign({}, CONST.POINT_TYPE);
                if (!(pointType == null || curPoint.pointType === CONST.POINT_TYPE.STRAIGHT && pointType in typelist || pointType === CONST.POINT_TYPE.STRAIGHT && curPoint.pointType in typelist)) {
                    curPoint.pointType = pointType;
                    return;
                }
                if (curPoint.controller1 == null) {
                    this.createPathCurveAux(curPoint);
                    curPoint.pointType = pointType || CONST.POINT_TYPE.MIRRORED;
                    var preItem = void 0,
                        // previous keyPoint to target
                    nextItem = void 0,
                        // next keyPoint to target
                    preX = void 0,
                        // previous keyPoint's coordinate
                    preY = void 0,
                        // previous keyPoint's coordinate
                    nextX = void 0,
                        // next keyPoint's coordinate
                    nextY = void 0,
                        // next keyPoint's coordinate
                    x = void 0,
                        // current keyPoint's coordinate
                    y = void 0,
                        // current keyPoint's coordinate
                    radian = void 0,
                        // the radian corresponding to the inclination angle of the line between two points
                    hypotenuse = void 0,
                        // the hypotenuse of a right triangle made up of two points
                    x1 = void 0,
                        x2 = void 0,
                        y1 = void 0,
                        y2 = void 0;
                    if (target.keyPointIndex === 0) {
                        preItem = this.keyPointData[this.keyPointData.length - 1];
                    } else {
                        preItem = this.keyPointData[target.keyPointIndex - 1];
                    }
                    if (target.keyPointIndex === this.keyPointData.length - 1) {
                        nextItem = this.keyPointData[0];
                    } else {
                        nextItem = this.keyPointData[target.keyPointIndex + 1];
                    }
                    preX = preItem.point.x, preY = preItem.point.y, nextX = nextItem.point.x, nextY = nextItem.point.y, x = curPoint.point.x, y = curPoint.point.y;
                    radian = Math.atan2(nextY - preY, nextX - preX),
                    // The half of the hypotenuse of the right triangle formed by the coordinates of the previous and next keyPoint is used as the base of the offset when calculating the coordinates of the control point
                    hypotenuse = Math.sqrt(Math.pow(nextX - preX, 2) + Math.pow(nextY - preY, 2)) / 2;
                    x1 = Math.round(x - hypotenuse * Math.cos(radian)), y1 = Math.round(y - hypotenuse * Math.sin(radian)), x2 = Math.round(x + hypotenuse * Math.cos(radian)), y2 = Math.round(y + hypotenuse * Math.sin(radian));
                    this.updatePenPathControll(curPoint, { x: x, y: y, x1: x1, y1: y1, x2: x2, y2: y2 });
                    if (index + 1 <= this.keyPointData.length - 1) {
                        var _nextItem6 = this.keyPointData[index + 1];
                        _nextItem6.relationPoints[0] = x2;
                        _nextItem6.relationPoints[1] = y2;
                    }
                    curPoint.relationPoints[2] = x1;
                    curPoint.relationPoints[3] = y1;
                } else {
                    this.removeObjects(curPoint.controller1, curPoint.controller2, curPoint.auxLine1, curPoint.auxLine2);
                    delete curPoint.controller1, delete curPoint.controller2, delete curPoint.auxLine1, delete curPoint.auxLine2;
                    curPoint.pointType = CONST.POINT_TYPE.STRAIGHT;
                    var _x9 = curPoint.point.x,
                        _y3 = curPoint.point.y;
                    if (curPoint.pointType === "M") {
                        if (curPoint.relationPoints.length > 2) {
                            curPoint.relationPoints.splice(-2, 2);
                        }
                    } else {
                        curPoint.relationPoints[2] = _x9;
                        curPoint.relationPoints[3] = _y3;
                    }
                    if (index + 1 <= this.keyPointData.length - 1) {
                        var _nextItem7 = this.keyPointData[index + 1];
                        _nextItem7.relationPoints[0] = _x9;
                        _nextItem7.relationPoints[1] = _y3;
                    }
                }
                this.refreshEditPath();
            }
            /**
             * generate the path with keyPoints and handlers
             */

        }, {
            key: 'generateEditablePath',
            value: function generateEditablePath() {
                this.penModeOn = true;
                // reset objects
                this.objects = [];
                // generate keyPoints and aux
                this.generateAuxPointLine(this.keyPointData);
                // generate pathstr
                this.refreshEditPath();
                this.refreshRender();
            }
            /**
             * generate the aux keyPoints and handlers to render
             * @param keyPointData collection of path's keyPoints
             */

        }, {
            key: 'generateAuxPointLine',
            value: function generateAuxPointLine() {
                var _this13 = this;

                var keyPointData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

                if (keyPointData.length === 0) return;
                keyPointData.forEach(function (keyPoint, index) {
                    var x = keyPoint.point.x,
                        y = keyPoint.point.y,
                        circle = new PenCircle({
                        x: x,
                        y: y,
                        keyPointIndex: keyPoint.keyPointIndex,
                        fill: _this13.options.circle.fill,
                        stroke: _this13.options.circle.stroke
                    });
                    _this13.addCanvasObjects(circle); // add keyPoint
                    // when curve, add handlers 
                    if (keyPoint.pointType !== CONST.POINT_TYPE.STRAIGHT) {
                        _this13.addCanvasObjects(keyPoint.auxLine1, keyPoint.auxLine2, keyPoint.controller1, keyPoint.controller2);
                    }
                });
            }
        }]);

        return Pen;
    }();

    return Pen;

})));
//# sourceMappingURL=penTool.all.js.map
