import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

export const paginate = async (
  model: Prisma.ProductsDelegate<DefaultArgs>,
  page = 0,
  size = 10,
  filter: Record<string, any> = {} // Optional filter
) => {
  const skip = (page - 1) * size;
  const products = await model.findMany({
    where: filter,
    skip,
    take: size,
  });
  const totalItems = await model.count({ where: filter });
  const totalPages = Math.ceil(totalItems / size);

  return { products, page, totalPages, totalItems };
};
