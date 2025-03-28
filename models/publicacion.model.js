const db = require("../config/db");

class Publicacion {
  constructor(id, titulo, texto) {
    this.id = id;
    this.titulo = titulo;
    this.texto = texto;
  }

  static fromRow(row) {
    return new Obra(row.id, row.titulo, row.texto);
  }

  static async getAll() {
    const query = "SELECT * FROM publicacion";
    const rows = await db.query(query);
    return rows.map(Publicacion.fromRow);
  }
}

// Exportar la clase para que pueda ser utilizada en otros módulos
module.exports = Publicacion;
