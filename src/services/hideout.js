const { readCache } = require('./tarkovData');

function payload(mode, name) {
  const cached = readCache(mode, name);
  return cached?.data?.data || cached?.data || {};
}

function translated(dictionary, value, fallback = '') {
  return dictionary?.[value] || fallback || value || '';
}

function catalog(mode = 'regular') {
  const source = payload(mode, 'hideout');
  const stations = Object.values(source?.hideout || source || {}).filter(item => item?.id && Array.isArray(item.levels));
  const itemsSource = payload(mode, 'items');
  const items = itemsSource?.items || itemsSource || {};
  const pt = payload(mode, 'hideout_pt');
  const itemsPt = payload(mode, 'items_pt');
  const itemView = requirement => {
    const item = items[requirement.item] || {};
    return {
      id: requirement.item || '',
      name: translated(itemsPt, item.name, item.name || 'Item desconhecido'),
      count: Number(requirement.count) || 1,
      foundInRaid: Boolean(requirement.attributes?.foundInRaid),
      icon: item.iconLink || item.image512pxLink || ''
    };
  };
  return stations.map(station => ({
    id: station.id,
    name: translated(pt, station.name, station.normalizedName || station.name),
    image: station.imageLink || '',
    levels: station.levels.map(level => ({
      level: level.level,
      constructionTime: Number(level.constructionTime) || 0,
      description: translated(pt, level.description, level.description),
      items: (level.itemRequirements || []).map(itemView),
      stations: (level.stationLevelRequirements || []).map(requirement => ({ station: requirement.station || '', level: requirement.level || 0 })),
      traders: (level.traderRequirements || []).map(requirement => ({ trader: requirement.trader || '', level: requirement.level || 0 }))
    }))
  })).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
}

module.exports = { catalog };
