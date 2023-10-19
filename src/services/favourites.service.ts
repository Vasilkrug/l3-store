import localforage from 'localforage';
import {ProductData} from 'types';

const DB = '__wb-favourites';

class FavouritesService {
    init() {
        this._updProducts();
    }

    async addProduct(product: ProductData) {
        const products = await this.get();
        await this.set([...products, product]);
        this._updProducts();
    }

    async removeProduct(product: ProductData) {
        const products = await this.get();
        await this.set(products.filter(({id}) => id !== product.id));
        this._updProducts();
    }

    async get(): Promise<ProductData[]> {
        return (await localforage.getItem(DB)) || [];
    }

    async set(data: ProductData[]) {
        await localforage.setItem(DB, data);
    }

    async isInFavourites(product: ProductData) {
        const products = await this.get();
        return products.some(({id}) => id === product.id);
    }

    private async _updProducts() {
        const products = await this.get();
        const length = products.length;

        //@ts-ignore
        document.querySelector('.favLink').innerText = String(length >= 1 ? 'Избранное' : '');
    }

}

export const favouritesService = new FavouritesService();
