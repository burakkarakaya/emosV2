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