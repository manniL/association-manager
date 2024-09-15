import csv from "csvtojson";
import { z } from "zod";
import { $fetch } from "ofetch";

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  gender: z.enum(["male", "female"]),
  membershipId: z.string().min(1),
  company: z.string().optional(),
  address: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    zip: z.string().min(1),
    state: z.string().optional(),
    country: z.string().optional(), // TODO: List
  }),
  joinDate: z.coerce.date().optional(), // TODO: pipe to avoid null/invalid
  leaveDate: z.coerce.date().optional(),
  birthDate: z.coerce.date().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  notes: z.string().optional(),
  paymentRole: z.string(), // TODO: Make more strict?
  paymentSchedule: z.enum(["half-yearly", "yearly"]),
  payment: z.discriminatedUnion("type", [
    z.object({
      type: z.literal("SEPA"),
      data: z.object({
        accountHolder: z.string().optional(),
        iban: z.string(), // Use ibantools
        bic: z.string(), // To validate / infer "somehow"
        mandateId: z.string(),
        mandateDate: z.coerce.date(),
      }),
    }),
    z.object({
      type: z.literal("CASH"),
      data: z.object({}),
    }),
  ]),
});

type ValidMember = z.infer<typeof schema>;

async function run() {
  const members = await getMembersWithNewStatus();
  members.forEach((member) => {
    const result = schema.safeParse(member);
    if (!result.success) {
      console.error(
        "Failed to validate member " + member.firstName + " " + member.lastName
      );
      console.error(result.error.errors);
    }
  });
  await submitNewMembers(members);
}

async function getCurrentMembersWithOldStatus(): Promise<ValidMember[]> {
  const members = await csv().fromFile("./scripts/members-all-old-status.csv");
  return members.map((member: Record<string, any>): ValidMember => {
    return {
      email: member["email"] || undefined,
      firstName: member["firstName"],
      lastName: member["lastName"],
      membershipId: member["membershipNumber"],
      gender: member["sex"] === "männlich" ? "male" : "female",
      address: {
        street: `${member["street"]} ${member["streetNumber"]}`,
        zip: member["zip"],
        city: member["city"],
        country: member["country"],
      },
      joinDate: member["joinDate"]
        ? new Date(member["joinDate"].split(".").reverse().join("-"))
        : undefined,
      leaveDate: member["leaveDate"]
        ? new Date(member["leaveDate"].split(".").reverse().join("-"))
        : undefined,
      birthDate: member["birthday"]
        ? new Date(member["birthday"].split(".").reverse().join("-"))
        : undefined,
      phone: member["phone"],
      notes: member["notes"],
      // @ts-ignore
      paymentRole: "BLANK-FIX-THIS",
      payment: getPaymentForOldMember(member),
      paymentSchedule: member["paymentTime"] === 2 ? "half-yearly" : "yearly",
    };
  });
}

function getPaymentForOldMember(
  member: Record<string, any>
): ValidMember["payment"] {
  if (member["paymentType"] === "SEPA") {
    return {
      type: "SEPA",
      data: {
        accountHolder: member["accountHolder"],
        iban: member["iban"],
        bic: member["bic"],
        mandateId: member["mandateId"],
        mandateDate: new Date(member["mandateDate"]),
      },
    };
  }
  return {
    type: "CASH",
    data: {},
  };
}

async function getMembersWithNewStatus(): Promise<ValidMember[]> {
  const members = await csv({ delimiter: ";" }).fromFile(
    "./scripts/members-new-status.csv"
  );
  const memberLookup = Object.fromEntries(
    members.map((member: Record<string, any>) => [
      member.membershipId,
      paymentRoleForStatusNumber(member.Status),
    ])
  );
  return (await getCurrentMembersWithOldStatus()).map((member) => {
    return {
      ...member,
      paymentRole: String(memberLookup[member.membershipId] ?? 1), // default for ppl who left
    };
  });
}

function paymentRoleForStatusNumber(status: string) {
  status = status.toLocaleLowerCase().trim();
  if (status === "ah") {
    return 1;
  }
  if (status.includes("azubi")) {
    return 2;
  }
  if (status === "fördermitglied") {
    return 3;
  }
  if (status === "kinder") {
    return 4;
  }
  if (status === "männer") {
    return 5;
  }
  if (status === "passiv") {
    return 6;
  }
  if (status === "rentner") {
    return 7;
  }
  if (status === "schiri") {
    return 8;
  }
  throw new Error(`Unknown status: ${status}`);
}

async function submitNewMembers(members: ValidMember[]) {
  const memberIndexToContinueFrom = members.findIndex(m => m.membershipId === "0255-DOPPELT")
  for (let member of members.slice(memberIndexToContinueFrom)) {
    console.log(`Submitting member ${member.firstName} ${member.lastName}`);
    try {
      await $fetch("https://sve-new.developmint.de/api/members", {
        method: "POST",
        body: member,
      });
      console.log(`Submitted member ${member.firstName} ${member.lastName}`);
    } catch (e: any) {
      console.error(
        `Failed to submit member ${member.firstName} ${member.lastName}`
      );
      console.log(e.data);
      break;
    }
  }
}

(() => run())();
