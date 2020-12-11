"use strict";

const Route = use("Route");

Route.post("/images/:id", "ImageController.store");
Route.post("/images_verification/:id", "ImageVerificationController.store");
Route.post("/validation/:id", "ImageValidationController.store");
Route.post("/user", "UserController.store");
Route.post("/login", "SessionController.authenticate");

Route.group(() => {
  Route.post("/activate", "ActivationController.activate");
  Route.get("/activate", "ActivationController.createActivation");
  Route.post("/post", "PostController.store");
  Route.get("/post", "PostController.index");
  Route.post("/comment", "CommentController.store");
  Route.post("/like", "LikeController.store");
  Route.get("/user", "UserController.show");
}).middleware(["auth"]);
