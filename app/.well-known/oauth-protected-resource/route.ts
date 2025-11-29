import {
  protectedResourceHandler,
  metadataCorsOptionsRequestHandler,
} from "mcp-handler";
import { SUPABASE_AUTH_URL } from "@/lib/env";

const handler = protectedResourceHandler({
  authServerUrls: [SUPABASE_AUTH_URL],
});

const corsHandler = metadataCorsOptionsRequestHandler();

export { handler as GET, corsHandler as OPTIONS };

