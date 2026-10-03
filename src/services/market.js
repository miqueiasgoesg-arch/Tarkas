const { readCache } = require('./tarkovData');

function payload(mode, name) {
  const cached = readCache(mode, name);
  return cached?.data?.data || cached?.data || {};
}

function catalog(mode = 'regular') {
  const source = payload(mode, 'items');
  const items = Object.values(source?.items || source || {});
  const pt = payload(mode, 'items_pt');
  return items.filter(item => item?.id && !item.types?.includes('noFlea') && Number(item.avg24hPrice) > 0).map(item => ({
    id: item.id,
    name: pt?.[item.name] || item.name,
    shortName: pt?.[item.shortName] || item.shortName || item.name,
    price: Number(item.avg24hPrice),
    lowPrice: Number(item.low24hPrice) || null,
    lastLowPrice: Number(item.lastLowPrice) || null,
    scannedAt: item.lastScan || '',
    types: item.types || [],
    icon: item.iconLink || item.image512pxLink || '',
    description: pt?.[item.description] || item.description || ''
  })).sort((a, b) => b.price - a.price);
}

module.exports = { catalog };
