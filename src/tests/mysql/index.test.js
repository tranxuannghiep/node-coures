const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123456789",
  database: "test",
  port: 8800,
});

const batchSize = 100000;
const totalSize = 10000000;

let currentId = 1;
console.time(":::Timer::");
const insertBatch = async () => {
  const values = [];
  for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
    const name = `name-${currentId}`;
    const age = currentId;
    const address = `address-${currentId}`;
    values.push([currentId, name, age, address]);
    currentId++;
  }

  if (!values.length) {
    console.timeEnd(":::Timer::");
    pool.end((err) => {
      if (err) {
        console.log(`error batch`);
      } else {
        console.log(`connect pool success`);
      }
    });

    return;
  }

  const sql = `INSERT INTO test_table (id, name, age, address) values ?`;

  pool.query(sql, [values], async (err, results) => {
    if (err) throw err;

    console.log(`Inserted ${results.affectedRows}`);

    await insertBatch();
  });
};

insertBatch().catch(console.log);
