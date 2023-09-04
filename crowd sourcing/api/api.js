const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

const app = express();

const url = "mongodb://localhost:27017/user";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const User = mongoose.model("User", {
  email: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
});

const Question = mongoose.model("Question", {
  createdDate: { type: Date, default: Date.now },
  context: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  editedContext: { type: String, required: false },
  editedQuestion: { type: String, required: false },
  editedAnswer: { type: String, required: false },
  editedBy: { type: String, required: false },
  editDate: { type: String, required: false },
  verifiedDate: { type: String, required: false },
  verifiedBy: { type: String, required: false },
  isVerified: { type: Boolean, required: false },
  assigned: { type: Boolean, required: false }
});

app.post("/signup", async (req, res) => {
  const { email, password, username } = req.body;

  const emailExists = await User.findOne({ email });
  const usernameExists = await User.findOne({ username });

  if (emailExists || usernameExists) {
    return res.status(400).send("Email or username already exists");
  } else {
    const user = new User({
      email,
      password,
      username,
    });

    try {
      const savedUser = await user.save();
      res.status(200).send(savedUser);
    } catch (err) {
      res.status(500).send(err);
    }
  }
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.status(401).send("User not found.");
      } else if (user.password !== password) {
        res.status(401).send("Please check your credentials.");
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/questions", async (req, res) => {
  const { context, question, answer } = req.body;

  const questionObj = new Question({
    context,
    question,
    answer,
  });

  try {
    const savedQuestion = await questionObj.save();
    res.status(200).send(savedQuestion);
  } catch (err) {
    res.status(500).send(err);
  }
});

let lastQuestionId = null;

app.get("/questions/random", async (req, res) => {
  try {
    const count = await Question.countDocuments();
    let random = Math.floor(Math.random() * count);
    while (random === lastQuestionId) {
      random = Math.floor(Math.random() * count);
    }
    lastQuestionId = random;
    const question = await Question.findOne().skip(random);
    if (question.assigned === false) {
      res.status(200).send(question);
    } else {
      res.status(204).send();
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/questions/verifier", async (req, res) => {
  try {
    const count = await Question.countDocuments();
    let random = Math.floor(Math.random() * count);
    while (random === lastQuestionId) {
      random = Math.floor(Math.random() * count);
    }
    lastQuestionId = random;
    const question = await Question.findOne().skip(random);
    if (question.isVerified === false) {
      question.assigned === true;
      res.status(200).send(question);
    } else {
      res.status(204).send();
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

app.put('/questions/:id', async (req, res) => {
  const { id } = req.params;
  const { context, question, answer, editedContext, editedQuestion, editedAnswer, editedBy, editDate, verifiedDate, verifiedBy, assigned, isVerified } = req.body;

  try {
    const updatedQuestion = await Question.findOneAndUpdate(
      { _id: id },
      { context, question, answer, editedContext, editedQuestion, editedAnswer, editedBy, editDate, verifiedDate, verifiedBy, assigned, isVerified },
      { new: true }
    );

    res.status(200).send(updatedQuestion);
  } catch (err) {
    res.status(500).send(err);
  }
});



app.listen(5000, () => {
  console.log("API started: http://localhost:5000");
});
