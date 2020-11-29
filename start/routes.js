"use strict";

const Route = use("Route");

Route.post("/images/:id", "ImageController.store");
Route.post("/validation/:id", "ImageValidationController.store");
Route.post("/user", "UserController.store");
Route.post("/login", "SessionController.authenticate");

Route.group(() => {
  Route.post("/activate", "ActivationController.activate");
  Route.get("/activate", "ActivationController.createActivation");
}).middleware(["auth"]);
