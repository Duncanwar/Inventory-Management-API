import catchAsync from "../utils/catchAsync";
import prisma from "../../client";
import Response from "../utils/response";

export default class ProductController {
  static findProductById = async (id: string) => {
    return await prisma.products.findUnique({ where: { ID: id } });
  };

  static createOneProduct = catchAsync(async (req, res) => {
    const { Name, Quantity, Category } = req.body;
    if (!Name || Quantity === undefined || !Category) {
      return res.status(400).json("Missing required fields");
    }

    const productExists = await prisma.products.findUnique({
      where: { Name },
    });
    if (productExists) {
      return Response.send(res, 409, "exists", productExists);
    }

    const product = await prisma.products.create({
      data: { Name, Quantity, Category },
    });

    return Response.send(res, 201, "Product created", product);
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
      data: { Quantity, ...data },
    });

    return res.status(200).json({
      message: "Updated",
      before: productExists,
      after: updateProduct,
    });
  });

  static deleteOneProduct = catchAsync(async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json("ID not provided");

    const product = await prisma.products.findUnique({ where: { ID: id } });
    if (!product) return res.status(404).json("Product not found");

    await prisma.products.delete({ where: { ID: id } });
    // const product = await this.findProductById(id);
    // if (!product)
    //   return res.status(404).json("The product to be deleted is not present");

    // if (product?.Quantity ??0 > 0)
    //   return res
    //     .status(200)
    //     .json("The product to be deleted has quantity greater than zero");

    // const afterDelete = await prisma.products.delete({ where: { ID: id } });
    return res.status(200).json({
      message: "Deleted",
      before: product,
    });
  });

  static getOneProduct = catchAsync(async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json("ID not provided");

    const product = await this.findProductById(id);
    if (!product) return res.status(404).json("The product is not present");
    return res.status(200).json({ msg: "retrieve", data: product });
  });

  static getAllProducts = catchAsync(async (req, res) => {
    console.log(req.query);
    const { quantity } = req.query;
    const products = await prisma.products.findMany();
    // const prod = await prisma.products.groupBy({
    //   by:['Category'],
    //   where: {
    //     Quantity: {
    //       _avg:{} quantity,
    //     },
    //   },
    // });
    return res.status(200).json({ msg: "retrieve All", data: products });
  });

  static getProductsByCategoryOrQuantity = catchAsync(async (req, res) => {
    const { Category, Quantity } = req.query;

    // Define the filter type
    const filter: {
      Category?: {
        contains: string;
        mode: "insensitive";
      };
      Quantity?: {
        lt: number;
      };
    } = {};

    // Check if Category is provided and add it to the filter
    if (Category) {
      filter.Category = {
        contains: Category as string, // Cast to string since query parameters are strings
        mode: "insensitive", // Makes the search case insensitive
      };
    }

    // Check if Quantity is provided and is a valid number
    if (Quantity) {
      const quantityLimit = Number(Quantity);
      if (!isNaN(quantityLimit)) {
        filter.Quantity = {
          lt: quantityLimit, // Find products with Quantity less than the specified limit
        };
      } else {
        return res.status(400).json({ message: "Invalid Quantity" });
      }
    }

    // Fetch products using the constructed filter
    const products = await prisma.products.findMany({
      where: filter,
    });

    return Response.send(res, 200, "retrieved products", products);
  });
}
