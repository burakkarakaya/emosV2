var DISPATCHER_TYPES = {
    ERROR_ADD_TO_CART: 'ERROR_ADD_TO_CART',
    ADD_TO_CART: 'ADD_TO_CART',
    ADDING_TO_CART: 'ADDING_TO_CART',
    ADDED_TO_CART: 'ADDED_TO_CART',
    
    ERROR_REMOVE_TO_CART: 'ERROR_ADD_TO_CART',
    REMOVING_FROM_CART: 'REMOVING_FROM_CART',
    REMOVED_FROM_CART: 'REMOVED_FROM_CART',
    REMOVE_FROM_CART: 'REMOVE_FROM_CART',
    
    CART_ITEM_COUNT: 'CART_ITEM_COUNT',
    MINI_CART_LOADED: 'MINI_CART_LOADED'
};
// dil bazlı global config buraya en ve tr için ayrı ayrı yonetilmeli
var config = {
    culture: 'en'
};
// html elemenetler buraya
var elements = {
    id: 'data-product-id',
    documentId: 'data-document-id',
    list: '.product',
    detail: '.product-details',
    detailQuantity: '.input-number input',
    cart: '.product-widget',
    
    totalContainer: '.cart-summary',


    total: '.cart-summary > h5',
    totalItemCount: '.cart-summary > small',
    cartContainer: '.cart-list', 
    cartItemCount: '.shopping-cart > .qty',
    cart__Quantity: '.input-number input',
    button__addToCart: '.add-to-cart-btn',
    button__openCart: '.shopping-cart',
    button__removeFromCart: '.delete' // Instead of dot you need to add className
};
// dil bazlı tanımlamalar buraya en ve tr için ayrı ayrı yonetilmeli
var translation = {
    addToCart: 'ADD TO CART',
    addingToCart: 'ADDING',
    addedToCart: 'ADDED' 
};
// API URL buraya tanımlanacak

var URLs = {
    getCart: '/{{culture}}/Api/Version/1.0/ShoppingCart/GetCart',
    getCartItemCount: '/{{culture}}/Api/Version/1.0/ShoppingCart/GetCartItemCount',
    addToCart: '/{{culture}}/Api/Version/1.0/ShoppingCart/AddToCart',
    removeFromCart: '/{{culture}}/Api/Version/1.0/ShoppingCart/RemoveFromCart'
};
/*

----------
  USAGE
----------

stage.addEventListener("CustomEventClass", [{type:"CUSTOM_EVENT_TYPE", handler:"customEventHandler"}]);

stage.addEventListener("CustomEventClass", 
	[
		{type:"CUSTOM_EVENT_TYPE_1", handler:"customEventHandler1"},
		{type:"CUSTOM_EVENT_TYPE_2", handler:"customEventHandler2"}
	]
);

stage.removeEventListener("CustomEventClass");

stage.removeEventListener("CustomEventClass", "CUSTOM_EVENT_TYPE");

stage.dispatchEvent("CustomEventClass", "CUSTOM_EVENT_TYPE", vars);

function customEventHandler(vars)
{
	// do something cool...
}


*/

(function(f) {
    f.stage = {
        addEventListener: function(d, c) {
            var attachNewEvent = function(a) {
                a.events.push(d);
                a.handlers.push(c)
            };
            if (0 < this.events.length) {
                var a = 0;
                a: for (; a < this.events.length; ++a)
                    if (this.events[a] == d) {
                        var b = a;
                        break a
                    }
                if (0 <= b)
                    for (b = 0; b < c.length; ++b) this.handlers[a].push(c[b]);
                else attachNewEvent(this)
            } else attachNewEvent(this)
        },
        removeEventListener: function(d, c) {
            var a = 0;
            a: for (; a < this.events.length; ++a)
                if (this.events[a] == d) {
                    if (void 0 == c || "" == c || null == c) this.events.splice(a, 1), this.handlers.splice(a,
                        1);
                    else
                        for (var a = this.handlers[a], b = 0; b < a.length; ++b) a[b].type == c && a.splice(b, 1);
                    break a
                }
        },
        dispatchEvent: function(d, c, a) {
            if (0 < this.events.length)
                for (var b = 0; b < this.events.length; ++b)
                    if (this.events[b] == d && 0 < this.handlers.length)
                        for (var g = this.handlers[b], e = 0; e < g.length; ++e) {
                            var h = g[e];
							if (h.type == c){
                                if( typeof f[h.handler] !== 'undefined' )
                                    f[h.handler](a);
                            } 
                        }
        },
        events: [],
        handlers: []
    }
})(window);
/* 
    USAGE: 
    dispatcher({ type: 'ADD_TO_CART', params: { target: target } });
*/
var dispatcher = function (o) {
    o = o || {};
    var type = o['type'] || '',
        params = o['params'] || {};

    if (typeof stage !== 'undefined' && type != '')
        stage.dispatchEvent("CustomEvent", type, params);
};
var cookie = {
    get: function (key, value, options) {
        options = value || {};
        var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent;
        return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
    },
    set: function (key, value, options) {
        var _t = this;
        if (arguments.length > 1 && String(value) !== "[object Object]") {
            options = utils.extend({}, options);

            if (value === null || value === undefined) {
                options.expires = -1;
            }

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = String(value);

            return (document.cookie = [
                encodeURIComponent(key), '=',
                options.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));
        }
    }
};
// genel sistemde kullanabileceğimiz fonk. buraya tanımlanır

var utils = {

    getURL: function (o) {
        o = o || {};
        var key = o['key'] || '';

        if (typeof URLs !== 'undefined')
            return (URLs[key] || '').replace(/{{culture}}/g, (config || {})['culture'] || 'en');
        else {
            console.error('URLs değişkenini import ediniz');
            return '';
        }
    },

    ajx: function (o, callback) {

        o = o || {};
        var uri = o['uri'] || '',
            method = o['method'] || 'POST',
            headers = o['headers'] || { 'Content-Type': 'application/json' },
            data = o['data'] || {},
            _callback = function (res) {
                if (typeof callback !== 'undefined')
                    callback(res);
            };

        if (uri == '') {
            _callback({ type: 'error' });
            return false;
        }

        return fetch(uri, {
            method: method,
            headers: headers,
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(res => {
                if (res.IsSuccess)
                    _callback({ type: 'success', data: res });
                else
                    _callback({ type: 'error', message: res.Message });

            })
            .catch(error => {
                _callback({ type: 'error', message: error });
            });
    },

    regex: {
        typ1: /[^a-zA-ZıiIğüşöçİĞÜŞÖÇ\s]+/g /* sadece harf */,
        typ2: /[^0-9\s]+/g /* sadece rakam */,
        typ3: /[^a-zA-ZıiI0-9ğüşöçİĞÜŞÖÇ\s]+/g /* harf rakam karışık */,
        typ4: /[^a-zA-ZıiI0-9ğüşöçİĞÜŞÖÇ:\/\s]+/g /* address alanı için */,
        typ5: /[^0-9\(\)\s]+/g /* telefon için */
    },

    setRegex: function ({ key = '', value }) {
        o = o || {};
        var _t = this,
            key = o['key'] || '',
            value = o['value'] || '',
            rgx = _t.regex[key] || '';

        if (rgx)
            return value.replace(rgx, '');
        else
            return value;
    },

    detectEl: function (k) {
        return k == null ? false : true;
    },

    trimText: function (k) {
        k = k || '';
        return k.replace(/(^\s+|\s+$)/g, '');
    },

    cleanText: function (k) {
        k = k || '';
        return k.replace(/\s+/g, '');
    },

    toUpperCase: function (k) {
        k = k || '';
        var letters = { 'i': 'İ', 'ş': 'Ş', 'ğ': 'Ğ', 'ü': 'Ü', 'ö': 'Ö', 'ç': 'Ç', 'ı': 'I' },
            n = '';
        for (var i = 0; i < k.length; ++i) {
            var j = k[i];
            n += letters[j] || j;
        }
        return n.toUpperCase() || '';
    },

    toLowerCase: function (k) {
        k = k || '';
        var letters = { 'İ': 'i', 'I': 'ı', 'Ş': 'ş', 'Ğ': 'ğ', 'Ü': 'ü', 'Ö': 'ö', 'Ç': 'ç' },
            n = '';
        for (var i = 0; i < k.length; ++i) {
            var j = k[i];
            n += letters[j] || j;
        }
        return n.toLowerCase() || '';
    },

    toCapitalizeCase: function (k) {
        k = k || '';
        const _t = this,
            arr = [],
            upper = function (n) {
                return _t.toUpperCase(n.charAt(0)) + n.substring(1);
            };
        k = _t.toLowerCase(k);
        k = k.split(' ');
        for (var i = 0; i < k.length; ++i)
            arr.push(upper(k[i]));

        return arr.join(' ');
    },

    clearHtmlTag: function (k) {
        /* https://css-tricks.com/snippets/javascript/strip-html-tags-in-javascript/ */
        k = k || '';
        return k.replace(/(<([^>]+)>)/gi, '');
    },

    removeStyleTag: function (k) {
        k = k || '';
        return k.replace(/(style='.*')/g, '');
    },

    confirm: function (o, callback) {
        o = o || {};
        var title = o['title'] || 'Uyarı',
            message = o['message'] || '',
            _callback = function (res) {
                if (typeof callback !== 'undefined')
                    callback(res);
            };
        // uygun bir plugin tetiklemesi koyulabilir. 
    },

    alert: function (o, callback) {
        o = o || {};
        var title = o['title'] || 'Uyarı',
            message = o['message'] || '',
            _callback = function (res) {
                if (typeof callback !== 'undefined')
                    callback(res);
            };
        alert(message);
        // uygun bir plugin tetiklemesi koyulabilir.     
    },

    IsValidJSONString: function (str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    },

    diff: function (arr1, arr2) {
        var newArr = [];
        var arr = arr1.concat(arr2);

        for (var i in arr) {
            var f = arr[i];
            var t = 0;
            for (j = 0; j < arr.length; j++) {
                if (arr[j] === f) {
                    t++;
                }
            }
            if (t === 1)
                newArr.push(f);

        }
        return newArr;
    },

    cookies: function (o) {
        /* 
            USAGE:

            utils.cookies({ type: 'set', key: 'test', value: 'test-value', minutes: 10 });
            utils.cookies({ type: 'get', key: 'test' });
        */
        o = o || {};
        var typ = o['type'] || '',
            key = o['key'] || '',
            value = o['value'] || '';


        switch (typ) {
            case 'set': {
                var date = new Date(),
                    minutes = o['minutes'] || 1440;
                date.setTime(date.getTime() + (minutes * 60 * 1000));
                cookie.set(key, value, { expires: date, path: '/' });
                break;
            }
            case 'get': {
                return cookie.get(key) || '';
            }
            default:
                break;
        };
    },

    sessionStorage: function (o) {
        /* 
            USAGE:

            utils.sessionStorage({ type: 'set', key: 'test', value: 'test-value' });
            utils.sessionStorage({ type: 'get', key: 'test' });
        */
        o = o || {};
        var typ = o['type'] || '',
            key = o['key'] || '',
            value = o['value'] || '';


        switch (typ) {
            case 'set': {
                sessionStorage.setItem(key, value);
                break;
            }
            case 'get': {
                return sessionStorage.getItem(key);
            }
            case 'removeItem': {
                sessionStorage.removeItem(key);
                break;
            }
            case 'clear': {
                sessionStorage.clear();
                break;
            }
            default:
                break;
        };
    },

    containsClass: function (o) {
        o = o || {};
        var classList = o['classList'] || '', // classList
            value = (o['value'] || '').replace(/\./g, ''); // içerisinde bakılacak class

        return classList.contains(value) || false;
    },

    getParents: function (elem, selector) {

        /* 
            https://github.com/happyBanshee/JS-helpers/wiki/.closest(),-.parents(),-.parentsUntil(),-.find()-in-JS

            
            var elem = document.querySelector('#some-element');
            utils.getParents(elem, '.some-class');
            utils.getParents(elem.parentNode, '[data-product-id]');

        */

        // Variables
        var firstChar = selector.charAt(0);
        var supports = 'classList' in document.documentElement;
        var attribute, value;

        // If selector is a data attribute, split attribute from value
        if (firstChar === '[') {
            selector = selector.substr(1, selector.length - 2);
            attribute = selector.split('=');

            if (attribute.length > 1) {
                value = true;
                attribute[1] = attribute[1].replace(/"/g, '').replace(/'/g, '');
            }
        }

        // Get closest match
        for (; elem && elem !== document && elem.nodeType === 1; elem = elem.parentNode) {

            // If selector is a class
            if (firstChar === '.') {
                if (supports) {
                    if (elem.classList.contains(selector.substr(1))) {
                        return elem;
                    }
                } else {
                    if (new RegExp('(^|\\s)' + selector.substr(1) + '(\\s|$)').test(elem.className)) {
                        return elem;
                    }
                }
            }

            // If selector is an ID
            if (firstChar === '#') {
                if (elem.id === selector.substr(1)) {
                    return elem;
                }
            }

            // If selector is a data attribute
            if (firstChar === '[') {
                if (elem.hasAttribute(attribute[0])) {
                    if (value) {
                        if (elem.getAttribute(attribute[0]) === attribute[1]) {
                            return elem;
                        }
                    } else {
                        return elem;
                    }
                }
            }

            // If selector is a tag
            if (elem.tagName.toLowerCase() === selector) {
                return elem;
            }

        }

        return null;

    },

    extend: function () {
        /* https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/ */
        // Variables
        var extended = {};
        var deep = false;
        var i = 0;
        var length = arguments.length;

        // Check if a deep merge
        if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
            deep = arguments[0];
            i++;
        }

        // Merge the object into the extended object
        var merge = function (obj) {
            for (var prop in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                    // If deep merge and property is an object, merge properties
                    if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                        extended[prop] = extend(true, extended[prop], obj[prop]);
                    } else {
                        extended[prop] = obj[prop];
                    }
                }
            }
        };

        // Loop through each object and conduct a merge
        for (; i < length; i++) {
            var obj = arguments[i];
            merge(obj);
        }

        return extended;

    }


};

/* 

    örnek html:

    <div data-product-id="51">
        <div class="input-number"><input value="10" /></div>
        <button class="add-to-cart-btn"><i class="fa fa-shopping-cart"></i> <span>add to cart</span></button>
    </div>
*/

var shopping = {

    keys: {
        cartItemCount: 'cartItemCount',
        cartItem: 'cartItem'
    },

    cls: {
        activeted: 'activeted',
        cartEmpty: 'cart-empty',
        cartFull: 'cartFull'
    },

    temp: {

        cartItem: `
            <div class="product-widget" data-document-id="{{documentId}}">
                <div class="product-img">
                    <img src="{{src}}" alt="">
                </div>
                <div class="product-body">
                    <h3 class="product-name"><a href="#">{{productName}}</a></h3>
                    <h4 class="product-price"><span class="qty">{{qty}}</span>{{price}}</h4>
                </div>
                <button onclick="shopping.removeFromCart(this);" class="delete"><i class="fa fa-close"></i></button>
            </div>
        `,

        cartEmpty: '<div>Your Cart is Empty</div>',

        totalItemCountInCart: '{{count}} item(s) selected',

        total: 'SUBTOTAL: {{total}}'

    },

    // minicart
    setCartTemplate: function (data) {
        var _t = this,
            items = data['Items'] || [],
            totals = data['Totals'] || [],
            itemHtm = items.length > 0 ? items.map(function (item, index) {
                return _t.temp['cartItem'].replace(/{{documentId}}/g, item.DocumentId || '').replace(/{{src}}/g, item.Product.DefaultImageDocument.ThumbnailUrl || '').replace(/{{productName}}/g, item.Product.Name || '').replace(/{{qty}}/g, item.Quantity || '').replace(/{{price}}/g, item.SalesPriceWithTax || '');
            }).join('') : (_t.temp['cartEmpty'] || '');


        // cart list item add
        var target = document.querySelector(elements.cartContainer);
        if (utils.detectEl(target))
            target.innerHTML = itemHtm || '';

        // total    
        target = document.querySelector(elements.total);
        if (utils.detectEl(target))
            target.innerHTML = _t.temp['total'].replace(/{{total}}/g, (totals[0] || {}).PriceWithTax || '0');
    },
    getMiniCart: function () {
        var _t = this;
        utils.ajx({ uri: utils.getURL({ key: 'getCart' }) }, function (res) {
            var type = res['type'] || '',
                data = res['data'] || {},
                message = res['message'] || '';

            if (type == 'success') {
                var d = data.Cart || {};
                _t.setCartTemplate(d);
                utils.sessionStorage({ type: 'set', key: _t.keys['cartItem'], value: JSON.stringify(d) });
                dispatcher({ type: DISPATCHER_TYPES.MINI_CART_LOADED, params: { data: data } });
            } else
                console.error('getCart', message);
        });
    },


    // sepet adedi
    setCartItemCount: function (count) {
        var _t = this,
            target = document.querySelector(elements.cartItemCount);
        if (utils.detectEl(target))
            target.innerHTML = count;

        // total item count
        target = document.querySelector(elements.totalItemCount);
        if (utils.detectEl(target))
            target.innerHTML = _t.temp['totalItemCountInCart'].replace(/{{count}}/g, count);

        // cart status
        var bdy = document.body;
        if( count == 0 )
            bdy.classList.add(_t.cls['cartEmpty']).remove(_t.cls['cartFull']);
        else
            bdy.classList.add(_t.cls['cartFull']).remove(_t.cls['cartEmpty']);
    },
    getCartItemCount: function () {
        var _t = this;
        utils.ajx({ uri: utils.getURL({ key: 'getCartItemCount' }) }, function (res) {
            var type = res['type'] || '',
                data = res['data'] || {},
                message = res['message'] || '';
            if (type == 'success') {
                var count = data.Count || 0;

                _t.setCartItemCount(count);
                utils.sessionStorage({ type: 'set', key: _t.keys['cartItemCount'], value: count });
                dispatcher({ type: DISPATCHER_TYPES.CART_ITEM_COUNT, params: { value: count } });
            } else
                console.error('getCartItemCount', message);
        });
    },

    // sepete ekleme fonk.
    addToCart: function (target) {
        var _t = this;
        if (!target.classList.contains(_t.cls['activeted'])) {
            target.classList.add(_t.cls.activeted);

            var prts = utils.getParents(target.parentNode, '[data-product-id]'),
                id = prts.getAttribute('data-product-id') || '',
                quantity = (prts.querySelector(elements.cart__Quantity) || {}).value || 1;

            if (id != '') {
                dispatcher({ type: DISPATCHER_TYPES.ADDING_TO_CART, params: { target: target } });
                utils.ajx({ uri: utils.getURL({ key: 'addToCart' }), data: { ProductId: id, Quantity: quantity } }, function (res) {

                    var type = res['type'] || '',
                        data = res['data'] || {},
                        message = res['message'] || '';

                    if (type == 'success') {

                        dispatcher({ type: DISPATCHER_TYPES.ADDED_TO_CART, params: { target: target } });

                        _t.getCartItemCount();
                        _t.getMiniCart();

                        setTimeout(() => {
                            target.classList.remove(_t.cls.activeted);
                            dispatcher({ type: DISPATCHER_TYPES.ADD_TO_CART, params: { target: target, data: data } });
                        }, 333);

                    } else {
                        target.classList.remove(_t.cls.activeted);
                        if (message != '') {
                            utils.alert({ message: message });
                            dispatcher({ type: DISPATCHER_TYPES.ERROR_ADD_TO_CART, params: { target: target, message: message } });
                        }
                    }

                });
            } else
                target.classList.remove(_t.cls.activeted);

        }
    },

    // sepetden silme fonk.
    removeFromCart: function (target) {
        var _t = this;
        if (!target.classList.contains(_t.cls['activeted'])) {
            target.classList.add(_t.cls.activeted);

            var prts = utils.getParents(target.parentNode, '[data-document-id]'),
                id = prts.getAttribute('data-document-id') || '';

            if (id != '') {
                dispatcher({ type: DISPATCHER_TYPES.REMOVING_FROM_CART, params: { target: target } });
                utils.ajx({ uri: utils.getURL({ key: 'removeFromCart' }), data: { ItemId: id } }, function (res) {

                    var type = res['type'] || '',
                        data = res['data'] || {},
                        message = res['message'] || '';

                    if (type == 'success') {

                        dispatcher({ type: DISPATCHER_TYPES.REMOVED_FROM_CART, params: { target: target } });

                        _t.getCartItemCount();
                        _t.getMiniCart();

                        setTimeout(() => {
                            target.classList.remove(_t.cls.activeted);
                            dispatcher({ type: DISPATCHER_TYPES.REMOVE_FROM_CART, params: { target: target, data: data } });
                        }, 333);

                    } else {
                        target.classList.remove(_t.cls.activeted);
                        if (message != '') {
                            utils.alert({ message: message });
                            dispatcher({ type: DISPATCHER_TYPES.ERROR_REMOVE_TO_CART, params: { target: target, message: message } });
                        }
                    }

                });
            } else
                target.classList.remove(_t.cls.activeted);
        }
    },


    // sepet ekleme çıkarma buton eventları burada tanımlanır
    attachEvent: function (o) {
        o = o || {};
        var _t = this,
            btn = o['btn'],
            type = o['type'],
            onClick = function (evt) {
                switch (type) {
                    case 'addToCart':
                        _t.addToCart(evt.currentTarget);
                        break;

                    default:
                        break;
                }
            };

        for (var i = 0; i < btn.length; ++i) {
            var b = btn[i];
            b.removeEventListener('click', onClick);
            b.addEventListener('click', onClick);
        }
    },
    addEvent: function () {
        var _t = this;

        // add, remove cart
        _t.attachEvent({ btn: document.querySelectorAll(elements.button__addToCart), type: 'addToCart' });


        // open cart
        /*
        var target = document.querySelector(elements.button__openCart);
        if (utils.detectEl(target))
            target.addEventListener('click', (evt) => {
                var ths = evt.currentTarget;
                if (!ths.classList.contains(_t.cls['activeted'])) {
                    ths.classList.add(_t.cls.activeted);
                    console.log('istek');
                } else
                    ths.classList.remove(_t.cls.activeted);
            });
        */
    },

    check: function () {
        var _t = this;

        // ilk açılışta getCart istek atmak
        var k = utils.sessionStorage({ type: 'get', key: _t.keys['cartItem'] }) || '';
        if (k == '')
            _t.getMiniCart();
        else {
            if (utils.IsValidJSONString(k)) {
                k = JSON.parse(k);
                _t.setCartTemplate(k);
            } else
                _t.getMiniCart();
        }

        // ilk açılışta sepet adedi kontrolu varsa istek atmıyacağız
        k = utils.sessionStorage({ type: 'get', key: _t.keys['cartItemCount'] }) || '';
        if (k == '')
            _t.getCartItemCount();
        else
            _t.setCartItemCount(k || 0);
    },

    init: function () {
        var _t = this;
        _t.addEvent();
        _t.check();
    }


};

shopping.init();


/*
document.addEventListener('click', (event) => {
    const target = event.target,
        classList = target.classList || '';

    switch (true) {
        case utils.containsClass({ classList: classList, value: elements.button__addToCart }):
            shopping.addToCart(target);
            break;
        case utils.containsClass({ classList: classList, value: elements.button__removeFromCart }):
            shopping.removeFromCart(target);
            break;
        default:
            break;
    }
}, true);
*/
/* 
    FE KODLARI BURAYA
*/

// sepete ekleme durumundaki atraksiyonlar buraya

function ON_ADDING_TO_CART(o) {
    var target = (o['target']).querySelector('span');
    if (utils.detectEl(target))
        target.innerHTML = translation['addingToCart'] || 'ADDING';
}
stage.addEventListener("CustomEvent", [{ type: DISPATCHER_TYPES.ADDING_TO_CART, handler: 'ON_ADDING_TO_CART' }]);


function ON_ADDED_TO_CART(o) {
    var target = (o['target']).querySelector('span');
    if (utils.detectEl(target))
        target.innerHTML = translation['addedToCart'] || 'ADDED';
}
stage.addEventListener("CustomEvent", [{ type: DISPATCHER_TYPES.ADDED_TO_CART, handler: 'ON_ADDED_TO_CART' }]);


function ON_ADD_TO_CART(o) {
    var target = (o['target']).querySelector('span');
    if (utils.detectEl(target))
        target.innerHTML = translation['addToCart'] || 'ADD TO CART';


    setTimeout(function () {
        window.scrollTo({
            'behavior': 'smooth',
            'left': 0,
            'top': 0
        });
    }, 50);
}
stage.addEventListener("CustomEvent", [{ type: DISPATCHER_TYPES.ADD_TO_CART, handler: 'ON_ADD_TO_CART' }]);