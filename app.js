const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const dotenv = require("dotenv"); /*.env파일을 읽어서 process.env로만든다 process.env.COOKIE_SECRET에
cookiesecret값이 할당된다
별도로 프로세스.env로 관리하는 까닥은 보안과 설정의 편의로 비밀키들을 유출시키지 않기위해쓴다
*/

const path = require("path");
dotenv.config();
//모듈받아오기

app.set("port", process.env.PORT || 3000);

app.use(morgan("dev"));
app.use("/", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
    name: "session-cookie",
  })
);
//받아온 모듈들을 app.use로 사용한다
app.use(
  (req, res, next) => {
    console.log("모든 요청에 다 실행");
    next();
  },
  (req, res) => {
    throw new Error("에러처리는 에러메들웨어로");
  }
);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
