var contentAjx = {
    clickable: true,
    el: {
        target: '.site-main',
        targetTitle: 'title',
        targetDesc: 'meta[name="description"]',
        btn: '.ems-paging ul li a, .filter-tree a, .menu-category-holder a'
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
    ckeckURI: function (uri) {
        var _t = this,
            layout = 'layout=false';

        if (uri.indexOf(layout) == -1) {
            if (uri.indexOf('?') != -1)
                uri = uri + '&' + layout;
            else
                uri = uri + '?' + layout;
        }

        return uri;
    },
    ajx: function (uri) {
        var _t = this;
        _t.clickable = false;
        _t.loading({ type: 'add' });
        utils.ajx({ uri: _t.ckeckURI(uri), type: 'html' }, function (res) {

            if (res.type == 'success') {

                var target = document.querySelector(_t.el.target), // mevcut sayfanin hedef içerigi 
                    targetTitle = document.querySelector(_t.el.targetTitle), // mevcut sayfanin title
                    targetDesc = document.querySelector(_t.el.targetDesc), // mevcut sayfanin desc
                    headers = res.headers || {},
                    pageTitle = headers.get('page-title') || '',
                    pageDesc = headers.get('page-description') || '';

                if (utils.detectEl(target))
                    target.innerHTML = res.data || '';

                if (utils.detectEl(targetTitle))
                    targetTitle.innerHTML = pageTitle;

                if (utils.detectEl(targetDesc))
                    targetDesc.content = pageDesc;

                history.pushState({ Url: uri, Page: pageTitle }, pageTitle, uri);

                dispatcher({ type: DISPATCHER_TYPES.CONTENT_LOADED, params: { type: 'success', data: res } });

            } else {
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

        window.onpopstate = function (event) {
            setTimeout(function () {
                _t.ajx(event.state ? event.state.Url : window.location.href);
            }, 1);
        };
    },
    init: function () {
        var _t = this,
            btn = document.querySelectorAll(_t.el.btn);

        if (utils.detectEl(btn) && history.pushState)
            _t.addEvent();
    }
};

contentAjx.init();