import { dictionaryEntryListing } from '../utils/dictionaryUtils';

export default async function (req, res) {
  try {
    const entries = await dictionaryEntryListing();

    // Output the result
    res.status(200).json({
      result: {
        entries : entries
      },
    });
  } catch (error) {
    console.error(error);

    // Consider adjusting the error handling logic for your use case
    res.status(500).json({
      error: {
        message: "An error occurred during your request.",
      },
    });
  }
}
