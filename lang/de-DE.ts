import type { LOCALE } from "./en-US.js"

export default defineI18nLocale<LOCALE>(async locale => {
  return {
    app: {
      title: 'Vereinsmanager',
    },
    basic: {
      name: 'Name',
      firstName: 'Vorname',
      lastName: 'Nachname',
      gender: 'Geschlecht',
      company: 'Firma',
      birthDate: 'Geburtsdatum',
      phone: 'Telefon',
      email: 'Email',
      optional: 'optional',
      notes: 'Notizen',
      submit: 'Speichern',
      display: 'Anzeigen',
      preview: 'Vorschau',
      home: 'Startseite',
      finances: 'Finanzen',
      yes: 'Ja',
      no: 'Nein',
      genderOptions: {
        'no-answer': 'Keine Angabe',
        male: 'Männlich',
        female: 'Weiblich',
        other: 'Andere',
      }
    },
    address: {
      address: 'Adresse',
      streetAndHouseNumber: 'Straße und Hausnummer',
      zip: 'Postleitzahl',
      city: 'Stadt',
      country: 'Land',
      state: 'Bundesland'
    },
    membership: {
      member: 'Mitglied | Mitglieder',
      membership: 'Mitgliedschaft',
      id: 'Mitgliedernummer',
      joinDate: 'Beitrittsdatum',
      leaveDate: 'Austrittsdatum',
      view: '@:membership.member anzeigen',
      create: 'Neues Mitglied hinzufügen',
      total: {
        heading: 'Mitglieder insgesamt',
        description: 'Es sind derzeit {n} Mitglieder im System hinterlegt.'
      }
    },
    payment: {
      role: {
        role: 'Beitragsgruppe | Beitragsgruppen',
        create: 'Neue Beitragsgruppe anlegen',
        amount: 'Beitrag',
        amountForThisPayment: '@:payment.role.amount für diese Zahlung',
        perMonth: '(pro Monat)',
      },
      type: {
        type: 'Zahlungsart',
        cash: 'Bargeld/Anderes',
        sepa: 'Bankeinzug',
        accountHolder: 'Kontoinhaber',
        iban: 'IBAN',
        bic: 'BIC',
        mandateId: 'Mandatsreferenz',
        mandateDate: 'Datum der Mandatsunterzeichnung',
      },
      payment: 'Zahlung | Zahlungen',
      schedule: {
        schedule: 'Zahlungsintervall',
        options: {
          monthly: 'Monatlich',
          quarterly: 'Vierteljährlich',
          'half-yearly': 'Halbjährlich',
          yearly: 'Jährlich',
        }
      },
      misc: {
        collectionAt: 'Einzug am',
        hasPaid: 'Hat Bezahlt?',
        actions: 'Aktionen',
      },
      state: {
        mark: {
          paid: 'Als bezahlt markieren',
          unpaid: 'Als unbezahlt markieren',
        },
        sepaPayees: 'Markiere alle SEPA-Zahler als bezahlt',
      },
      sepa: {
        download: 'SEPA-Datei herunterladen',
      },
      create: 'Neue Zahlung anlegen',
      firstStartDate: 'Erstes Zahlungsdatum',
      collectionDate: 'Einzugstermin',
      page: {
        finances: {
          about: {
            payments: 'Hier können Sie Zahlungen ihrer Mitglieder verwalten. Sie können Zahlungen hinzufügen, bearbeiten und löschen. Sie können auch SEPA-Dateien herunterladen, um per Bankprogramm einen Einzug vorzunehmen.',
            roles: 'Hier können Sie Beitragsgruppen anlegen und bearbeiten. Beitragsgruppen sind Gruppen von Mitgliedern, die den gleichen Beitrag zahlen.',
          },
          to: {
            payments: 'Zu den Zahlungen',
            roles: 'Zu den Beitragsgruppen',
          }
        }
      }
    }
  }
})