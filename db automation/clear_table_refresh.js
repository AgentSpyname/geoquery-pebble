var pg = require('pg');
var connectionString = 'postgres://localhost:5432/stopr';

var client = new pg.Client(connectionString);
client.connect();
var query = client.query('DELETE FROM refresh;');
query.on('end', function() { client.end(); });
console.log("Deleted Data...")