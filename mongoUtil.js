const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config()

var _db;

module.exports = {

  connectToServer: function( callback ) {
    const client = new MongoClient(process.env.PASS, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    client.connect(err => {
      _db  = client.db('banthisguy');
      return callback( err );
    } );
  },

  getDb: function() {
    return _db;
  }
};