import app from "./app";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  // Simple startup log
  console.log(`HireCast backend listening on port ${PORT}`);
});

