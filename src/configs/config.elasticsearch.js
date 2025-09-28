
const config = {
    nameProject:'shopDev'
}

const settings = {
  number_of_shards: 3,
  number_of_replicas: 2,
  max_ngram_diff: '50',
  analysis: {
    filter: {
      nGram_filter: {
        type: 'nGram',
        min_gram: 2,
        max_gram: 20,
        token_chars: ['letter', 'digit', 'punctuation', 'symbol']
      }
    },
    tokenizer: {
      autocomplete: {
        type: 'edge_ngram',
        min_gram: 2,
        max_gram: 10,
        token_chars: ['letter']
      }
    },
    analyzer: {
      autocomplete: {
        tokenizer: 'autocomplete',
        filter: ['lowercase']
      },
      autocomplete_search: {
        tokenizer: 'lowercase'
      },
      nGram_analyzer: {
        type: 'custom',
        tokenizer: 'whitespace',
        filter: ['lowercase', 'asciifolding', 'nGram_filter']
      },
      whitespace_analyzer: {
        type: 'custom',
        tokenizer: 'whitespace',
        filter: ['lowercase', 'asciifolding']
      }
    }
  }
}

module.exports = {
  settings,
  index: {
    city: `${config.nameProject}.city`,
    district: `${config.nameProject}.district`,
    ward: `${config.nameProject}.ward`,
    street: `${config.nameProject}.street`
  }
}
