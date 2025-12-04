import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });
import {Pool} from "pg";
const app = express()
const port = 3000
const pool = new Pool({


  connectionString:'${process.env.CONNECTION_STRING}'
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
