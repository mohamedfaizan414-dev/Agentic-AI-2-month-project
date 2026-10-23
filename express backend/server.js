require('dotenv').config();
const app = require('./src/app.js');
const connectDB = require('./src/db/db.js');

const port = Number(process.env.PORT || 3000);
async function start() {
  await connectDB();
  app.listen(port, () => console.log(`API listening on ${port}`));
}
start().catch((error) => { console.error('Unable to start API', error); process.exit(1); });
