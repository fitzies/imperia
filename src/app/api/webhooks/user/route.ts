import type { WebhookEvent } from "@clerk/clerk-sdk-node";

const handler = async (req: Request | any) => {
  const evt = req.body.evt as WebhookEvent;
  switch (evt.type) {
    case "user.created": // this is typed
      evt.data; // this is also typed
  }
};

export { handler as POST };
