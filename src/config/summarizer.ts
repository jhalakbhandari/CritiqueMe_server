export async function summarizePortfolio(description: string): Promise<string> {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Optional: use env token if available
        ...(process.env.HUGGINGFACE_API_KEY && {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        }),
      },
      body: JSON.stringify({
        inputs: description,
      }),
    }
  );

  const result = await response.json();

  if (result.error) {
    throw new Error(result.error);
  }

  return result[0]?.summary_text || "No summary found.";
}
