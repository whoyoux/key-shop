import { z } from "zod";

export const stripeWebhookMedatadataSchema = z.object({
	userId: z.string(),
	orderId: z.string(),
	offerId: z.string(),
});
