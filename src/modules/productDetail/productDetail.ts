import {Component} from '../component';
import {ProductList} from '../productList/productList';
import {ProductData} from 'types';
import {formatPrice} from '../../utils/helpers';
import html from './productDetail.tpl.html';
import {cartService} from '../../services/cart.service';
import {analytics} from '../../services/analytic.service';

class ProductDetail extends Component {
    more: ProductList;
    product?: ProductData;

    constructor(props: any) {
        super(props);

        this.more = new ProductList();
        this.more.attach(this.view.more);
    }

    async render() {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = Number(urlParams.get('id'));

        const productResp = await fetch(`/api/getProduct?id=${productId}`);
        this.product = await productResp.json();

        if (!this.product) return;

        const {id, src, name, description, salePriceU} = this.product;

        this.view.photo.setAttribute('src', src);
        this.view.title.innerText = name;
        this.view.description.innerText = description;
        this.view.price.innerText = formatPrice(salePriceU);
        this.view.btnBuy.onclick = this._addToCart.bind(this);

        const isInCart = await cartService.isInCart(this.product);

        if (isInCart) this._setInCart();

        const secretKeyReq = await fetch(`/api/getProductSecretKey?id=${id}`)
        const secretKey = await secretKeyReq.json();
        this.view.secretKey.setAttribute('content', secretKey);


        const popularProductsReq = await fetch('/api/getPopularProducts')
        const products = await popularProductsReq.json();
        this.more.update(products);

        const isEmptyLog = !Object.keys(this.product.log).length;
        const body = Object.assign({},this.product, {secretKey});

        await analytics.send({
            type: isEmptyLog ? 'viewCard' : 'viewCardPromo',
            payload: body,
            timestamp: Date.now()
        })
    }

    private _addToCart() {
        if (!this.product) return;

        cartService.addProduct(this.product);

        analytics.send({
            type:'addToCard',
            payload:this.product,
            timestamp:Date.now()
        })
        this._setInCart();
    }

    private _setInCart() {
        this.view.btnBuy.innerText = '✓ В корзине';
        this.view.btnBuy.disabled = true;
    }
}

export const productDetailComp = new ProductDetail(html);
