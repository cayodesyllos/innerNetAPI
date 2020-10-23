"use strict";

const Route = use("Route");

Route.post("/images/:id", "ImageController.store");
Route.post("/validation/:id", "ImageValidationController.store");
Route.post("/user", "UserController.store");
