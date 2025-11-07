/**
 * Objeto 
 * @property {string} url Enlace el cual se usara en el fetch
 * @property {Object} body Objeto el cual se enviara en el fetch como body 
 */
export class DataFetch {
  constructor(url, body = {}) {
    this.url = url;
    this.body = body;
  }

  // Método opcional
  getSummary() {
    return `${this.body} (${this.url})`;
  }
}