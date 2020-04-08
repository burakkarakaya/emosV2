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