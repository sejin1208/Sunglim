import { pgTable, text, serial, timestamp, date } from "drizzle-orm/pg-core";

export const deliveryCasesTable = pgTable("delivery_cases", {
  id: serial("id").primaryKey(),
  schoolName: text("school_name").notNull(),
  deliveryDate: text("delivery_date").notNull(),
  modelNames: text("model_names").notNull(),
  imageUrl: text("image_url"),
  note: text("note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type DeliveryCase = typeof deliveryCasesTable.$inferSelect;
