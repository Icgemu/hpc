'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var on = require('./events/on');
var cancelAnimationFramePolyfill = require('./animation/cancelAnimationFramePolyfill');
var requestAnimationFramePolyfill = require('./animation/requestAnimationFramePolyfill');

var DOMMouseMoveTracker = function () {
    /**
     * onMove is the callback that will be called on every mouse move.
     * onMoveEnd is called on mouse up when movement has ended.
     */
    function DOMMouseMoveTracker(onMove, onMoveEnd, domNode) {
        _classCallCheck(this, DOMMouseMoveTracker);

        this._isDragging = false;
        this._animationFrameID = null;
        this._domNode = domNode;
        this._onMove = onMove;
        this._onMoveEnd = onMoveEnd;
        this._onMouseMove = this._onMouseMove.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);
        this._didMouseMove = this._didMouseMove.bind(this);
    }

    /**
     * This is to set up the listeners for listening to mouse move
     * and mouse up signaling the movement has ended. Please note that these
     * listeners are added at the document.body level. It takes in an event
     * in order to grab inital state.
     */


    DOMMouseMoveTracker.prototype.captureMouseMoves = function captureMouseMoves(event) {

        if (!this._eventMoveToken && !this._eventUpToken) {
            this._eventMoveToken = on(this._domNode, 'mousemove', this._onMouseMove);
            this._eventUpToken = on(this._domNode, 'mouseup', this._onMouseUp);
        }

        if (!this._isDragging) {
            this._deltaX = 0;
            this._deltaY = 0;
            this._isDragging = true;
            this._x = event.clientX;
            this._y = event.clientY;
        }

        event.preventDefault();
    };

    /**
     * These releases all of the listeners on document.body.
     */


    DOMMouseMoveTracker.prototype.releaseMouseMoves = function releaseMouseMoves() {

        if (this._eventMoveToken && this._eventUpToken) {

            this._eventMoveToken.off();
            this._eventMoveToken = null;
            this._eventUpToken.off();
            this._eventUpToken = null;
        }

        if (this._animationFrameID !== null) {
            cancelAnimationFramePolyfill(this._animationFrameID);
            this._animationFrameID = null;
        }

        if (this._isDragging) {
            this._isDragging = false;
            this._x = null;
            this._y = null;
        }
    };

    /**
     * Returns whether or not if the mouse movement is being tracked.
     */


    DOMMouseMoveTracker.prototype.isDragging = function isDragging() /*boolean*/{
        return this._isDragging;
    };

    /**
     * Calls onMove passed into constructor and updates internal state.
     */


    DOMMouseMoveTracker.prototype._onMouseMove = function _onMouseMove( /*object*/event) {

        var x = event.clientX;
        var y = event.clientY;

        this._deltaX += x - this._x;
        this._deltaY += y - this._y;

        if (this._animationFrameID === null) {
            // The mouse may move faster then the animation frame does.
            // Use `requestAnimationFramePolyfill` to avoid over-updating.
            this._animationFrameID = requestAnimationFramePolyfill(this._didMouseMove);
        }

        this._x = x;
        this._y = y;
        this._moveEvent = event;
        event.preventDefault();
    };

    DOMMouseMoveTracker.prototype._didMouseMove = function _didMouseMove() {
        this._animationFrameID = null;
        this._onMove(this._deltaX, this._deltaY, this._moveEvent);
        this._deltaX = 0;
        this._deltaY = 0;
    };
    /**
     * Calls onMoveEnd passed into constructor and updates internal state.
     */


    DOMMouseMoveTracker.prototype._onMouseUp = function _onMouseUp() {

        if (this._animationFrameID) {
            this._didMouseMove();
        }
        this._onMoveEnd();
    };

    return DOMMouseMoveTracker;
}();

module.exports = DOMMouseMoveTracker;