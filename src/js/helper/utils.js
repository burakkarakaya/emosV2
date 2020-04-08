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
