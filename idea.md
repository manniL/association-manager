* Fix Auth

* Migration from CSV to feed to DB
* i18n (manual work)
* Creditor details (env variables or KV entry)
* Delete options in general
* Delete Payment (super dangerous operation) [soft delete]
* Investigate bug to remove join date, leave date
* Payment Preview
* Offer Single Download for XMLs
* Member pagination

* Import old data
  * CSV import to update member roles (Firstname, Lastname, DOB if duplicates, new role) => update member role

Tech:

* Member data saved in D1 (CF)
  * Same for "payment data"
  * Validate IBAN via [this package](https://github.com/Simplify/ibantools).
  * Get BIC from IBAN via ???
  * Create Direct Debit XML through [sepa package](https://www.npmjs.com/package/sepa#creating-an-xml-directdebit-document)
---

Future:
  * Conditions to update member roles (e.g. after 1 year, or certain age)
  * Start for Fiscal Year
  * Prorate mid-year/month/... joiners
  * Set up timezone to use for all dates

more:

* "Breaks" for members (multiple join/leave dates)