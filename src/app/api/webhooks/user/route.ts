import { headers } from "next/headers";
import { Webhook } from "svix";

async function handler(request: Request) {
  const payload = await request.json();
  const headersList = headers();
  const heads = {
    "svix-id": headersList.get("svix-id"),
    "svix-timestamp": headersList.get("svix-timestamp"),
    "svix-signature": headersList.get("svix-signature"),
  };

  const wh = new Webhook(JSON.stringify(payload), heads);
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
