/**
 * Shared Admin form validation. Each validator returns `null` when the value
 * is valid, or a user-facing error string when it isn't — the same
 * `errors` state pattern already used by the public contact form
 * (src/pages/Contact.jsx's validate()), reused here instead of inventing a
 * second convention.
 *
 * These are a client-side convenience only. The authoritative limits are
 * re-checked server-side in backend/models/CmsConfig.php::saveDraft() —
 * never trust the frontend check alone for anything that matters.
 */

export const validateRequired = (value, label = 'This field') => {
  if (value === undefined || value === null || String(value).trim() === '') {
    return `${label} is required.`;
  }
  return null;
};

export const validateMaxLength = (value, max, label = 'This field') => {
  if (!value) return null;
  if (String(value).length > max) {
    return `${label} must be ${max} characters or fewer (currently ${String(value).length}).`;
  }
  return null;
};

export const validateMaxLines = (value, max, label = 'This field') => {
  if (!value) return null;
  const lines = String(value).split('\n').length;
  if (lines > max) {
    return `${label} must be ${max} lines or fewer (currently ${lines}).`;
  }
  return null;
};

export const validateUrl = (value, label = 'URL') => {
  if (!value) return null;
  const v = String(value).trim();
  // Accept absolute URLs, root-relative paths, and in-page anchors —
  // everything this CMS actually uses for button/nav links.
  if (/^(https?:\/\/|\/|#)/i.test(v)) return null;
  return `${label} must start with http://, https://, or /.`;
};

export const validateEmail = (value, label = 'Email') => {
  if (!value) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim())) {
    return `${label} must be a valid email address.`;
  }
  return null;
};

export const validatePhone = (value, label = 'Phone number') => {
  if (!value) return null;
  // Deliberately permissive — international formats vary widely (spaces,
  // dashes, parentheses, leading +). Just reject obvious garbage.
  if (!/^[+\d][\d\s()\-./]{5,24}$/.test(String(value).trim())) {
    return `${label} doesn't look like a valid phone number.`;
  }
  return null;
};

/**
 * Run a list of [value, validators[]] pairs and return the first error
 * found, or null if everything passes. Lets a form collect several field
 * checks in one call instead of chaining ifs by hand.
 *
 * Example:
 *   const error = runValidators([
 *     [name, [v => validateRequired(v, 'Name'), v => validateMaxLength(v, 30, 'Name')]],
 *     [path, [v => validateRequired(v, 'Link'), v => validateUrl(v, 'Link')]],
 *   ]);
 */
export const runValidators = (fields) => {
  for (const [value, validators] of fields) {
    for (const validator of validators) {
      const error = validator(value);
      if (error) return error;
    }
  }
  return null;
};

// Shared length/line limits, matching the numbers in the CMS feature request.
export const LIMITS = {
  NAV_LABEL: 30,
  BUTTON_TEXT: 30,
  HERO_HEADING: 80,
  HERO_HEADING_LINES: 2,
  HERO_SUBTITLE_LINES: 20,
  CARD_TITLE: 60,
  CARD_DESCRIPTION: 300
};
