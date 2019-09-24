// tslint:disable-next-line:class-name
export interface iConfiguration {
    host: string;
    production: boolean;
}

export class Configuration {
    static host = '';
    static production = false;

    static reWrite(data: any) {
        Configuration.host = data['host'];
        // Configuration.production = data['production'];
    }
};

