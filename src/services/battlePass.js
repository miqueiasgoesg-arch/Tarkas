const { readCache } = require('./tarkovData');

const DOCUMENT_NAMES = new Set([
  'financial-documents',
  'project-documentation',
  'blueprints-and-technical-documentation',
  'test-documentation',
  'user-documentation',
  'medical-documents',
  'technical-documentation',
  'classified-documents'
]);

function buildDocumentCatalog(itemsResponse, translationsResponse) {
  const items = itemsResponse?.data?.data?.items || {};
  const translations = translationsResponse?.data?.data || {};
  return Object.values(items)
    .filter(item => DOCUMENT_NAMES.has(item.normalizedName))
    .map(item => {
      const key = item.id;
      const icon = /^https:\/\/assets\.tarkov\.dev\/[A-Za-z0-9._-]+-icon\.webp$/.test(item.iconLink || '') ? item.iconLink : '';
      return {
        id: key,
        normalizedName: item.normalizedName,
        name: translations[key + ' Name'] || item.name || item.normalizedName,
        description: translations[key + ' Description'] || '',
        icon,
        universal: item.normalizedName === 'classified-documents'
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
}

function getBattlePassDocuments() {
  return buildDocumentCatalog(
    readCache('regular', 'items'),
    readCache('regular', 'items_pt')
  );
}

module.exports = { buildDocumentCatalog, getBattlePassDocuments };
