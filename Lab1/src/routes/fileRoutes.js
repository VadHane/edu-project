import Router from "express";
import FileController from "../controllers/FileController.js";

/**
 * Express router for API. (Path: /api/file/*)
 */
const router = Router();

/**
 * Object with endpoints for this router.
 */
const controller = new FileController();

router.get("/", controller.getAllFiles);

router.get("/:id", controller.getFile);

router.post("/", controller.createFile);

router.put("/:id", controller.updateFile);

router.delete("/:id", controller.deleteFile);

export default router;
