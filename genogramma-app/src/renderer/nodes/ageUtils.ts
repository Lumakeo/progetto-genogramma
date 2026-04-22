export function calcAge(birthYear?: string): number | null {
  if (!birthYear) return null
  const y = parseInt(birthYear)
  return isNaN(y) || y <= 0 ? null : new Date().getFullYear() - y
}

export function calcAgeAtDeath(birthYear?: string, deathYear?: string): number | null {
  if (!birthYear || !deathYear) return null
  const by = parseInt(birthYear), dy = parseInt(deathYear)
  return isNaN(by) || isNaN(dy) ? null : dy - by
}
