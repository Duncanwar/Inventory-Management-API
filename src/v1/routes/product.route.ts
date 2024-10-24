import { Router } from "express";
import ProductController from "../controllers/product.controller";
import validate from "../../middlewares/validate";
import { createProduct } from "../validations/product.validation";
import route from ".";

const router: Router = Router();

// Use POST for creating a new product
router.get("/:id", ProductController.updateOneProduct);

router.post(
  "/",
  validate(createProduct.body),
  ProductController.createOneProduct
);

router.get("/", (req, res) => {
  res.json("Hi");
});

export default router;
