// index.ts
import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import app from "./app";
import { LocAIService, type ToolMap } from "./methods";

// You may need to define this interface based on your specific environment variables
interface Env {
  [key: string]: DurableObjectNamespace<McpAgent<unknown, unknown, Record<string, unknown>>>;
  // Add your environment variables and bindings here
}

export class MyMCP extends McpAgent<Env, unknown, { apiKey: string }> {
  server = new McpServer({
    name: "Loc AI SEO Analytics",
    version: "1.0.0",
  });

  async init() {
    const service = new LocAIService(this.props.apiKey);

    // Type-safe iteration over the tools
    for (const key in service.tools) {
      const toolKey = key as keyof ToolMap;
      const tool = service.tools[toolKey];

      this.server.tool(
        tool.name,
        tool.schema, // This needs to be a valid ZodObject schema
        async (args) => {
          try {
            const result = await tool.method(args as any);
            return {
              content: [{
                type: "text",
                text: tool.formatResult(args as any, result)
              }],
            };
          } catch (error) {
            return {
              content: [{ type: "text", text: `Error: ${(error as Error).message}` }],
              isError: true,
            };
          }
        }
      );
    };
  }
}

// Export a direct handler without OAuth wrapping
export default {
  fetch: async (request: Request, env: Env, ctx: ExecutionContext): Promise<Response> => {
    // Check if the request is for the MCP endpoint
    if (request.url.includes("/sse")) {
      const apiKey = request.headers.get("Authorization")?.replace("Bearer ", "")
      return MyMCP.mount("/sse").fetch(request, env, {
        ...ctx,
        props: {
          apiKey,
        }
      });
    }

    if (request.url.includes("/mcp")) {
      const apiKey = request.headers.get("Authorization")?.replace("Bearer ", "")
      return MyMCP.serve('/mcp').fetch(request, env, {
        ...ctx,
        props: {
          apiKey,
        }
      });
    }

    // Otherwise, pass to your app
    return app.fetch(request, env, ctx);
  }
};


// import app from "./app";
// import { McpAgent } from "agents/mcp";
// import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
// import { z } from "zod";
// import OAuthProvider from "@cloudflare/workers-oauth-provider";
//
// export class MyMCP extends McpAgent {
// 	server = new McpServer({
// 		name: "Demo",
// 		version: "1.0.0",
// 	});
//
// 	async init() {
// 		this.server.tool("add", { a: z.number(), b: z.number() }, async ({ a, b }) => ({
// 			content: [{ type: "text", text: String(a + b) }],
// 		}));
// 	}
// }
//
// // Export the OAuth handler as the default
// export default new OAuthProvider({
// 	apiRoute: "/sse",
// 	// TODO: fix these types
// 	// @ts-ignore
// 	apiHandler: MyMCP.mount("/sse"),
// 	// @ts-ignore
// 	defaultHandler: app,
// 	authorizeEndpoint: "/authorize",
// 	tokenEndpoint: "/token",
// 	clientRegistrationEndpoint: "/register",
// });
