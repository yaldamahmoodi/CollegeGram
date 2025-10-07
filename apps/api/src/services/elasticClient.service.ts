import { Client } from "@elastic/elasticsearch";
import env from "../../env.ts";

export class ElasticClient {
    private client: Client;

    constructor(node = env.ELASTIC_URL) {
        this.client = new Client({ node });
    }

    getClient() {
        return this.client;
    }
}
