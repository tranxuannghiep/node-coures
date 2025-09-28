const { Client } = require("@elastic/elasticsearch")
const _ = require('lodash')
const elasticsearchConfig = require('../configs/config.elasticsearch')

let clients={} //multiple connection

const instanceEventListener = async(elasticClient) => {
    try {
        await elasticClient.ping()
        console.log('Elasticsearch instance is ready')
    } catch (error) {
        console.error(error)
    }
}

const initElasticsearch = ({
    ELASTICSEARCH_IS_ENABLE,
    ELASTICSEARCH_HOSTS = 'http://localhost:9200',
}) => {
    if(ELASTICSEARCH_IS_ENABLE){
        const elasticsearchClient = new Client({node: ELASTICSEARCH_HOSTS})
        clients.elasticsearchClient = elasticsearchClient

        //handler connection
        instanceEventListener(elasticsearchClient)
    }

    
}
const getElasticsearchClients = () => {
    return clients
}

module.exports = {
    initElasticsearch,
    getElasticsearchClients
}
