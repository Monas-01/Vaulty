import { serve } from "inngest/next";

import { inngest } from "@/lib/inngest/client";
import { checkWarrantyReminders, keepDatabaseAlive } from "@/lib/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [checkWarrantyReminders, keepDatabaseAlive],
});
