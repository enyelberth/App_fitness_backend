import user from "./user.routes";
// import producto from "../modules/products/product.routes";
import producto from "./product.routes";
import profile from "./profiles.routes";
import account from "./account.route";
import accountType from "./accountType.routes";
import auth from "./auth.routes";
import paypal from "./paypal.routes";
import binance from "./binance.routes";
import categoryProduct from "./category.routes"
import subcategoryProuct from "./subcategory.routes"
import currency from "./currency.routes";
import transaction from "./transaction.routes";
import muscle from "./muscle.routes";
import authGoogle from "./authGoogle.routes";
import routine from "./routine.routes";

export {
  user,
  routine,
  auth,
  authGoogle,
  muscle,
  producto,
  categoryProduct,
  subcategoryProuct,
  profile,
  account,
  accountType,
  paypal,
  binance,
  currency,
  transaction
};
