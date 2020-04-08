class Shopping {
  
    static GetCart() {
        return fetch("/en/Api/Version/1.0/ShoppingCart/GetCart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => data)
            .catch(error => new Error(error.message))
    }
    
    static GetCartItemCount() {
        return fetch("/en/Api/Version/1.0/ShoppingCart/GetCartItemCount", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => data)
            .catch(error => new Error(error.message))
    }

    static AddToCart(id, quantity) {
        return fetch("/en/Api/Version/1.0/ShoppingCart/AddToCart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ ProductId: id, Quantity: quantity })
        })
        .then(response => response.json())
        .then(data => data)
        .catch(error => new Error(error.message))
    }
    
    static RemoveFromCart(documentId) {
        return fetch("/en/Api/Version/1.0/ShoppingCart/RemoveFromCart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ ItemId: documentId })
        })
        .then(response => response.json())
        .then(data => data)
        .catch(error => new Error(error.message))
    }
    
}
    const config = {
        id: 'data-product-id',
        documentId: 'data-document-id',
        list: '.product',
        detail: '.product-details',
        detailQuantity: '.input-number input',
        cart: '.product-widget',
        cartContainer: '.cart-list',
        cartItemCount: '.shopping-cart > .qty',
        total: '.cart-summary > h5',
        totalItemCount: '.cart-summary > small',
        totalContainer: '.cart-summary',
        button__addToCart: '.add-to-cart-btn',
        button__openCart: '.shopping-cart',
        button__removeFromCart: 'delete' // Instead of dot you need to add className
    }

    let itemsInCart = {}
    let isFirstOpen = true;
    let isCartOpened = false;

    function checkCartChange(updatedCart) {
        const current = Object.getOwnPropertyNames(itemsInCart)
        const updated = Object.getOwnPropertyNames(updatedCart)

        if (current.length !== updated.length) {
            return true
        }

        for (let index = 0; index < current.length; index++) {
            const item = current[index];

            if(current[item] !== updated[item]){
                return true
            }
        }
        return false
    }

    function renderItem(item) {
        return `
            <div class="product-widget" data-document-id="${item.DocumentId}">
                <div class="product-img">
                    <img src="@Html.GetMediaItem("samples/PRD-1.png").PublicUrl" alt="">
                </div>
                <div class="product-body">
                    <h3 class="product-name"><a href="#">${item.Product.Name}</a></h3>
                    <h4 class="product-price"><span class="qty">${item.Quantity}</span>${item.SalesPriceWithTax}</h4>
                </div>
                <button class="delete"><i class="fa fa-close"></i></button>
            </div>
        `
    } 

    function showItemsInCart(items) {
        const container = document.querySelector(config.cartContainer)
        container.innerHTML = ''
        let allItems = ''
        items.map((item, index) => {
            if(item.Product) allItems += renderItem(item)
        })
        container.insertAdjacentHTML('beforeend', allItems)
    }

    function showTotalItemCountInCart (){
        const itemCounter = document.querySelector(config.totalItemCount)
        const count = localStorage.getItem('cartItemCount');
        itemCounter.innerText = `${count} item(s) selected`
    }

    function showTotalsInCart(total = '0') {
        const totalContainer = document.querySelector(config.total)
        totalContainer.innerText = `SUBTOTAL: ${total}`
    }

    function renderEmptyCard() {
        const container = document.querySelector(config.cartContainer)
        container.innerHTML = '<div>Your Cart is Empty</div>'
    }

    function loadingCart () {
        const container = document.querySelector(config.cartContainer)
        container.innerHTML = '<div>Loading...</div>'
    }
    
    async function renderCart() {
     
        try {
            const data = await Shopping.GetCart();
            if (!data.IsSuccess) throw new Error(data.Message)
            let currentCart = {}
            data.Cart.Items.forEach(item => {
                currentCart = {[item.ProductId]: item.Quantity }
            })
            if(data.Cart.Items.length > 1) {
                if(isFirstOpen) {
                    itemsInCart = currentCart
                    showItemsInCart(data.Cart.Items)
                    showTotalsInCart(data.Cart.Totals[0].PriceWithTax)
                    showTotalItemCountInCart()
                    isFirstOpen = false;
                } else {
                    if(checkCartChange(currentCart)) {
                        return
                    } else {
                        showItemsInCart(data.Cart.Items)
                        showTotalsInCart(data.Cart.Totals[0].PriceWithTax)
                        showTotalItemCountInCart()
                    }
                }
            } else {
                renderEmptyCard()
                showTotalsInCart()
                showTotalItemCountInCart()
            }
        } catch (e) {
            console.log(e)
        }
    }

    async function openBasket () {
        const button = document.querySelector(config.button__openCart)
        button.addEventListener('click', () => {
            if(!isCartOpened) renderCart()
            isCartOpened = !isCartOpened
        })
    }

    function showCartItemCount() {
        const counter = document.querySelector(config.cartItemCount)
        const count = localStorage.getItem('cartItemCount')
        counter.innerHTML = count
    }
    
    async function setCartItemCount() {
        try {
            const data = await Shopping.GetCartItemCount()
            if(!data.IsSuccess) throw new Error(data.Message)
            localStorage.setItem('cartItemCount', data.Count)
            setTimeout(() => {
                showCartItemCount()
            }, 120);
        } catch (e) {
            return e
        }
    }

    async function addProductToCart(id, quantity) {
        try {
            const data = await Shopping.AddToCart(id, quantity)
            if(!data.IsSuccess) throw new Error(data.Message)

            if (!itemsInCart[id]) {
                itemsInCart = { [id]:1 }
            } else {
                itemsInCart[id]++
            }
        } catch(e) {
            return e
        }
    };
    
    function onAddToCart () {
        const products = document.querySelectorAll(config.list)
        for (const product of products) {
            product.querySelector(config.button__addToCart).addEventListener('click', () => {
                const id = parseInt(product.getAttribute(config.id), 10);
                addProductToCart(id, 1)
                .then(()=>{
                    setCartItemCount()
                })
            })
        }
    }
    
    function onDetailAddToCart () {
        const product = document.querySelector(config.detail);
        const addButton = document.querySelector(config.button__addToCart);
        const quantity = document.querySelector(config.detailQuantity).value || 1;
        addButton.addEventListener('click', () => {
        const id = parseInt(product.getAttribute(config.id), 10);
        
        addProductToCart(id, quantity)
        .then(()=>{
            setCartItemCount()
            })
        })
    }

    async function removeItemFromCart (documentId) {
        try {
            const data = await Shopping.RemoveFromCart(documentId)
            if(!data.IsSuccess) throw new Error(data.Message)
            renderCart()
            setCartItemCount();
        } catch (e) {
            return e
        }
    }

    // Event delegation for Created Item

    document.addEventListener('click', (event) => {
        const element = event.target
        if(element.className == config.button__removeFromCart) {
            const documentId = element.parentNode.getAttribute('data-document-id')
            console.log(documentId)
            removeItemFromCart(documentId)
        }
    }, true)
    
    function shoppingInit () {
        onAddToCart()
        openBasket()
        onDetailAddToCart()
        setCartItemCount()
        showCartItemCount()
        showTotalsInCart()
        showTotalItemCountInCart()
    }

    shoppingInit()