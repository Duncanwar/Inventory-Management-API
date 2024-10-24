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
    if (productExists) return res.status(200).json("The name must be unique");
    console.log(productExists);

    const product = await prisma.products.create({
      data: { Name: Name, Quantity: Quantity, Category: Category },
    });
    console.log(product);
    return res.status(201).json(product);
  });

  static updateOneProduct = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { ...data } = req.body;
    const productExists = await prisma.products.findFirst({
      where: { ID: id },
    });
    if (!productExists)
      return res.status(404).json("The product to be updated is not present");

    const updateProduct = await prisma.products.update({
      where: { ID: id },
      data: { ...data },
    });

    return res.status(200).json({ message: "Updated", data: updateProduct });
  });
}
