export function mapExperienceToPath(experience: string | null | undefined): "BEGINNER" | "ADVANCED" {
  if (!experience) return "BEGINNER";
  return experience === "BEGINNER" || experience === "BASICS" ? "BEGINNER" : "ADVANCED";
}
