/* 

    örnek html:

    <div data-product-id="51">
        <div class="select-size"><input value="258996633" /></div>
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
        cartFull: 'cart-full',
        cartLoading: 'ajx-mini-cart-loading'
    },

    setCartTemplate: function (htm) {
        var _t = this;
        document.querySelectorAll('.ems-cart.modal')[0].innerHTML = htm || '';
    },

    getMiniCart: function () {
        var _t = this,
            bdy = document.body;

        bdy.classList.add(_t.cls['cartLoading']);
        utils.ajx({ uri: utils.getURL({ key: 'getCart' }), type: 'html' }, function (res) {
            var type = res['type'] || '',
                data = res['data'] || {},
                message = res['message'] || '';

            if (type == 'success') {
                _t.setCartTemplate(data);
                utils.sessionStorage({ type: 'set', key: _t.keys['cartItem'], value: escape(data) });
                dispatcher({ type: DISPATCHER_TYPES.MINI_CART_LOADED, params: { html: data, doc: res['doc'] || '' } });
            } else
                console.error('getCart', message);

            bdy.classList.remove(_t.cls['cartLoading']);
        });
    },


    // sepet adedi
    setCartItemCount: function (count) {
        var _t = this,
            target = document.querySelector(elements.cartItemCount);
        if (utils.detectEl(target))
            target.innerHTML = count;

        // cart status
        var bdy = document.body;
        if (count == 0) {
            bdy.classList.add(_t.cls['cartEmpty']);
            bdy.classList.remove(_t.cls['cartFull']);
        } else {
            bdy.classList.add(_t.cls['cartFull']);
            bdy.classList.remove(_t.cls['cartEmpty']);
        }
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
                utils.sessionStorage({ type: 'set', key: _t.keys['cartItemCount'], value: count.toString() });
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
                stockBarcodeId = prts.getAttribute('data-stock-barcode-id') || '',
                quantity = (prts.querySelector(elements.cart__Quantity) || {}).value || 1;


            if( stockBarcodeId == '' ){
                utils.alert({ message: translation['addToCartSizeSelectionError'] || '' });
                dispatcher({ type: DISPATCHER_TYPES.ADD_TO_CART_SIZE_SELECTION_ERROR, params: { target: target } });
                target.classList.remove(_t.cls.activeted);
                return false;
            }    

            if (id != '') {
                dispatcher({ type: DISPATCHER_TYPES.ADDING_TO_CART, params: { target: target } });
                utils.ajx({ uri: utils.getURL({ key: 'addToCart' }), data: { ProductId: id, Quantity: quantity, StockBarcodeId: stockBarcodeId } }, function (res) {

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


    // sepet ekleme çikarma buton eventlari burada tanimlanir
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
    },

    check: function () {
        var _t = this;

        // ilk açilista getCart istek atmak
        var k = utils.sessionStorage({ type: 'get', key: _t.keys['cartItem'] }) || '';
        if (k == '')
            _t.getMiniCart();
        else {
            try {
                k = unescape(k);
                _t.setCartTemplate(k);
            } catch (error) {
                _t.getMiniCart();
            }
        }

        // ilk açilista sepet adedi kontrolu varsa istek atmiyacagiz
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