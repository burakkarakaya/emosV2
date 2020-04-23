var contentAjx = {
    clickable: true,
    el: {
        target: '.site-main',
        targetTitle: 'title',
        btn: '.ems-paging ul li a, .sidebar a, .order a, .menu-category-holder a'
    },
    cls: {
        loading: 'ajx-loading'
    },
    loading: function (o) {
        var _t = this,
            type = o['type'] || 'add',
            bdy = document.body;

        switch (type) {
            case 'add':
                bdy.classList.add(_t.cls['loading']);
                break;
            case 'remove':
                bdy.classList.remove(_t.cls['loading']);
                break;
            default:
                break;
        }

    },
    ajx: function (uri) {
        var _t = this;
        _t.clickable = false;
        _t.loading({ type: 'add' });
        utils.ajx({ uri: uri, type: 'html' }, function (res) {

            if (res.type == 'success') {

                var doc = res.doc,
                    targetTitle = document.querySelector(_t.el.targetTitle), // mevcut sayfanın hedef içeriği
                    ajxTargetTitle = doc.querySelector(_t.el.targetTitle) || {}, // ajx ile yüklenen sayfanın title bilgisi alınır
                    title = ajxTargetTitle.innerHTML || '',
                    targetContent = document.querySelector(_t.el.target), // mevcut sayfanın title
                    ajxTargetContent = doc.querySelector(_t.el.target) || {};  // ajx ile yüklenen sayfanın hedef gosterilen içeriği alınır

                if (utils.detectEl(targetContent))
                    targetContent.innerHTML = ajxTargetContent.innerHTML || '';

                if (utils.detectEl(targetTitle))
                    targetTitle.innerHTML = title;

                history.pushState({ Url: uri, Page: title }, title, uri);

                dispatcher({ type: DISPATCHER_TYPES.CONTENT_LOADED, params: { type: 'success', data: res } });

            }else{
                dispatcher({ type: DISPATCHER_TYPES.CONTENT_LOADED_ERROR, params: res });
            }

            _t.loading({ type: 'remove' });
            _t.clickable = true;
        })

    },
    onClick: function (evt) {
        evt.preventDefault();
        var _t = contentAjx,
            ths = this,
            uri = ths.getAttribute('href') || '';

        if (uri != '' && uri.indexOf('javascript') == -1 && _t.clickable)
            _t.ajx(uri);
    },
    addEvent: function () {
        var _t = this,
            btn = document.querySelectorAll(_t.el.btn);

        utils.forEach(btn, function (ind, elm) {
            elm.removeEventListener('click', _t.onClick, true);
            elm.addEventListener('click', _t.onClick, true);
        });
    },
    init: function () {
        var _t = this,
            btn = document.querySelectorAll(_t.el.btn);

        if (utils.detectEl(btn) && history.pushState)
            _t.addEvent();
    }
};

contentAjx.init();