import user from "./user.routes";
// import producto from "../modules/products/product.routes";
import producto from "../modules/products/product.routes"
import profile from "./profiles.routes";
import account from "./account.route";
import accountType from "./accountType.routes";
import auth  from "./auth.routes";
import paypal from "../paypal/paypal.routes"
import binance from "../binance/binance.routes"


export {
    user,
    producto,
    profile,
    account,
    accountType,
    auth,
    paypal,
    binance
}