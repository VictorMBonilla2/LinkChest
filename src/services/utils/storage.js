// utils/storage.js
export const storage = {
  /**
   * Guarda datos en el almacenamiento local (Chrome o localStorage en modo dev).
   * @param {Object} data - Datos a guardar (clave-valor).
   * @returns {Promise<void>}
   */
  async set(data) {
    if (typeof chrome !== "undefined" && chrome.storage?.local) {
      return new Promise((resolve, reject) => {
        chrome.storage.local.set(data, () => {
          if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
          else resolve();
        });
      });
    } else {
      // Modo desarrollo / entorno Vite
      localStorage.setItem(
        "mockStorage",
        JSON.stringify({
          ...(JSON.parse(localStorage.getItem("mockStorage") || "{}")),
          ...data,
        })
      );
      return Promise.resolve();
    }
  },

  /**
   * Obtiene un valor almacenado por clave.
   * @param {string} key - Clave del valor a obtener.
   * @returns {Promise<any>} Valor almacenado o `undefined` si no existe.
   */
  async get(key) {
    if (typeof chrome !== "undefined" && chrome.storage?.local) {
      return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, (result) => {
          if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
          else resolve(result[key]);
        });
      });
    } else {
      const data = JSON.parse(localStorage.getItem("mockStorage") || "{}");
      return data[key];
    }
  },

  /**
   * Elimina una clave del almacenamiento local.
   * @param {string|string[]} key - Clave o lista de claves a eliminar.
   * @returns {Promise<void>}
   */
  async remove(key) {
    if (typeof chrome !== "undefined" && chrome.storage?.local) {
      return new Promise((resolve, reject) => {
        chrome.storage.local.remove(key, () => {
          if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
          else resolve();
        });
      });
    } else {
      // Modo desarrollo / entorno Vite
      const data = JSON.parse(localStorage.getItem("mockStorage") || "{}");

      if (Array.isArray(key)) {
        key.forEach(k => delete data[k]);
      } else {
        delete data[key];
      }

      localStorage.setItem("mockStorage", JSON.stringify(data));
      return Promise.resolve();
    }
  }
};
