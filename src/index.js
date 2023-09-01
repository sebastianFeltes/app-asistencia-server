import express, { json, urlencoded } from "express";
const app = express();
const port = 8080;

app.use(json());
app.use(urlencoded());
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});