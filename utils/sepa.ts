// @ts-expect-error No types :(
import sepa from 'sepa'

export type SepaMemberEntry = {
  firstName: string,
  lastName: string,
  accountHolder?: string,
  iban: string,
  bic: string,
  mandate: {
    id: string,
    signatureDate: string, //YYYY-MM-DD or Date
  },
  amountInCents: number,
}

type Creditor = {
  name: string,
  iban: string,
  bic: string,
  id: string,
}

type CreateXmlForSepaPaymentArgs = {
  members: SepaMemberEntry[],
  collectionDate: Date,
  creditor: Creditor,
  notes: string,
}

export function createXmlForSepaPayment({ members, collectionDate, creditor, notes }: CreateXmlForSepaPaymentArgs): string {
  const doc = new sepa.Document();
  doc.grpHdr.id = generateId();
  doc.grpHdr.created = new Date();
  doc.grpHdr.initiatorName = creditor.name;

  const info = doc.createPaymentInfo();
  info.collectionDate = collectionDate;
  info.creditorIBAN = creditor.iban;
  info.creditorBIC = creditor.bic;
  info.creditorName = creditor.name;
  info.creditorId = creditor.id
  doc.addPaymentInfo(info);

  members.forEach(member => {
    const tx = info.createTransaction();
    tx.debtorName = member.accountHolder ?? `${member.firstName} ${member.lastName}`;
    tx.debtorIBAN = member.iban
    tx.debtorBIC = member.bic
    tx.mandateId = member.mandate.id
    tx.mandateSignatureDate = new Date(member.mandate.signatureDate);
    tx.amount = member.amountInCents / 100
    tx.remittanceInfo = notes;
    tx.end2endId = generateId()
    info.addTransaction(tx);
  })

  return doc.toString();
}

function generateId() {
  const date = new Date();
  const random = Math.random().toString(36).substring(2, 18);
  return `${date.toISOString().replace(/[-:.]/g, '').slice(0, 14)}${random}`;
}