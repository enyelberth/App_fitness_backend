import user from "../system/users/user.routes";
// import producto from "../modules/products/product.routes";
import producto from "../modules/products/product.routes";
import profile from "../system/users/profile/profiles.routes";
import account from "../system/accounts/account.route";
import accountType from "../system/accounts/accountype/accountType.routes";
import auth from "../auth/auth.routes";
import paypal from "../system/paypal/paypal.routes";
import binance from "../system/binance/binance.routes";
import categoryProduct from "../modules/products/categoryProduct/category.routes"
import subcategoryProuct from "../modules/products/subCategoryProduct/subcategory.routes"
import currency from "../system/accounts/currency/currency.routes";
import transaction from "../system/accounts/transaction/transaction.routes";
import muscle from "../modules/exercise/muscle/muscle.routes";
export {
  user,
  auth,
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
