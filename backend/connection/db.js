const mongoose = require("mongoose");
global.ObjectId = mongoose.Types.ObjectId;

mongoose.connect(
  "mongodb://localhost:27017/angular_demo",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  (err, connection) => {
    if (err) throw new Error(err.message);
    console.log(`Connected to the database`);
  }
);
