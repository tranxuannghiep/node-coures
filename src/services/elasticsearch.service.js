const { getElasticsearchClients } = require("../dbs/init.elasticsearch")
const elasticsearchConfig = require("../configs/config.elasticsearch")


const { elasticsearchClient: esClient } = getElasticsearchClients()

const createIndex = async ({
    index,
    properties,
    settings
}) => {
    const checkIndex = await esClient.indices.exists({ index })
    if (checkIndex?.statusCode === 404) {
        console.info(`Elasticsearch create index: ${index}`)

        esClient.indices.create({
            index,
            body: {
                mappings: {
                    properties
                },
                settings: settings ?? elasticsearchConfig.settings
            }
        })
    } else {
        console.info(`Elasticsearch exist index: ${index}`)
    }
}

const index = async (index, instance) => {
    try {
        await esClient.index({
            index,
            id: instance._id?.toString(),
            refresh: 'wait_for',
            body: { ..._.omit(instance, ['_id']) }
        })
        return true
    } catch (error) {
        console.error(`Elasticsearch index - ${index} error: ... ${error}`)
        return false
    }
}

module.exports = {
    createIndex,
    index
}