/**
 * Google Tag Manager / GA4 Enhanced E-commerce DataLayer Helper
 * 
 * Pushes standard GA4 e-commerce events to the dataLayer.
 * These events are picked up by GTM and forwarded to GA4.
 * 
 * Reference: https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
 */

// Safe push to dataLayer
function pushToDataLayer(data) {
    if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(data);
    }
}

// Clear previous ecommerce data before pushing new event (GA4 best practice)
function clearEcommerce() {
    pushToDataLayer({ ecommerce: null });
}

/**
 * Helper: Convert a cart/product item into GA4 item format
 */
function toGA4Item(product, index = 0) {
    // Parse numeric price from string like "৳ 350" or use numericPrice
    let price = 0;
    if (product.numericPrice) {
        price = product.numericPrice;
    } else if (product.rawPrice) {
        price = product.rawPrice;
    } else if (typeof product.price === 'string') {
        price = parseFloat(product.price.replace(/[^0-9.]/g, '')) || 0;
    } else if (typeof product.price === 'number') {
        price = product.price;
    }

    return {
        item_id: String(product.id || ''),
        item_name: product.name || '',
        price: price,
        quantity: product.quantity || 1,
        item_category: product.category?.name || product.categoryName || '',
        item_brand: product.brand || product.publisher || 'তারুণ্য প্রকাশন',
        item_variant: product.variants?.storage || product.variantKey || '',
        index: index,
        discount: product.hasDiscount ? (product.originalPrice - price) : 0,
    };
}

// ─── GA4 E-commerce Events ───────────────────────────────────────────

/**
 * view_item — Fired when user views a product detail page
 */
export function trackViewItem(product) {
    clearEcommerce();

    const item = toGA4Item(product);
    pushToDataLayer({
        event: 'view_item',
        ecommerce: {
            currency: 'BDT',
            value: item.price,
            items: [item],
        },
    });
}

/**
 * add_to_cart — Fired when user adds a product to the cart
 */
export function trackAddToCart(product, quantity = 1) {
    clearEcommerce();

    const item = toGA4Item(product);
    item.quantity = quantity;
    pushToDataLayer({
        event: 'add_to_cart',
        ecommerce: {
            currency: 'BDT',
            value: item.price * quantity,
            items: [item],
        },
    });
}

/**
 * remove_from_cart — Fired when user removes a product from the cart
 */
export function trackRemoveFromCart(product, quantity = 1) {
    clearEcommerce();

    const item = toGA4Item(product);
    item.quantity = quantity;
    pushToDataLayer({
        event: 'remove_from_cart',
        ecommerce: {
            currency: 'BDT',
            value: item.price * quantity,
            items: [item],
        },
    });
}

/**
 * view_cart — Fired when user opens the cart
 */
export function trackViewCart(cartItems, cartTotal) {
    clearEcommerce();

    pushToDataLayer({
        event: 'view_cart',
        ecommerce: {
            currency: 'BDT',
            value: cartTotal || 0,
            items: cartItems.map((item, i) => toGA4Item(item, i)),
        },
    });
}

/**
 * begin_checkout — Fired when user lands on the checkout page
 */
export function trackBeginCheckout(cartItems, cartTotal) {
    clearEcommerce();

    pushToDataLayer({
        event: 'begin_checkout',
        ecommerce: {
            currency: 'BDT',
            value: cartTotal || 0,
            items: cartItems.map((item, i) => toGA4Item(item, i)),
        },
    });
}

/**
 * add_shipping_info — Fired when user selects shipping info
 */
export function trackAddShippingInfo(cartItems, cartTotal, shippingTier) {
    clearEcommerce();

    pushToDataLayer({
        event: 'add_shipping_info',
        ecommerce: {
            currency: 'BDT',
            value: cartTotal || 0,
            shipping_tier: shippingTier || '',
            items: cartItems.map((item, i) => toGA4Item(item, i)),
        },
    });
}

/**
 * add_payment_info — Fired when user selects payment method
 */
export function trackAddPaymentInfo(cartItems, cartTotal, paymentType) {
    clearEcommerce();

    pushToDataLayer({
        event: 'add_payment_info',
        ecommerce: {
            currency: 'BDT',
            value: cartTotal || 0,
            payment_type: paymentType || '',
            items: cartItems.map((item, i) => toGA4Item(item, i)),
        },
    });
}

/**
 * purchase — Fired when order is successfully placed
 * @param {object} params
 * @param {string} params.transactionId
 * @param {Array}  params.cartItems
 * @param {number} params.cartTotal
 * @param {number} params.shipping
 * @param {number} params.discount
 * @param {string} params.coupon
 * @param {object} [params.customerInfo] - Customer details to push for enhanced conversions
 * @param {string} [params.customerInfo.name]
 * @param {string} [params.customerInfo.phone]
 * @param {string} [params.customerInfo.email]
 * @param {string} [params.customerInfo.address]
 * @param {string} [params.customerInfo.city]
 * @param {string} [params.customerInfo.district]
 */
export function trackPurchase({ transactionId, cartItems, cartTotal, shipping, discount, coupon, customerInfo }) {
    clearEcommerce();

    const payload = {
        event: 'purchase',
        ecommerce: {
            transaction_id: transactionId || '',
            value: cartTotal || 0,
            currency: 'BDT',
            tax: 0,
            shipping: shipping || 0,
            coupon: coupon || '',
            discount: discount || 0,
            items: cartItems.map((item, i) => toGA4Item(item, i)),
        },
    };

    // Attach customer / user data for GTM Enhanced Conversions & GA4
    if (customerInfo) {
        payload.user_data = {
            name: customerInfo.name || '',
            phone_number: customerInfo.phone || '',
            email_address: customerInfo.email || '',
            address: {
                street: customerInfo.address || '',
                city: customerInfo.city || '',
                region: customerInfo.district || '',
                country: 'BD',
            },
        };
    }

    pushToDataLayer(payload);
}

/**
 * view_item_list — Fired when user views a list of products (category page, search results, etc.)
 */
export function trackViewItemList(products, listName = 'Product List', listId = '') {
    clearEcommerce();

    pushToDataLayer({
        event: 'view_item_list',
        ecommerce: {
            item_list_id: listId,
            item_list_name: listName,
            items: products.slice(0, 20).map((p, i) => toGA4Item(p, i)),
        },
    });
}

/**
 * select_item — Fired when user clicks on a product from a list
 */
export function trackSelectItem(product, listName = 'Product List', listId = '') {
    clearEcommerce();

    pushToDataLayer({
        event: 'select_item',
        ecommerce: {
            item_list_id: listId,
            item_list_name: listName,
            items: [toGA4Item(product)],
        },
    });
}

/**
 * search — Fired when user performs a search
 */
export function trackSearch(searchTerm) {
    pushToDataLayer({
        event: 'search',
        search_term: searchTerm,
    });
}
