export type ApiListResponse<Type> = {
    total: number, // количество элементов
    items: Type[] // массив элементов
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api {
    readonly baseUrl: string; // св-во с базовым URL
    protected options: RequestInit; // св-во с опциями запроса

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {})
            }
        };
    }

    // Метод для обработки ответа от сервера
    protected handleResponse(response: Response): Promise<object> {
        if (response.ok) return response.json();
        else return response.json()
            .then(data => Promise.reject(data.error ?? response.statusText));
    }

    // Метод для выполнения GET-запроса на сервер
    get(uri: string) {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method: 'GET'
        }).then(this.handleResponse); // После успешного завершения запроса обрабатываем ответ от сервера
    }

    // Метод для выполнения 'POST' | 'PUT' | 'DELETE'-запросов на сервер (по умолчанию установлен POST-запрос)
    post(uri: string, data: object, method: ApiPostMethods = 'POST') {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method,
            body: JSON.stringify(data) // Данные переданного объекта data преобразуются в JSON-строку
        }).then(this.handleResponse); // После успешного завершения запроса обрабатываем ответ от сервера
    }
}
