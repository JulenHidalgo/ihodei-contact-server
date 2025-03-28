const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");

// Cargar las credenciales
const CREDENTIALS_PATH =
  "./config/client_secret_420877649235-dhkv0f5qh639de5f18cvbpgto6767764.apps.googleusercontent.com.json";
const TOKEN_PATH = "./token.json";
const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

fs.readFile(CREDENTIALS_PATH, (err, content) => {
  if (err) return console.error("❌ Error cargando credenciales:", err);
  authorize(JSON.parse(content));
});

function authorize(credentials) {
  if (!credentials.web || !credentials.web.redirect_uris) {
    return console.error(
      "❌ No se encontraron redirect_uris en las credenciales."
    );
  }

  const { client_secret, client_id, redirect_uris } = credentials.web;

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0] // usa tu dominio de Railway o localhost si estás probando localmente
  );

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  console.log("🌐 Autoriza esta app visitando esta URL:");
  console.log(authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("👉 Introduce el código de autorización aquí: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("❌ Error obteniendo token:", err);
      oAuth2Client.setCredentials(token);
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error("❌ Error guardando token:", err);
        console.log("✅ Token guardado correctamente en", TOKEN_PATH);
      });
    });
  });
}
