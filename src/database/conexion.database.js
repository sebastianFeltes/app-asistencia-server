import sqlite3 from 'sqlite3'

const db = new sqlite3.Database('./app.db');

db.all("SELECT DATE() AS fecha", (error, result) => {
  if (error) {
    console.log(error.message)
  }
  return console.log(result);
})

export { db };
