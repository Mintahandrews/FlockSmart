import { FlockGroup } from "../types";

export const getHealthAssessment = (flock: FlockGroup): string => {
  // Base assessment on multiple factors
  const assessments: string[] = [];

  // Age-based assessment
  if (flock.ageWeeks < 4) {
    assessments.push(
      "Young flock requires careful monitoring and temperature control."
    );
  } else if (flock.ageWeeks > 52) {
    assessments.push(
      "Older flock may need additional nutritional supplements."
    );
  }

  // Health status assessment
  switch (flock.healthStatus) {
    case "Excellent":
      assessments.push(
        "Flock is in optimal health. Maintain current care routine."
      );
      break;
    case "Good":
      assessments.push(
        "Flock is healthy. Monitor for any changes in behavior or appetite."
      );
      break;
    case "Fair":
      assessments.push(
        "Health concerns detected. Implement preventative measures and increase monitoring frequency."
      );
      break;
    case "Poor":
      assessments.push(
        "Immediate veterinary attention recommended. Isolate affected birds if necessary."
      );
      break;
  }

  // Weight-based assessment
  if (flock.avgWeight > 0) {
    const expectedWeight = getExpectedWeight(flock.birdType, flock.ageWeeks);
    if (flock.avgWeight < expectedWeight * 0.9) {
      assessments.push(
        "Average weight is below target. Review nutrition and feeding practices."
      );
    } else if (flock.avgWeight > expectedWeight * 1.1) {
      assessments.push(
        "Average weight is above target. Adjust feed portions accordingly."
      );
    }
  }

  return assessments.join("\n");
};

// Helper function to determine expected weight based on bird type and age
const getExpectedWeight = (birdType: string, ageWeeks: number): number => {
  switch (birdType) {
    case "Layer":
      return ageWeeks < 20 ? 1.5 : 2.0;
    case "Broiler":
      return ageWeeks < 8 ? 2.5 : 3.5;
    case "Dual Purpose":
      return ageWeeks < 16 ? 2.0 : 3.0;
    default:
      return 2.0;
  }
};
