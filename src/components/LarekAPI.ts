import { Api, ApiListResponse } from './base/api';
import {IGoods, IOrder, ISuccess} from "../types";

export interface ILarekAPI {
    getGoodsList: () => Promise<IGoods[]>; // получение списка товаров
    getGoodsData: (id: string) => Promise<IGoods>; // получение данных о товаре
    postOrder: (order: IOrder) => Promise<ISuccess>; // отправка информации о заказе на сервер
}

export class LarekAPI extends Api implements ILarekAPI {
    readonly cdn: string; // для вставки изображений

    constructor(baseUrl: string, cdn: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getGoodsList(): Promise<IGoods[]> {
        return this.get('/product')
        .then((data: ApiListResponse<IGoods>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    getGoodsData(id: string): Promise<IGoods> {
        return this.get(`/product/${id}`).
        then((item: IGoods) => ({
                ...item,
                image: this.cdn + item.image,
            })
        );
    }

    postOrder(order: IOrder): Promise<ISuccess> {
        return this.post('/order', order)
        .then((data: ISuccess) => data);
    }

}