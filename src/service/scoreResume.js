export function calculateResumeScore(data) {

  let score = 0;

  // Name
  if (
    data.name &&
    data.name.length > 2
  ) {
    score += 10;
  }

  // Skills
  if (
    data.skills &&
    data.skills.length > 10
  ) {
    score += 20;
  }

  // Experience
  if (
    data.experience &&
    data.experience.length > 20
  ) {
    score += 20;
  }

  // Education
  if (
    data.education &&
    data.education.length > 5
  ) {
    score += 15;
  }

  // Summary
  if (
    data.summary &&
    data.summary.length > 30
  ) {
    score += 15;
  }

  // ATS Keywords
  const atsKeywords = [
    "React",
    "JavaScript",
    "Teamwork",
    "Leadership",
    "Communication",
    "Problem Solving",
  ];

  let keywordCount = 0;

  atsKeywords.forEach((word) => {

    if (
      JSON.stringify(data)
        .toLowerCase()
        .includes(word.toLowerCase())
    ) {
      keywordCount++;
    }

  });

  score += keywordCount * 3;

  if (score > 100) {
    score = 100;
  }

  return score;
}