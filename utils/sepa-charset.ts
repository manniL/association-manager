/**
 * Sanitization helpers for the EPC217-08 SEPA basic character set.
 *
 * SEPA XML fields such as party names (<Nm>) and remittance information
 * (<Ustrd>) must contain only characters from the EPC217-08 set:
 *   a-z A-Z 0-9 space / - ? : ( ) . , ' +
 *
 * German banks (and most European clearing systems) reject or mangle SEPA
 * files that contain characters outside this set. Characters such as umlauts
 * (ae, oe, ue) and sharp-s (ss) must be transliterated before the XML is
 * built; anything else that cannot be mapped is silently dropped.
 */

/** Allowed characters in the EPC217-08 SEPA basic character set. */
const SEPA_ALLOWED = /^[a-zA-Z0-9 /\-?:().,'+]*$/

/**
 * Returns true when every character in value is in the EPC217-08 set.
 * An empty string is considered valid (callers enforce minimum length separately).
 */
export function isSepaCharset(value: string): boolean {
  return SEPA_ALLOWED.test(value)
}

/**
 * Transliteration table: extended Latin characters -> EPC217-08 equivalents.
 *
 * Conventions:
 * - German umlauts use the ae/oe/ue digraph (Ä -> Ae, ö -> oe, etc.)
 * - German sharp-s -> ss
 * - All other accented/modified Latin letters -> unaccented base letter
 * - Ligatures: Æ/æ -> AE/ae
 * - Nordic eth (Ð/ð) -> D/d; thorn (Þ/þ) -> TH/th
 * - Characters with no mapping are silently dropped by sanitizeSepa
 *
 * Full coverage of Latin-1 Supplement (U+00C0-U+00FF) except multiplication (x) and division (/) operators.
 */
const TRANSLITERATION_MAP: Record<string, string> = {
  // German umlauts and sharp-s (ae/oe/ue convention per EPC217-08 guidance)
  ä: 'ae',
  ö: 'oe',
  ü: 'ue',
  Ä: 'Ae',
  Ö: 'Oe',
  Ü: 'Ue',
  ß: 'ss',
  // Accented A (grave, acute, circumflex, tilde, ring) -> base letter
  à: 'a',
  á: 'a',
  â: 'a',
  ã: 'a',
  å: 'a',
  À: 'A',
  Á: 'A',
  Â: 'A',
  Ã: 'A',
  Å: 'A',
  // AE ligature
  æ: 'ae',
  Æ: 'AE',
  // C-cedilla
  ç: 'c',
  Ç: 'C',
  // Accented E (grave, acute, circumflex, diaeresis) -> base letter
  è: 'e',
  é: 'e',
  ê: 'e',
  ë: 'e',
  È: 'E',
  É: 'E',
  Ê: 'E',
  Ë: 'E',
  // Accented I (grave, acute, circumflex, diaeresis) -> base letter
  ì: 'i',
  í: 'i',
  î: 'i',
  ï: 'i',
  Ì: 'I',
  Í: 'I',
  Î: 'I',
  Ï: 'I',
  // Eth (Icelandic/Old English) -> D/d
  ð: 'd',
  Ð: 'D',
  // N-tilde -> base letter
  ñ: 'n',
  Ñ: 'N',
  // Accented O (grave, acute, circumflex, tilde, stroke) -> base letter
  ò: 'o',
  ó: 'o',
  ô: 'o',
  õ: 'o',
  ø: 'o',
  Ò: 'O',
  Ó: 'O',
  Ô: 'O',
  Õ: 'O',
  Ø: 'O',
  // Accented U (grave, acute, circumflex) -> base letter; umlaut uses ue convention above
  ù: 'u',
  ú: 'u',
  û: 'u',
  Ù: 'U',
  Ú: 'U',
  Û: 'U',
  // Accented Y -> base letter
  ý: 'y',
  ÿ: 'y',
  Ý: 'Y',
  // Thorn (Old English/Icelandic) -> TH/th
  þ: 'th',
  Þ: 'TH',
}

/**
 * Sanitize a string to the EPC217-08 SEPA basic character set.
 *
 * 1. Transliterates known extended Latin characters (umlauts, accented letters).
 * 2. Removes any remaining character not in the allowed set.
 * 3. Collapses multiple consecutive spaces into one and trims leading/trailing whitespace.
 *
 * Use this on every party name (Nm) and remittance information (Ustrd) field
 * before passing the value to sepa.js, because sepa.js does not perform this
 * transliteration itself.
 */
export function sanitizeSepa(value: string): string {
  let result = ''
  for (const ch of value) {
    if (SEPA_ALLOWED.test(ch)) {
      result += ch
    } else {
      const mapped = TRANSLITERATION_MAP[ch]
      if (mapped !== undefined) {
        result += mapped
      }
      // else: silently drop the character (no SEPA equivalent)
    }
  }
  // Collapse multiple spaces, trim leading/trailing whitespace
  return result.replace(/ {2,}/g, ' ').trim()
}
