import {
  protectedResourceHandler,
  metadataCorsOptionsRequestHandler,
} from "mcp-handler";

const SUPABASE_PROJECT_ID =
  process.env.SUPABASE_PROJECT_ID || "hztwecyfjyjldqajnqnx";
const SUPABASE_AUTH_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co/auth/v1`;

const handler = protectedResourceHandler({
  authServerUrls: [SUPABASE_AUTH_URL],
});

const corsHandler = metadataCorsOptionsRequestHandler();

export { handler as GET, corsHandler as OPTIONS };

