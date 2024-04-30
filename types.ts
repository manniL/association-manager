import type { z } from "zod";

export type TransformedMember = z.output<typeof memberFormSchema>
export type TransformedMemberWithId = TransformedMember & { id: number }