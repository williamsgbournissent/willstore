import * as SQLite from "expo-sqlite";

let db;

export const initDatabase = async () => {
  try {
    if (!db) {
      console.log("Inicializando base de datos...");
      db = await SQLite.openDatabaseAsync("willstore.db");
      console.log("Base de datos inicializada exitosamente");
    }
    return db;
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
    throw error;
  }
};

export const initSessionTable = async () => {
  try {
    const database = await initDatabase();
    console.log("Creando tabla de sesiones si no existe...");
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS session (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        localId TEXT,
        email TEXT
      );
    `);
    console.log("Tabla de sesiones inicializada correctamente");
  } catch (error) {
    console.error("Error al inicializar tabla de sesiones:", error);
    throw error;
  }
};

export const saveSession = async (localId, email) => {
  try {
    console.log("Guardando sesión para:", email);
    const database = await initDatabase();
    await database.runAsync("DELETE FROM session;");
    await database.runAsync(
      "INSERT INTO session (localId, email) VALUES (?, ?);",
      [localId, email]
    );
    console.log("Sesión guardada exitosamente");
  } catch (error) {
    console.error("Error al guardar la sesión:", error);
    throw error;
  }
};

export const getSession = async () => {
  try {
    const database = await initDatabase();
    const result = await database.getAllAsync("SELECT * FROM session LIMIT 1;");
    console.log(
      "Sesión recuperada:",
      result.length > 0 ? result[0] : "No hay sesión"
    );
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Error al obtener la sesión:", error);
    throw error;
  }
};

export const clearSession = async () => {
  try {
    console.log("Limpiando sesión...");
    const database = await initDatabase();
    await database.runAsync("DELETE FROM session;");
    console.log("Sesión limpiada exitosamente");
  } catch (error) {
    console.error("Error al limpiar la sesión:", error);
    throw error;
  }
};
