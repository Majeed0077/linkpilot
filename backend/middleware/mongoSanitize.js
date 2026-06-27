const dangerousKeyPattern = /(^\$)|(\.)/;

function sanitizeValue(value) {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !dangerousKeyPattern.test(key))
        .map(([key, nestedValue]) => [key, sanitizeValue(nestedValue)])
    );
  }

  return value;
}

export function mongoSanitize(req, res, next) {
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }

  if (req.params) {
    req.params = sanitizeValue(req.params);
  }

  return next();
}
