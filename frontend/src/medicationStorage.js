const STORAGE_KEY = 'myMeds';
const PRESCRIPTIONS_KEY = 'savedPrescriptions';

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

export const loadSavedPrescriptions = () => {
  try {
    const prescriptions = JSON.parse(window.localStorage.getItem(PRESCRIPTIONS_KEY) || '[]');
    return Array.isArray(prescriptions) ? prescriptions : [];
  } catch {
    return [];
  }
};

export const storeSavedPrescriptions = (prescriptions) => {
  try {
    window.localStorage.setItem(PRESCRIPTIONS_KEY, JSON.stringify(prescriptions));
  } catch {
    // Storage can be unavailable in private or restricted browsing modes.
  }
};
