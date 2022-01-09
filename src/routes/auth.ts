import express, { Request, Response } from 'express'
import Shopify, { ApiVersion, AuthQuery, SessionInterface } from '@shopify/shopify-api'
import cors from 'cors'
import getShop from '../utils/get-shop'
import { storeCallback, loadCallback, deleteCallback } from '../utils/custom-session'
import Shop from '../models/shop-model'
import sessionContext from '../utils/middlewares/session-context'
import loggedInCtx from '../utils/middlewares/loggedInCtx'
import { corsMiddleware } from '../utils/middlewares/experimental'
const auth = express.Router()

const { API_KEY, API_SECRET_KEY, SCOPES, HOST, SHOP } = process.env

Shopify.Context.initialize({
  API_KEY,
  API_SECRET_KEY,
  SCOPES: [SCOPES],
  HOST_NAME: HOST,
  IS_EMBEDDED_APP: false,
  API_VERSION: ApiVersion.October20,
  
  SESSION_STORAGE: new Shopify.Session.CustomSessionStorage(
      storeCallback,
      loadCallback,
      deleteCallback
   )
});

auth.get('/', sessionContext, async (req: Request, res: Response) => {
  try {
    const shop = getShop(req)
    
     let authRoute = await Shopify.Auth.beginAuth(
      req,
      res,
      shop,
      '/auth/callback',
      true,
    );
    return res.redirect(authRoute);
  } catch(err: any) {
    console.log(err)
    console.log("THE ERROR IS ON auth")
  }
});

auth.get('/callback', async (req: Request, res: Response) => {
  try {
    const shop = getShop(req)

    const session = await Shopify.Auth.validateAuthCallback(
      req,
      res,
      req.query as unknown as AuthQuery,
    );
    
    const checkShop = await Shop.findOne({shop: session.shop})

    if(checkShop == null){
      const storeShop = new Shop({
        shop: session.shop,
        scope: [session.scope],
        email: session.onlineAccessInfo.associated_user.email,
      })
      storeShop.save()
    }
    
    return res.redirect(`/`)
  } catch (error) {
    console.error(error);
    console.log("THE ERROR IS ON auth/callback")
  }
})

export default auth