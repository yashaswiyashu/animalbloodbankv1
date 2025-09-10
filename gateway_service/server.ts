import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

app.get('/', (req, res) => {
  res.send('Hello from the homepage!');
});

// Proxy to app3 running on port 4003
app.use("/auth", createProxyMiddleware({
  target: "http://localhost:5000",
  changeOrigin: true,
  pathRewrite: { "^/auth": "" }
}));

app.use("/farmer", createProxyMiddleware({
  target: "http://localhost:5001",
  changeOrigin: true,
  pathRewrite: { "^/farmer": "" }
}));

app.use("/doctor", createProxyMiddleware({
  target: "http://localhost:5002",
  changeOrigin: true,
  pathRewrite: { "^/doctor": "" }
}));


app.use("/hospital", createProxyMiddleware({
  target: "http://localhost:5003",
  changeOrigin: true,
  pathRewrite: { "^/hospital": "" }
}));

app.use("/organ", createProxyMiddleware({
  target: "http://localhost:5004",
  changeOrigin: true,
  pathRewrite: { "^/organ": "" }
}));

app.use("/vendor", createProxyMiddleware({
  target: "http://localhost:5005",
  changeOrigin: true,
  pathRewrite: { "^/vendor": "" }
}));

app.use("/admin", createProxyMiddleware({
  target: "http://localhost:5007",
  changeOrigin: true,
  pathRewrite: { "^/admin": "" }
}));

app.use("/animal_enth", createProxyMiddleware({
  target: "http://localhost:5006",
  changeOrigin: true,
  pathRewrite: { "^/animal_enth": "" }
}));

app.use("/pay", createProxyMiddleware({
  target: "http://localhost:5008",
  changeOrigin: true,
  pathRewrite: { "^/pay": "" }
}));

app.use("/video", createProxyMiddleware({
  target: "http://localhost:5009",
  changeOrigin: true,
  pathRewrite: { "^/video": "" }
}));

app.use("/media", createProxyMiddleware({
  // target: "https://server.pranimithra.in/media",
  target: "http://localhost:5010",
  changeOrigin: true,
  pathRewrite: { "^/media": "" }
}));


const PORT = 5011;
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running at http://localhost:${PORT}`);
});
