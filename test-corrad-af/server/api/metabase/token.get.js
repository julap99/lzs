import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  
  const METABASE_SECRET_KEY = config.metabase.secretKey;

  const payload = {
    resource: { dashboard: 2 },
    params: {},
    exp: Math.round(Date.now() / 1000) + 10 * 60, // 10 minute expiration
  };

  try {
    const token = jwt.sign(payload, METABASE_SECRET_KEY);
    
    return {
      success: true,
      token: token,
      siteUrl: config.metabase.siteUrl
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate Metabase token'
    });
  }
}); 