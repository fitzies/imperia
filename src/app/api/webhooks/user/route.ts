//ignore typescript
// @ts-nocheck
import type { User } from "@clerk/nextjs/api";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";

type UnwantedKeys =
  | "emailAddresses"
  | "firstName"
  | "lastName"
  | "primaryEmailAddressId"
  | "primaryPhoneNumberId"
  | "phoneNumbers";

interface UserInterface extends Omit<User, UnwantedKeys> {
  email_addresses: {
    email_address: string;
    id: string;
  }[];
  primary_email_address_id: string;
  first_name: string;
  last_name: string;
  primary_phone_number_id: string;
  phone_numbers: {
    phone_number: string;
    id: string;
  }[];
}

// const webhookSecret: string = process.env.WEBHOOK_SECRET || "";
const webhookSecret = "whsec_d68QWTo64dQyP97L++bkQ5qJaCbASlR0";

export async function POST(req) {
  const payload = await req.json();
  const payloadString = JSON.stringify(payload);
  const headerPayload = headers();
  const svixId = headerPayload.get("svix-id");
  const svixIdTimeStamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");
  if (!svixId || !svixIdTimeStamp || !svixSignature) {
    console.log("svixId", svixId);
    console.log("svixIdTimeStamp", svixIdTimeStamp);
    console.log("svixSignature", svixSignature);
    return new Response("Error occured", {
      status: 400,
    });
  }
  const svixHeaders = {
    "svix-id": svixId,
    "svix-timestamp": svixIdTimeStamp,
    "svix-signature": svixSignature,
  };
  const wh = new Webhook(webhookSecret);
  let evt: Event | null = null;
  try {
    evt = wh.verify(payloadString, svixHeaders) as Event;
  } catch (_) {
    console.log("error");
    return new Response("Error occured", {
      status: 400,
    });
  }
  const { id, email_addresses, first_name } = evt.data;
  // Handle the webhook
  const eventType: EventType = evt.type;
  if (eventType === "user.created" || eventType === "user.updated") {
    const { email_addresses, primary_email_address_id } = evt.data;
    const emailObject = email_addresses?.find((email) => {
      return email.id === primary_email_address_id;
    });
    if (!emailObject) {
      return new Response("Error locating user", {
        status: 400,
      });
    }
    console.log("doing something");
  }

  const email_address: string = email_addresses[0].email_address;
  const name: string = first_name;

  console.log(email_address, name);

  let user = await prisma.user.findFirst({ where: { externalId: id } });

  if (!user) {
    user = await prisma.user.create({
      data: { externalId: id, email: email_address, name: name },
    });
  } else if (user) {
    user = await prisma.user.update({
      where: { externalId: id },
      data: { email: email_address, name: name },
    });
  }

  return new Response(user, {
    status: 201,
  });
}

type Event = {
  data: UserInterface;
  object: "event";
  type: EventType;
};

type EventType = "user.created" | "user.updated" | "*";
