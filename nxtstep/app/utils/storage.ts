export const getSavedCareers = (): number[] => {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem("saved_careers") || "[]");
};

export const saveCareer = (careerId: number) => {
  const saved = getSavedCareers();
  if (!saved.includes(careerId)) {
    saved.push(careerId);
    localStorage.setItem("saved_careers", JSON.stringify(saved));
  }
};

export const removeCareer = (careerId: number) => {
  const saved = getSavedCareers().filter(id => id !== careerId);
  localStorage.setItem("saved_careers", JSON.stringify(saved));
};
