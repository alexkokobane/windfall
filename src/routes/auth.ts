import express, { Request, Response } from 'express'
import Shopify, { ApiVersion, AuthQuery, SessionInterface } from '@shopify/shopify-api'
import cors from 'cors'
import getShop from '../utils/get-shop'
import { storeCallback, loadCallback, deleteCallback } from '../utils/custom-session'
import Shop from '../models/shop-model'
import sessionContext from '../utils/middlewares/session-context'
import loggedInCtx from '../utils/middlewares/loggedInCtx'
import checkAuth from '../utils/middlewares/check-auth'
import { corsMiddleware } from '../utils/middlewares/experimental'
const auth = express.Router()

const { API_KEY, API_SECRET_KEY, SCOPES, HOST, SHOP } = process.env

Shopify.Context.initialize({
  API_KEY,
  API_SECRET_KEY,
  SCOPES: [SCOPES],
  HOST_NAME: HOST,
  IS_EMBEDDED_APP: false,
  API_VERSION: ApiVersion.January21,
  
  SESSION_STORAGE: new Shopify.Session.CustomSessionStorage(
      storeCallback,
      loadCallback,
      deleteCallback
   )
});

const handleWebhookRequest = async (topic: string, shop: string, webhookRequestBody: string) => {
  try{
    await Shop.deleteOne({'shop': shop})
    console.log(`${shop} has been deleted.`)
  } catch(err: any){
    console.log(err)
  }
}

Shopify.Webhooks.Registry.addHandler("APP_UNINSTALLED", {
  path: "/webhooks",
  webhookHandler: handleWebhookRequest,
})

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
    
    console.log("Here are the cookie")
    const session = await Shopify.Auth.validateAuthCallback(
      req,
      res,
      req.query as unknown as AuthQuery,
    );
    
    const shop = getShop(req)
    const checkShop = await Shop.findOne({shop: session.shop})

    if(checkShop == null){
      const storeShop = new Shop({
        shop: session.shop,
        scope: [session.scope],
        email: session.onlineAccessInfo.associated_user.email,
      })
      storeShop.save()

      const delShop = await Shopify.Webhooks.Registry.register({
        path: '/Webhooks',
        topic: 'APP_UNINSTALLED',
        accessToken: session.accessToken,
        shop: session.shop,
      })

      if(!delShop['APP_UNINSTALLED'].success){
        console.log(`Failed to create a webhook for APP UNINSTALL: ${delShop.result}`)
      }
    }
    
    return res.redirect(`/`)
  } catch (error) {
    console.error(error);
    console.log("THE ERROR IS ON auth/callback")
    res.status(501).render('pages/501')  }
})

export default auth