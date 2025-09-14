// Converts markdown to text
export const markdownToJSON = (keywords) => {
  try {
    const res = keywords.replace(/```json|```/g, "").trim();
    return JSON.parse(res);
  } catch (err) {
    console.log("Error while converting markdown to JSON: ", err?.message);
  }
};
