import user from "../system/user/user.routes";
// import producto from "../modules/products/product.routes";
import producto from "../modules/products/product.routes";
import profile from "./profiles.routes";
import account from "./account.route";
import accountType from "./accountType.routes";
import auth from "./auth.routes";
import paypal from "../paypal/paypal.routes";
import binance from "../binance/binance.routes";
import categoryProduct from "../modules/products/categoryProduct/category.routes"
import subcategoryProuct from "../modules/products/subCategoryProduct/subcategory.routes"

export {
  user,
  auth,
  producto,
  categoryProduct,
  subcategoryProuct,
  profile,
  account,
  accountType,
  paypal,
  binance,
};
