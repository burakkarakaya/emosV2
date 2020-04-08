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
        var _t = this,
            bdy = document.body;

        bdy.classList.add(_t.cls['cartLoading']);
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

            bdy.classList.remove(_t.cls['cartLoading']);
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
        if (count == 0){
            bdy.classList.add(_t.cls['cartEmpty']);
            bdy.classList.remove(_t.cls['cartFull']);
        }else{
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