// genel sistemde kullanabilecegimiz fonk. buraya tanimlanir

var utils = {

    getURL: function (o) {
        o = o || {};
        var key = o['key'] || '';

        if (typeof URLs !== 'undefined')
            return (URLs[key] || '').replace(/{{culture}}/g, (config || {})['culture'] || 'en');
        else {
            console.error('URLs degiskenini import ediniz');
            return '';
        }
    },

    ajx: function (o, callback) {

        o = o || {};
        var uri = o['uri'] || '',
            type = o['type'] || 'json', // json ve html degerlerini alir. default degeri json
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


        switch (type) {
            
            case 'json':
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

            case 'html':
                return fetch(uri)
                    .then(res => res.text())
                    .then(function (html) {
                        try {
                            var parser = new DOMParser();
                            var doc = parser.parseFromString(html, 'text/html');

                            _callback({ type: 'success', data: html, doc: doc });

                        } catch (error) {
                            _callback({ type: 'error', message: error.message });
                        }


                    }).catch(function (error) {
                        _callback({ type: 'error', message: error });
                    });

            default:
                break;
        }
    },

    regex: {
        typ1: /[^a-zA-ZiiIgüsöçIGÜSÖÇ\s]+/g /* sadece harf */,
        typ2: /[^0-9\s]+/g /* sadece rakam */,
        typ3: /[^a-zA-ZiiI0-9güsöçIGÜSÖÇ\s]+/g /* harf rakam karisik */,
        typ4: /[^a-zA-ZiiI0-9güsöçIGÜSÖÇ:\/\s]+/g /* address alani için */,
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
        var letters = { 'i': 'I', 's': 'S', 'g': 'G', 'ü': 'Ü', 'ö': 'Ö', 'ç': 'Ç', 'i': 'I' },
            n = '';
        for (var i = 0; i < k.length; ++i) {
            var j = k[i];
            n += letters[j] || j;
        }
        return n.toUpperCase() || '';
    },

    toLowerCase: function (k) {
        k = k || '';
        var letters = { 'I': 'i', 'I': 'i', 'S': 's', 'G': 'g', 'Ü': 'ü', 'Ö': 'ö', 'Ç': 'ç' },
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
        var title = o['title'] || 'Uyari',
            message = o['message'] || '',
            _callback = function (res) {
                if (typeof callback !== 'undefined')
                    callback(res);
            };
        // uygun bir plugin tetiklemesi koyulabilir. 
    },

    alert: function (o, callback) {
        o = o || {};
        var title = o['title'] || 'Uyari',
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

    hasClass: function (o) {
        o = o || {};
        var elm = o['element'] || {},
            classList = elm.classList || '', // classList
            value = (o['value'] || '').replace(/\./g, ''); // içerisinde bakilacak class

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

    },

    forEach: function (array, callback, scope) {
        https://css-tricks.com/snippets/javascript/loop-queryselectorall-matches/
        for (var i = 0; i < array.length; i++) {
            callback.call(scope, i, array[i]); // passes back stuff we need
        }
    },

    wrap: function (o) {
        o = o || {};
        var target = o['target'] || '',
            wrapper = o['wrapper'] || '';
        target.parentNode.insertBefore(wrapper, target);
        wrapper.appendChild(target);
    },

    getCreateElement: function (o) {
        o = o || {};
        var node = document.createElement(o['elm'] || '');
        node.className = o['cls'] || '';

        return node;
    },

    cssClass: function (o, callback) {
        var _t = this,
            target = o['target'],
            delay = o['delay'],
            type = o['type'];

        if (_t.detectEl(target)) {
            if (type == 'add') {
                var cls = o['cls'] || ['ready', 'animate'];
                target.classList.add(cls[0]);
                setTimeout(function () {
                    target.classList.add(cls[1]);
                    if (typeof callback !== 'undefined') callback();
                }, delay);
            } else {
                cls = o['cls'] || ['animate', 'ready'];
                target.classList.remove(cls[0]);
                setTimeout(function () {
                    target.classList.remove(cls[1]);
                    if (typeof callback !== 'undefined') callback();
                }, delay);
            }
        }
    },

    getElementOffset: function (el) {
        /* https://muffinman.io/javascript-get-element-offset/ */
        let top = 0;
        let left = 0;
        let element = el;

        // Loop through the DOM tree
        // and add it's parent's offset to get page offset
        do {
            top += element.offsetTop || 0;
            left += element.offsetLeft || 0;
            element = element.offsetParent;
        } while (element);

        return {
            top,
            left,
        };
    },

    detectPosition: function (o) {
        o = o || {};

        var _t = this,
            target = o['target'] || '',
            targetBounding = target.getBoundingClientRect() || {},
            rate = o['rate'] || 1,
            threshold = parseFloat(o['threshold'] || '0'),
            wst = document.body.scrollTop || document.documentElement.scrollTop || 0,
            ht = window.innerHeight,
            wt = window.innerWidth,
            _min = ht,
            o1 = { x: 0, y: wst, width: wt, height: (ht * rate) || _min },
            o2 = { x: 0, y: _t.getElementOffset(target).top + threshold, width: targetBounding.width, height: (targetBounding.height * rate) || _min },
            b = false;
        if (o1.x < o2.x + o2.width && o1.x + o1.width > o2.x && o1.y < o2.y + o2.height && o1.y + o1.height > o2.y)
            b = true;

        /* 
            özel durumlarda elementi geçtikten sonra tetiklenmesi için
            örnegin ürün liste loadmore
        */
        if (o['elementNext']) {
            if (o1.y >= o2.y + o2.height)
                b = true;
        }

        return b;
    },

    getMousePos: function (e) {
        var posx = 0;
        var posy = 0;
        if (!e) e = window.event;

        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        } else if (e.clientX || e.clientY) {
            posx = e.clientX + body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + body.scrollTop + document.documentElement.scrollTop;
        }

        return {
            x: posx,
            y: posy
        };
    }


};
