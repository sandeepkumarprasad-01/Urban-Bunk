const express = require("express");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
require('dotenv').config();

const setupMiddleware = (app) => {
  // View engine
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "../views"));
  
  // Body parser & static files
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, "../public")));
  app.use(methodOverride("_method"));
  
  // Session
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-this-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }
  }));
  
  // Flash messages
  app.use(flash());
};

module.exports = setupMiddleware;
