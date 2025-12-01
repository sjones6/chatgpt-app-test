import { baseURL } from "@/baseUrl";
import type { AuthInfo } from "@modelcontextprotocol/sdk/server/auth/types.js";
import { createMcpHandler, withMcpAuth } from "mcp-handler";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const verifyToken = async (
  req: Request,
  bearerToken?: string
): Promise<AuthInfo | undefined> => {
  if (!bearerToken) return undefined;

  const supabase = await createClient();
  
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(bearerToken);

    if (error || !user) return undefined;

    return {
      token: bearerToken,
      scopes: ["read:stuff"],
      clientId: user.id,
      extra: {
        userId: user.id,
        email: user.email,
      },
    };
  } catch {
    return undefined;
  }
};

const getAppsSdkCompatibleHtml = async (url: URL, init?: RequestInit) => {
  console.log("endpoint", url.toString());
  const result = await fetch(url, init);
  console.log("result status", result.status);
  return await result.text();
};

type ContentWidget = {
  id: string;
  title: string;
  templateUri: string;
  invoking: string;
  invoked: string;
  html: string;
  description: string;
  widgetDomain: string;
};

function widgetMeta(widget: ContentWidget) {
  return {
    "openai/outputTemplate": widget.templateUri,
    "openai/toolInvocation/invoking": widget.invoking,
    "openai/toolInvocation/invoked": widget.invoked,
    "openai/widgetAccessible": false,
    "openai/resultCanProduceWidget": true,
  } as const;
}

const handler = (request: Request) => {
  return createMcpHandler(async (server) => {

    if (!request.auth) {
      return {
        error: "Unauthorized",
      };
    }

    const html = await getAppsSdkCompatibleHtml(new URL("/chatgpt", baseURL), {
      headers: {
        Authorization: `Bearer ${request.auth.token}`,
      },
    });
    console.log("loaded html");
    console.log(html);
    
    const contentWidget: ContentWidget = {
      id: "show_content",
      title: "Show Content",
      templateUri: "ui://widget/content-template.html",
      invoking: "Loading content...",
      invoked: "Content loaded",
      html: html,
      description: "Displays the homepage content",
      widgetDomain: "https://nextjs.org/docs",
    };
    server.registerResource(
      "content-widget",
      contentWidget.templateUri,
      {
        title: contentWidget.title,
        description: contentWidget.description,
        mimeType: "text/html+skybridge",
        _meta: {
          "openai/widgetDescription": contentWidget.description,
          "openai/widgetPrefersBorder": true,
        },
      },
      async (uri) => ({
        contents: [
          {
            uri: uri.href,
            mimeType: "text/html+skybridge",
            text: `<html>${contentWidget.html}</html>`,
            _meta: {
              "openai/widgetDescription": contentWidget.description,
              "openai/widgetPrefersBorder": true,
              "openai/widgetDomain": contentWidget.widgetDomain,
            },
          },
        ],
      })
    );
  
    server.registerTool(
      contentWidget.id,
      {
        title: contentWidget.title,
        description:
          "Fetch and display the homepage content with the name of the user",
        inputSchema: {
          name: z.string().describe("The name of the user to display on the homepage"),
        },
        _meta: widgetMeta(contentWidget),
      },
      async ({ name }) => {
        console.log("calling tool", name);
        return {
          content: [
            {
              type: "text",
              text: `Hello, ${name}!`,
            },
          ],
          structuredContent: {
            name: name,
            timestamp: new Date().toISOString(),
          },
          _meta: widgetMeta(contentWidget),
        };
      }
    );
  })(request);
};

const authHandler = withMcpAuth(handler, verifyToken, {
  required: true,
});

export const GET = authHandler;
export const POST = authHandler;
