// OpenSea API proxy.
// Create a proxy to redirect requests to the OpenSea API by injecting the API key header
// Examples:
// GET /api/v1/assets → https://api.opensea.io/api/v1/assets
import { createProxyMiddleware } from "http-proxy-middleware";

const apiProxy = createProxyMiddleware({
    target: "https://api.opensea.io",
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        // proxying to hide the api key from the client
        proxyReq.setHeader("X-API-KEY", process.env.REACT_APP_OPENSEA_TOKEN);
        proxyReq.setHeader("Cache-Control", "public, max-age=3600");
    },
});

// In Vercel, any file inside the "api" directory is mapped to "/api" and
// will be treated as an API endpoint.
// By default, on Vercel this "/api" endpoint would strictly match only "/api"
// requestes (ignoring sub-paths like "/api/hello"). So, to proxy the entire
// path, we add a rewrite in "vercel.json" to allow the "api" directory to catch
// all "/api/*" requests.
export default async function (req, res) {
    // Proxy "/*" requests to the OpenSea API.

    // TODO: Only allow requests for CityDAO's treasury wallet -> '&owner=0x60e7343205c9c88788a22c40030d35f9370d302d'
    /*   res.status(401).send({
      error: 401,
      message: "access denied",
    }) */
    return apiProxy(req, res);
}