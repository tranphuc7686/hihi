import app from "./app";
const port = 8080;
const host = "localhost";
app.listen(port,host, function() {
  console.log('Express server listening on port ' + port);
});