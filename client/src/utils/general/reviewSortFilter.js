export const reviewSortFilter = (filter, reviews) => {
  const newReviews = [...reviews];
  const filteredReviews = newReviews?.sort((firstReview, secondReview) => {
    // Sorting reviews in descending order based on review updated date
    if (filter === "new") {
      return (
        new Date(secondReview?.updatedAt).getTime() -
        new Date(firstReview?.updatedAt).getTime()
      );
    } else if (filter === "old") {
      // Sorting reviews in ascending order based on review updated date
      return (
        new Date(firstReview?.updatedAt).getTime() -
        new Date(secondReview?.updatedAt).getTime()
      );
    } else if (filter === "low") {
      // Sorting reviews in ascending order based on rating
      return firstReview?.rating - secondReview?.rating;
    } else if (filter === "high") {
      // Sorting reviews in descending order based on rating
      return secondReview?.rating - firstReview?.rating;
    }
  });

  return filteredReviews;
};
