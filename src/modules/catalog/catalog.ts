import { Component } from '../component';
import html from './catalog.tpl.html';

import { ProductList } from '../productList/productList';
import {fetchProducts} from '../../utils/fetchProducts';

class Catalog extends Component {
  productList: ProductList;

  constructor(props: any) {
    super(props);

    this.productList = new ProductList();
    this.productList.attach(this.view.products);
  }

  async render() {
    const productsReq = await fetchProducts('/api/getProducts');
    const products = await productsReq.json();
    this.productList.update(products);
  }
}

export const catalogComp = new Catalog(html);
