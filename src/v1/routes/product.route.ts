import { Router } from "express";
import ProductController from "../controllers/product.controller";

const router: Router = Router();

router.get("/", ProductController.createOneProduct);

export default router;
