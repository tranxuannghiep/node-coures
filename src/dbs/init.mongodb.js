"use strict";

const mongoose = require("mongoose");
const { countConnect } = require("../helpers/check.connect");
const {
  db: { host, port, name },
} = require("../configs/config.mongodb");
const citiesModel = require("../models/cities.model");
const connectString = `mongodb://${host}:${port}/${name}`;

class Database {
  constructor() {
    this.connect();
  }
  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", {
        color: true,
      });
    }

    mongoose
      .connect(connectString)
      .then((_) => {
        console.log("Connected Mongodb Success");
        countConnect();


        // change stream

        const citiStream = citiesModel.watch();
        citiStream.on('change', (change) => {
          console.log("MongoDB Change Detected:", change);

          switch(change.operationType) {
            case 'insert':
              console.log('A new city was inserted');
              break;
            case 'update':
              console.log('A city was updated');
              break;
            case 'delete':
              console.log('A city was deleted');
              break;

          }
        })
      })
      .catch((err) => console.log("Error Connect"));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceDatabase = Database.getInstance();
module.exports = instanceDatabase;
