* CRUD around members
  * Name, join date, leave date, ...
  * Member status/roles (groups you can configure)
* Finances
  * Fee/Payment for each member role
  * SEPA XML export for monthly/quarterly/half a year/yearly
    * Save payment data with users + roles back then
    * Immutable payment data in the DB
  * Payment Roles:
    * Name + ID
    * Amount
  * Payment Schedule: How often (monthly, quarterly, half a year, yearly, none at all [if no amount set])

* i18n
  * Static but needed

* Import old data
  * CSV import to update member roles (Firstname, Lastname, DOB if duplicates, new role) => update member role

* Auth: Basic Auth (h3-basic-auth)
  * Later on: proper user auth

Tech:

* Member data saved in D1 (CF)
  * Same for "payment data"
  * Validate IBAN via [this package](https://github.com/Simplify/ibantools).
  * Create Direct Debit XML through [sepa package](https://www.npmjs.com/package/sepa#creating-an-xml-directdebit-document)
---

Future:
  * Conditions to update member roles (e.g. after 1 year, or certain age)