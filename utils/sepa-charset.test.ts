import { describe, it, expect } from 'vitest'
import { sanitizeSepa, isSepaCharset } from './sepa-charset'

describe('isSepaCharset', () => {
  it('returns true for a plain ASCII name', () => {
    expect(isSepaCharset('Mueller Gross')).toBe(true)
  })

  it('returns false for a name containing an umlaut', () => {
    expect(isSepaCharset('Müller')).toBe(false)
  })

  it('returns false for sharp-s', () => {
    expect(isSepaCharset('Groß')).toBe(false)
  })

  it('returns true for all allowed special characters', () => {
    expect(isSepaCharset('a-z A-Z 0-9 /.:,()+\'-?')).toBe(true)
  })
})

describe('sanitizeSepa', () => {
  it('transliterates German umlauts (ae/oe/ue convention)', () => {
    expect(sanitizeSepa('Müller')).toBe('Mueller')
    expect(sanitizeSepa('Größe')).toBe('Groesse')
    expect(sanitizeSepa('Überführung')).toBe('Ueberfuehrung')
  })

  it('transliterates uppercase umlauts (Ü->Ue, Ö->Oe, Ä->Ae digraph convention)', () => {
    // EPC217-08 maps each umlaut to a two-char digraph: Ü->Ue, Ö->Oe, Ä->Ae
    expect(sanitizeSepa('MÜNCHEN')).toBe('MUeNCHEN')
    expect(sanitizeSepa('KÖLN')).toBe('KOeLN')
  })

  it('transliterates sharp-s to ss', () => {
    expect(sanitizeSepa('Weiß')).toBe('Weiss')
    expect(sanitizeSepa('Straße')).toBe('Strasse')
  })

  it('handles a typical German full name with umlauts', () => {
    expect(sanitizeSepa('Müller Groß')).toBe('Mueller Gross')
  })

  it('passes through already-valid SEPA characters unchanged', () => {
    expect(sanitizeSepa('Max Mustermann')).toBe('Max Mustermann')
  })

  it('collapses multiple spaces into one', () => {
    expect(sanitizeSepa('Max   Mustermann')).toBe('Max Mustermann')
  })

  it('trims leading and trailing spaces', () => {
    expect(sanitizeSepa('  Hans  ')).toBe('Hans')
  })

  it('drops characters with no transliteration mapping', () => {
    // em dash and other characters not in the SEPA charset and not in the map
    expect(sanitizeSepa('Muster—Mann')).toBe('MusterMann')
  })

  it('transliterates accented letters from other languages', () => {
    expect(sanitizeSepa('Francois')).toBe('Francois')
    expect(sanitizeSepa('René')).toBe('Rene')
    expect(sanitizeSepa('Björn')).toBe('Bjoern')
  })

  it('preserves allowed special characters', () => {
    expect(sanitizeSepa('Smith & Co.')).toBe('Smith  Co.')
    expect(sanitizeSepa('Test/Payment')).toBe('Test/Payment')
  })

  it('produces only SEPA-charset characters in the result', () => {
    const nasty = 'Müller & Söhne GmbH — Überweisung für Jährliches Beitrag'
    const result = sanitizeSepa(nasty)
    expect(isSepaCharset(result)).toBe(true)
  })

  it('returns an empty string for a string with only non-SEPA characters', () => {
    // Emoji and CJK characters have no mapping and are dropped
    expect(sanitizeSepa('\u{1F600}\u{1F4B3}')).toBe('')
  })
})
