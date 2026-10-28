const STORAGE_KEY = 'myMeds';

export const loadSavedMeds = () => {
  try {
    const savedMeds = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(savedMeds) ? savedMeds : [];
  } catch {
    return [];
  }
};

export const storeSavedMeds = (medicines) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(medicines));
  } catch {
    // Storage can be unavailable in private or restricted browsing modes.
  }
};
