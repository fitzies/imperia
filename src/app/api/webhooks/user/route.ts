import type { WebhookEvent } from "@clerk/clerk-sdk-node";
import { Webhook } from "svix";
import { buffer } from "micro";
import { NextRequest, NextResponse } from "next/server";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

const secret = "whsec_d68QWTo64dQyP97L++bkQ5qJaCbASlR0";

async function handler(req: Request, res: Response) {
  //@ts-ignore
  const payload = (await buffer(req)).toString();
  const headers = req.headers;

  const wh = new Webhook(secret);
  let msg;
  try {
    //@ts-ignore
    msg = wh.verify(payload, headers);
    return NextResponse.json({ msg });
  } catch (err) {
    // res.status(400).json({});
    return NextResponse.json({ err });
  }

  // Do something with the message...

  // res.json({});
}

export { handler as POST, handler as GET, handler as PUT, handler as handler };
