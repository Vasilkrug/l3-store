type Analytics = {
    type: string,
    payload: any,
    timestamp: number,
}

class AnalyticService {
    url: string;

    constructor() {
        this.url = '/api/sendEvent';
    }

    async send(body: Analytics) {
        fetch(this.url, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    }
}

export const analytics = new AnalyticService();