import html from './favourites.tpl.html';
import {Component} from "../component";
import {ProductData} from "../../../types";
import {Product} from "../product/product";
import {favouritesService} from "../../services/favourites.service";


class Favourites extends Component {
    products!: ProductData[];

    async render() {
        this.products = await favouritesService.get();

        this.products.forEach((product) => {
            const productComp = new Product(product);
            productComp.render();
            productComp.attach(this.view.favourites);
        });
    }

}

export const favouritesComp = new Favourites(html);