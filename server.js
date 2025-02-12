var express = require("express"),
	http = require("http"),
	mongoose = require("mongoose"),
	ReceiptController = require("./controllers/receipts_controller.js"),
	UsersController = require("./controllers/users_controller.js"),
	app = express(); 

http.createServer(app).listen(3000);

app.use('/',express.static(__dirname + "/client"));
app.use('/user/:username',express.static(__dirname + "/client"));

// командуем Express принять поступающие объекты JSON
app.use(express.urlencoded({ extended: true }));

// подключаемся к хранилищу данных в Mongo
mongoose.connect('mongodb://127.0.0.1:27017/cddvd', {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true 
}).then(res => {
	console.log("DB Connected!")
}).catch(err => {
	console.log(Error, err.message);
});

app.get("/receipts.json", ReceiptController.index);
app.get("/receipts/:id", ReceiptController.show); 
app.post("/receipts", ReceiptController.create);
app.put("/receipts/:id", ReceiptController.update);
app.delete("/receipts/:id", ReceiptController.destroy);

app.get("/users/:username/receipts.json", ReceiptController.index);
app.post("/users/:username/receipts", ReceiptController.create);
app.put("/users/:username/receipts/:id", ReceiptController.update);
app.delete("/users/:username/receipts/:id", ReceiptController.destroy);

app.get("/users.json", UsersController.index); 
app.post("/users", UsersController.create); 
app.get("/users/:username", UsersController.show);
app.put("/users/:username", UsersController.update);
app.delete("/users/:username", UsersController.destroy); 