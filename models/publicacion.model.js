const db = require("../config/db");

class Publicacion {
  constructor(id, titulo, texto) {
    this.id = id;
    this.titulo = titulo;
    this.texto = texto;
  }

  static fromRow(row) {
    return new Publicacion(row.id, row.titulo, row.texto);
  }

  static async getAll() {
    const query = "SELECT * FROM publicacion";
    const rows = await db.query(query);
    return rows.map(Publicacion.fromRow);
  }

  static async postPublicacion(titulo, texto) {
    const query = "INSERT INTO publicacion (titulo, texto) VALUES (?, ?)";
    const params = [titulo, texto];
    await db.query(query, params);

    const selectQuery = "SELECT * FROM publicacion WHERE id = LAST_INSERT_ID()";
    const rows = await db.query(selectQuery);
    return rows.map(Publicacion.fromRow)[0];
  }
}

// Exportar la clase para que pueda ser utilizada en otros módulos
module.exports = Publicacion;
