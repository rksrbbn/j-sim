import Dexie from "dexie";

export const db = new Dexie("j-roulette");

db.version(1).stores({
  history: "++id, memberName, timestamp",
  person: "id, day, name, age, balance, health, smart, looks, happiness, oshi"
});

export const addHistory = async (history) => {
  return await db.history.add(history);
};

export const getHistory = async () => {
  return await db.history.toArray();
};

export const clearHistory = async () => {
  return await db.history.clear();
};

export const addPerson = async (person) => {
  return await db.person.add(person);
};

export const updatePerson = async (id, updatedValues) => {
  try {
    await db.person.put({ id, ...updatedValues });
    console.log(`Person with id ${id} updated successfully!`);
  } catch (error) {
    console.error("Error updating person:", error);
  }
};

export const getPerson = async () => {
  return await db.person.toArray();
};
