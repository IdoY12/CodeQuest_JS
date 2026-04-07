export function mapExperienceToPath(experience: string | null | undefined): "BEGINNER" | "ADVANCED" {
  if (!experience) return "BEGINNER";
  return experience === "BEGINNER" || experience === "BASICS" || experience === "JUNIOR" || experience === "MID" ? "BEGINNER" : "ADVANCED";
}
