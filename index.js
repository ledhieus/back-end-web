const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('express-flash')
const moment = require("moment")
const http = require('http');
const { Server } = require("socket.io");
require("dotenv").config();

const database = require("./config/database")

const systemConfig = require("./config/system")

const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");

database.connect();

const app = express();
const port = process.env.PORT;

// SocketIo
const server = http.createServer(app);
const io = new Server(server);
global._io = io
//End SocketIo
app.use(methodOverride('_method'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

//Flash
app.use(cookieParser('ASFKLJAFKJKLA'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
//End Flash

// TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

//End TinyMCE

//App locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

app.use(express.static(`${__dirname}/public`));

//Route
route(app);
routeAdmin(app);
app.get("*", (req, res) => {
  res.render("client/pages/errors/404", {
    pageTitle: "404 Not Found"
  })
})
server.listen(port, () => {
  console.log(`App listening on port ${port}`)
})