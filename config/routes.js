const setupRoutes = (app) => {
  app.use("/", require("../routes/auth"));
  app.use("/", require("../routes/home.routes"));
  app.use("/", require("../routes/index.routes"));
  app.use("/", require("../routes/favorites.routes"));
  app.use("/", require("../routes/search.routes"));
};

module.exports = setupRoutes;
