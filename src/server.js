const app = require("./index");

const connect = require("./configs/db");

app.listen(9000, async (req, res) => {
  await connect();

  console.log("hey there");
});
