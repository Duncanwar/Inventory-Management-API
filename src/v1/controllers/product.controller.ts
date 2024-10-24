import catchAsync from "../utils/catchAsync";
import prisma from "../../client";

export default class ProductController {
  static createOneProduct = catchAsync(async (req, res) => {
    const { Name, Quantity, Category } = req.body;
    const productExists = await prisma.products.findUnique({
      where: { Name: Name },
    });
    if (productExists) return res.status(200).json("The Name must be unique");

    const product = await prisma.products.create({
      data: { Name: Name, Quantity: Quantity, Category: Category },
    });
    return res.status(201).json(product);
  });

  static updateOneProduct = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { Quantity, ...data } = req.body;
    if (Quantity < 0) return res.status(409).json("Invalid Input");

    const productExists = await this.findProductById(id);
    if (!productExists)
      return res.status(404).json("The product to be updated is not present");

    const updateProduct = await prisma.products.update({
      where: { ID: id },
      data: { Quantity: Quantity, ...data },
    });

    return res.status(200).json({
      message: "Updated",
      before: productExists,
      after: updateProduct,
    });
  });

  static deleteOneProduct = catchAsync(async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(404).json("not found");

    const [product, afterDelete] = await Promise.all([
      prisma.products.findUnique({ where: { ID: id } }),
      prisma.products.delete({ where: { ID: id } }),
    ]);

    return res.status(200).json({
      message: "Deleted",
      before: product,
      after: afterDelete,
    });
  });

  static getOneProduct = catchAsync(async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(404).json("not found");

    const product = await this.findProductById(id);
    if (!product) return res.status(404).json("The product is not present");
    return res.status(200).json({ msg: "retrieve", data: product });
  });

  static getAllProducts = catchAsync(async (req, res) => {
    const products = await prisma.products.findMany();
    return res.status(200).json({ msg: "retrieve Allx", data: products });
  });

  static findProductById = async (id: string) => {
    return await prisma.products.findUnique({ where: { ID: id } });
  };
}
