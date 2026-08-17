"use server";

import { prisma } from "@/lib/prisma";
import { generateReservationReference } from "@/lib/reservations";
import { ActionState, Validator, todayUtc } from "@/lib/validation";

export async function submitContactMessage(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const v = new Validator(formData);
  const name = v.required("name", "Name", { max: 120 });
  const email = v.email("email", "Email", { required: true });
  const phone = v.optional("phone", "Phone", { max: 40 });
  const subject = v.required("subject", "Subject", { max: 160 });
  const message = v.required("message", "Message", { max: 4000 });

  if (v.hasErrors) {
    return { ok: false, errors: v.errors, message: "Please check the highlighted fields." };
  }

  await prisma.contactMessage.create({
    data: { name, email: email!, phone, subject, message },
  });

  return {
    ok: true,
    message: "Thank you — your message is with us. We reply to everything within one working day.",
  };
}

/**
 * A customer reserving something for a later date — normally because it was
 * sold out when they came looking.
 *
 * The product is re-read from the database rather than trusted from the form,
 * and its name and price are snapshotted so the record still makes sense after
 * the menu changes.
 */
export async function submitReservation(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const v = new Validator(formData);
  const productId = v.required("productId", "Product", { max: 60 });
  const customerName = v.required("customerName", "Name", { max: 120 });
  const customerPhone = v.phone("customerPhone", "Phone number");
  const customerEmail = v.email("customerEmail", "Email");
  const quantity = v.integer("quantity", "Quantity", { required: true, min: 1, max: 500 }) ?? 1;
  const notes = v.optional("notes", "Notes", { max: 1000 });
  const timeWindow = v.optional("timeWindow", "Time window", { max: 40 });

  // Reservations are for another day, so today is not a valid choice.
  const tomorrow = new Date(todayUtc());
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  const requestedDate = v.date("requestedDate", "Date", { required: true, notBefore: tomorrow });
  if (!v.errors.requestedDate && requestedDate && requestedDate.getTime() < tomorrow.getTime()) {
    v.errors.requestedDate = "Reservations are for a future day — please pick tomorrow or later.";
  }

  if (v.hasErrors) {
    return { ok: false, errors: v.errors, message: "Please check the highlighted fields." };
  }

  const product = await prisma.product.findFirst({
    where: { id: productId, isActive: true },
    include: { variants: true },
  });
  if (!product) {
    return { ok: false, message: "That item is no longer on the menu. Please pick another." };
  }

  const variantId = formData.get("variantId");
  const variant =
    typeof variantId === "string" && variantId
      ? product.variants.find((x) => x.id === variantId) ?? null
      : null;

  const reference = await generateReservationReference();
  await prisma.reservation.create({
    data: {
      reference,
      customerName,
      customerPhone,
      customerEmail,
      productId: product.id,
      productNameSnapshot: product.name,
      variantName: variant?.name ?? null,
      quantity,
      priceRwfAtRequest: variant?.priceRwf ?? product.priceRwf,
      requestedDate: requestedDate!,
      timeWindow,
      notes,
    },
  });

  return {
    ok: true,
    message: `Reserved — your reference is ${reference}. We will confirm on WhatsApp that it will be ready for you.`,
  };
}

export async function submitCustomCakeRequest(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const v = new Validator(formData);
  const name = v.required("name", "Name", { max: 120 });
  const phone = v.phone("phone", "Phone number");
  const email = v.email("email", "Email");
  const occasion = v.required("occasion", "Occasion", { max: 120 });
  const eventDate = v.date("eventDate", "Event date", { notBefore: todayUtc() });
  const servings = v.integer("servings", "Number of servings", { min: 1, max: 2000 });
  const flavour = v.optional("flavour", "Flavour", { max: 200 });
  const budgetRwf = v.integer("budgetRwf", "Budget", { min: 0, max: 100_000_000 });
  const description = v.required("description", "Description", { max: 4000 });

  if (v.hasErrors) {
    return { ok: false, errors: v.errors, message: "Please check the highlighted fields." };
  }

  await prisma.customCakeRequest.create({
    data: { name, phone, email, occasion, eventDate, servings, flavour, budgetRwf, description },
  });

  return {
    ok: true,
    message:
      "Got it — your request is in. We will call or WhatsApp you within one working day to talk through the design and quote it properly.",
  };
}
