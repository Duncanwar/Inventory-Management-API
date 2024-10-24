import Joi from "joi";

import catchAsync from "../utils/catchAsync";
import prisma from "../../client";

const createProduct = {
  body: Joi.object().keys({
    Name: Joi.string().required(),
    Quantity: Joi.number().required(),
    Category: Joi.string().required(),
  }),
};

export default class ProductController {
  static createOneProduct = catchAsync(async (req, res) => {
    const { Name, Quantity, Category } = req.body;
    const productExists = await prisma.products.findUnique({
      where: { Name: Name },
    });
    if (productExists) return res.status(200).json("It exists");
    console.log(productExists);

    const product = await prisma.products.create({
      data: { Name: Name, Quantity: Quantity, Category: Category },
    });
    console.log(product);
    return res.status(201).json(product);
  });
}
