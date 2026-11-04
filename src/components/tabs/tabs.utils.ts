// A tab and its panel point at each other by id; `baseId` keeps the ids of two
// Tabs on one page apart.
export const getTabId = (baseId: string, id: string) => `${baseId}-tab-${id}`;
export const getPanelId = (baseId: string, id: string) =>
  `${baseId}-panel-${id}`;
