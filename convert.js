const fs = require('fs');
const converter = require('postman-to-openapi');

const postmanCollectionPath = './docs/betwise.postman_collection.json';
const outputPath = './docs/betwise_openapi.yaml';

converter(postmanCollectionPath, outputPath, { defaultTag: 'General' })
  .then(() => {
    console.log('✅ OpenAPI YAML generated successfully at:', outputPath);
  })
  .catch((err) => {
    console.error('❌ Error during conversion:', err);
  });
