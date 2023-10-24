import {Component} from '../component';
import {Product} from '../product/product';
import {ProductData} from 'types';
import html from './checkout.tpl.html';
import {formatPrice, genUUID} from '../../utils/helpers';
import {cartService} from '../../services/cart.service';
import {analytics} from '../../services/analytic.service';


class Checkout extends Component {
    products!: ProductData[];
    totalPrice?: number;

    async render() {
        this.products = await cartService.get();
        this.totalPrice = 0;

        if (this.products.length < 1) {
            this.view.root.classList.add('is__empty');
            return;
        }

        this.products.forEach((product) => {
            const productComp = new Product(product, {isHorizontal: true});
            productComp.render();
            productComp.attach(this.view.cart);
        });

        this.totalPrice = this.products.reduce((acc, product) => (acc += product.salePriceU), 0);
        this.view.price.innerText = formatPrice(this.totalPrice);

        this.view.btnOrder.onclick = this._makeOrder.bind(this);
    }

    private async _makeOrder() {
        await cartService.clear();
        const orderId = genUUID();
        const totalPrice = this.totalPrice ? Math.round(this.totalPrice / 1000) : 0;
        const productsIds = this.products.map(product => product.id);

        fetch('/api/makeOrder', {
            method: 'POST',
            body: JSON.stringify(this.products)
        });

        analytics.send({
            type: 'purchase',
            payload: {orderId, totalPrice, productsIds},
            timestamp: Date.now()
        })

        window.location.href = '/?isSuccessOrder';
    }
}

export const checkoutComp = new Checkout(html);
