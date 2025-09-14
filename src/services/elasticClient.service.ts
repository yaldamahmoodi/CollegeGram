import { Client } from "@elastic/elasticsearch";

export class ElasticClient {
    private client: Client;

    constructor(node = process.env.ELASTIC_URL ?? "http://localhost:9200") {
        this.client = new Client({ node });
    }

    getClient() {
        return this.client;
    }
}
