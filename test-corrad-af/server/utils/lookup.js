// utils/lookup.js
export async function getLookupData({ lookupTitle, lookupStatus } = {}) {
  try {
    console.log("lookupTitle", lookupTitle);
    console.log("lookupStatus", lookupStatus);
    const lookups = await prisma.lookup.findMany({
      where: {
        lookupTitle: lookupTitle || undefined, // Filter by lookupTitle if provided
        lookupStatus: lookupStatus || "ACTIVE", // Default to 'ACTIVE' if not provided
      },
      orderBy: {
        lookupOrder: {
          // Handle NULL values in lookupOrder
          sort: "asc",
          nulls: "last",
        },
      },
      select: {
        lookupID: true,
        lookupTitle: true,
        lookupValue: true,
        lookupType: true,
        lookupStatus: true,
        lookupOrder: true,
        lookupRefCode: true, // Included in case needed for future queries
      },
    });

    return lookups;
  } catch (error) {
    console.error("Error fetching lookup data:", error);
    throw new Error("Failed to fetch lookup data.");
  }
}
