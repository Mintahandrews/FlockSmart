export const getRecommendedFeed = (
  birdType: string,
  ageWeeks: number
): string => {
  // Base recommendations by bird type and age
  if (birdType === "Layer") {
    if (ageWeeks < 8) {
      return "Chick starter feed with 20-22% protein";
    } else if (ageWeeks < 18) {
      return "Grower feed with 16-18% protein";
    } else {
      return "Layer feed with 16-18% protein and added calcium";
    }
  } else if (birdType === "Broiler") {
    if (ageWeeks < 3) {
      return "Broiler starter feed with 22-24% protein";
    } else if (ageWeeks < 6) {
      return "Broiler grower feed with 20-22% protein";
    } else {
      return "Broiler finisher feed with 18-20% protein";
    }
  } else {
    // Default recommendation for other bird types
    if (ageWeeks < 8) {
      return "Starter feed with 20-22% protein";
    } else if (ageWeeks < 18) {
      return "Grower feed with 16-18% protein";
    } else {
      return "Adult feed with 16-18% protein";
    }
  }
};
