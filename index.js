const express = require("express");
const chalk = require("chalk");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { addUser, loginUser } = require("./users.controller");
const {
  getrequestsClient,
  addRequestClient,
} = require("./request.client.controller");
const auth = require("./middlewares/auth");

const port = 3000;
const app = express();

app.set("view engine", "ejs");
app.set("views", "pages");

app.use(express.static(path.resolve(__dirname, "public")));
app.use(express.json());
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/login", async (req, res) => {
  res.render("login", {
    title: "Express App",
    error: undefined,
  });
});

app.post("/login", async (req, res) => {
  try {
    const token = await loginUser(req.body.email, req.body.password);

    res.cookie("token", token, { httpOnly: true });

    res.redirect("/requests_clients");
  } catch (e) {
    res.render("login", {
      title: "Express App",
      error: e.message,
    });
  }
});

app.get("/register", async (req, res) => {
  res.render("register", {
    title: "Express App",
    error: undefined,
  });
});

app.post("/register", async (req, res) => {
  try {
    await addUser(req.body.email, req.body.password);

    res.redirect("/login");
  } catch (e) {
    if (e.code === 11000) {
      res.render("register", {
        title: "Express App",
        error: "Email is already registered",
      });

      return;
    }
    res.render("register", {
      title: "Express App",
      error: e.message,
    });
  }
});

app.get("/logout", (req, res) => {
  res.cookie("token", "", { httpOnly: true });

  res.redirect("/login");
});

app.use(auth);

app.get("/", async (req, res) => {
  res.render("index", {
    title: "Запись к врачу",
    created: false,
    error: false,
  });
});

app.get("/requests_clients", async (req, res) => {
  res.render("requests-clients", {
    title: "Список заявок",
    requestsList: await getrequestsClient(),
    created: false,
    error: false,
  });
});

app.post("/", async (req, res) => {
  try {
    await addRequestClient(
      req.body.title,
      req.body.client,
      req.body.phoneNumber
    );
    res.render("index", {
      title: "Запись к врачу",
      created: true,
      error: false,
    });
  } catch (e) {
    console.error("Creation error", e);
  }
});

mongoose.connect("mongodb://localhost:27017/").then(() => {
  app.listen(port, () => {
    console.log(chalk.green(`Server has been started on port ${port}...`));
  });
});
