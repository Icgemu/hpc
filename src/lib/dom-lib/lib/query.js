'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var ReactDOM = require('react-dom');

var _require = require('./style');

var getStyle = _require.getStyle;


function ownerDocument(componentOrElement) {
    var node = ReactDOM.findDOMNode(componentOrElement);
    return node && node.ownerDocument || document;
}

function ownerWindow(componentOrElement) {
    var doc = ownerDocument(componentOrElement);
    return doc && doc.defaultView || doc.parentWindow;
}

function getWindow(node) {
    return node === node.window ? node : node.nodeType === 9 ? node.defaultView || node.parentWindow : false;
}

function getContainer(container, defaultContainer) {
    container = typeof container === 'function' ? container() : container;
    return ReactDOM.findDOMNode(container) || defaultContainer;
}

var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

var contains = function () {
    var root = canUseDOM && document.documentElement;

    return root && root.contains ? function (context, node) {
        return context.contains(node);
    } : root && root.compareDocumentPosition ? function (context, node) {
        return context === node || !!(context.compareDocumentPosition(node) & 16);
    } : function (context, node) {
        if (node) {
            do {
                if (node === context) {
                    return true;
                }
            } while (node = node.parentNode);
        }
        return false;
    };
}();

function nodeName(node) {
    return node.nodeName && node.nodeName.toLowerCase();
}

function scrollTop(node, val) {
    var win = getWindow(node);
    var top = win ? 'pageYOffset' in win ? win.pageYOffset : win.document.documentElement.scrollTop : node.scrollTop;
    var left = win ? 'pageXOffset' in win ? win.pageXOffset : win.document.documentElement.scrollLeft : 0;

    if (val === undefined) {
        return top;
    }

    win ? win.scrollTo(left, val) : node.scrollTop = val;
}

function scrollLeft(node, val) {

    var win = getWindow(node);
    var left = win ? 'pageXOffset' in win ? win.pageXOffset : win.document.documentElement.scrollLeft : node.scrollLeft;
    var top = win ? 'pageYOffset' in win ? win.pageYOffset : win.document.documentElement.scrollTop : 0;

    if (val === undefined) {
        return left;
    }

    win ? win.scrollTo(val, top) : node.scrollLeft = val;
}

function getOffset(node) {
    var doc = ownerDocument(node);
    var win = getWindow(doc);
    var docElem = doc && doc.documentElement;
    var box = {
        top: 0,
        left: 0,
        height: 0,
        width: 0
    };

    if (!doc) {
        return;
    }

    // Make sure it's not a disconnected DOM node
    if (!contains(docElem, node)) {
        return box;
    }

    if (node.getBoundingClientRect !== undefined) {
        box = node.getBoundingClientRect();
    }

    if (box.width || box.height) {

        box = {
            top: box.top + (win.pageYOffset || docElem.scrollTop) - (docElem.clientTop || 0),
            left: box.left + (win.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0),
            width: (box.width === null ? node.offsetWidth : box.width) || 0,
            height: (box.height === null ? node.offsetHeight : box.height) || 0
        };
    }

    return box;
}

function getOffsetParent(node) {
    var doc = ownerDocument(node),
        offsetParent = node && node.offsetParent;

    while (offsetParent && nodeName(node) !== 'html' && getStyle(offsetParent, 'position') === 'static') {
        offsetParent = offsetParent.offsetParent;
    }

    return offsetParent || doc.documentElement;
}

function getPosition(node, _offsetParent) {
    var _parentOffset = {
        top: 0,
        left: 0
    },
        _offset;

    // Fixed elements are offset from window (_parentOffset = {top:0, left: 0},
    // because it is its only offset parent
    if (getStyle(node, 'position') === 'fixed') {
        _offset = node.getBoundingClientRect();
    } else {

        _offsetParent = _offsetParent || getOffsetParent(node);
        _offset = getOffset(node);

        if (nodeName(_offsetParent) !== 'html') {
            _parentOffset = getOffset(_offsetParent);
        }

        _parentOffset.top += parseInt(getStyle(_offsetParent, 'borderTopWidth'), 10) - scrollTop(_offsetParent) || 0;
        _parentOffset.left += parseInt(getStyle(_offsetParent, 'borderLeftWidth'), 10) - scrollLeft(_offsetParent) || 0;
    }

    // Subtract parent offsets and node margins
    return _extends({}, _offset, {
        top: _offset.top - _parentOffset.top - (parseInt(getStyle(node, 'marginTop'), 10) || 0),
        left: _offset.left - _parentOffset.left - (parseInt(getStyle(node, 'marginLeft'), 10) || 0)
    });
}

function isOverflowing(container) {
    var win = getWindow(container);
    var isBody = container && container.tagName.toLowerCase() === 'body';

    function bodyIsOverflowing(node) {
        var doc = ownerDocument(node);
        var win = getWindow(doc);
        var fullWidth = win.innerWidth;

        // Support: ie8, no innerWidth
        if (!fullWidth) {
            var documentElementRect = doc.documentElement.getBoundingClientRect();
            fullWidth = documentElementRect.right - Math.abs(documentElementRect.left);
        }
        return doc.body.clientWidth < fullWidth;
    }

    return win || isBody ? bodyIsOverflowing(container) : container.scrollHeight > container.clientHeight;
}

function activeElement() {
    var doc = arguments.length <= 0 || arguments[0] === undefined ? document : arguments[0];

    return doc.activeElement;
}

function getScrollbarSize(recalc) {
    var size = void 0;
    if (!size || recalc) {
        if (canUseDOM) {
            var scrollDiv = document.createElement('div');

            scrollDiv.style.position = 'absolute';
            scrollDiv.style.top = '-9999px';
            scrollDiv.style.width = '50px';
            scrollDiv.style.height = '50px';
            scrollDiv.style.overflow = 'scroll';

            document.body.appendChild(scrollDiv);
            size = scrollDiv.offsetWidth - scrollDiv.clientWidth;
            document.body.removeChild(scrollDiv);
        }
    }

    return size;
}

function getHeight(node, client) {
    var win = getWindow(node);
    return win ? win.innerHeight : client ? node.clientHeight : getOffset(node).height;
}

function getWidth(node, client) {
    var win = getWindow(node);
    return win ? win.innerWidth : client ? node.clientWidth : getOffset(node).width;
}

module.exports = {
    ownerDocument: ownerDocument,
    ownerWindow: ownerWindow,
    getWindow: getWindow,
    getContainer: getContainer,
    canUseDOM: canUseDOM,
    contains: contains,
    nodeName: nodeName,
    scrollTop: scrollTop,
    scrollLeft: scrollLeft,
    getOffset: getOffset,
    getOffsetParent: getOffsetParent,
    getPosition: getPosition,
    isOverflowing: isOverflowing,
    activeElement: activeElement,
    getScrollbarSize: getScrollbarSize,
    getHeight: getHeight,
    getWidth: getWidth
};