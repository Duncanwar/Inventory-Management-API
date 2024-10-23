import { NextFunction, Request, Response } from "express";
import prisma from "../../client";
import { ProductDTO } from "./dto";

export default class ProductController {
  static async createOneProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const productData: ProductDTO = req.body;
      const product = await prisma.product.create({
        data: productData,
      });
      return res.status(201).json({
        status: true,
        message: "Product created successfully",
        data: product,
      });
    } catch (error) {
      // Forwarding error to the error handler middleware using next()
      next(error);
    }
  }
}
