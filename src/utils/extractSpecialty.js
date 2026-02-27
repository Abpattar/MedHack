export function extractSpecialty(text) {
  const input = text.toLowerCase()

  if (input.includes("throat") || input.includes("ear") || input.includes("cough")) {
    return "ENT"
  }

  if (input.includes("knee") || input.includes("bone") || input.includes("fracture")) {
    return "Orthopedic"
  }

  if (input.includes("chest") || input.includes("heart")) {
    return "Cardiologist"
  }

  if (input.includes("skin") || input.includes("rash")) {
    return "Dermatologist"
  }

  return "General Physician"
}
