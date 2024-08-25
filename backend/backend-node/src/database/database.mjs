import config from "./../config.mjs";
import { createConnection, createPool } from "mysql2/promise";

const dbConfig = {
  host: config.host,
  port: config.port,
  user: config.userdatab,
  password: config.password,
  database: config.database,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

async function queryWithPool(pool, query) {
  const connection = await pool.getConnection();
  try {
    const [consulta] = await connection.query(query);
    const results = {
        "status": 200,
        "message": "Consulta exitosa",
        "result": consulta,
    }
    return results;
  } catch (error) {
    const results = {
        "status": 500,
        "message": error.message,
        "result": null,
    }
    return results;
  } finally {
    connection.release(); // Asegurarse de liberar la conexión
  }
}

async function consult(texto) {
  const pool = createPool(dbConfig);
  const queries = Array(1).fill(texto);

  const result = await Promise.all(
    queries.map(async (query) => await queryWithPool(pool, query))
  );

  await pool.end();

  return result;
}

export { consult };

/*async function queryWithoutPool(dbConfig, query) {
  const connection = await createConnection(dbConfig);
  await connection.query(query);
  await connection.end();
}

async function benchmark() {
  const pool = createPool(dbConfig);
  const queries = Array(100).fill("SELECT COUNT(*) FROM posts;");

  // Benchmark using connection pool - START
  let start = performance.now();
  await Promise.all(
    queries.map(async (query) => await queryWithPool(pool, query))
  );

  let end = performance.now();
  console.log(`Total time with connection pool: ${end - start} ms`);
  // Benchmark using connection pool - END

  // Benchmark without using a connection pool - START
  start = performance.now();
  for (let query of queries) {
    await queryWithoutPool(dbConfig, query);
  }
  end = performance.now();
  console.log(`Total time without connection pool: ${end - start} ms`);
  // Benchmark without using a connection pool - END

  await pool.end(); // Close all connections in the pool
}
*/
