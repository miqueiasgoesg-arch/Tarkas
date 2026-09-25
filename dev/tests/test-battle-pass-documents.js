const assert = require('node:assert/strict');
const { buildDocumentCatalog } = require('../../src/services/battlePass');

const regularId = '6a31807f17005505b70d5827';
const universalId = '6a3183258f113efdb7093622';
const catalog = buildDocumentCatalog(
  { data: { data: { items: {
    [regularId]: { id: regularId, normalizedName: 'financial-documents', name: 'fallback', iconLink: 'https://assets.tarkov.dev/financial-icon.webp' },
    [universalId]: { id: universalId, normalizedName: 'classified-documents', name: 'fallback', iconLink: 'https://assets.tarkov.dev/classified-icon.webp' },
    unrelated: { id: 'unrelated', normalizedName: 'documents-case', name: 'Pasta de documentos' }
  } } } },
  { data: { data: {
    [regularId + ' Name']: 'Documentos financeiros',
    [regularId + ' Description']: 'Relatórios da TerraGroup.',
    [universalId + ' Name']: 'Documentos confidenciais'
  } } }
);

assert.equal(catalog.length, 2);
assert.equal(catalog.find(item => item.id === regularId).name, 'Documentos financeiros');
assert.equal(catalog.find(item => item.id === regularId).description, 'Relatórios da TerraGroup.');
assert.equal(catalog.find(item => item.id === regularId).universal, false);
assert.equal(catalog.find(item => item.id === universalId).universal, true);
assert.ok(catalog.every(item => item.icon.startsWith('https://assets.tarkov.dev/')));
assert.equal(buildDocumentCatalog(null, null).length, 0);
console.log('Battle Pass document catalog tests passed.');
