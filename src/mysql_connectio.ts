import mysql, {
  type RowDataPacket,
  type Connection,
  type ResultSetHeader,
} from "mysql2/promise";
const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "luademel",
});

export default connection