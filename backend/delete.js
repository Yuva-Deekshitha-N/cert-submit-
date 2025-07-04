const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Certificate = require('./models/Certificate');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  await Certificate.deleteMany({});
  console.log("✅ All certificates deleted from the database.");
  process.exit();
})
.catch((err) => {
  console.error("❌ Error connecting to MongoDB:", err);
  process.exit(1);
});
