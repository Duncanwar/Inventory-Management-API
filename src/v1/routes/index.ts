import { Router } from "express";

import productRoute from "./product.route";

const route: Router = Router();

route.use("/products", productRoute);

export default route;
