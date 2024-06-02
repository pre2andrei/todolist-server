const whitelist = [
//   "https://www.yoursite.com",
  "http://127.0.0.1:3000",
  "http://localhost:3000",
];

const corsOptions = {
  origin: (origin: string, callback: Function) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback("Not allowed by CORS");
    }
  },
  optionsSuccessStatus: 200,
};

export default corsOptions;
