// path: /api/lookup?type=jenis_barang
export default defineEventHandler(async (event) => {
  const { type } = getQuery(event); // Get lookup type from query params, e.g., jenis_barang, dapatan

  if (!type) {
    return {
      statusCode: 400,
      message: "Lookup type is required",
    };
  }

  try {
    const lookups = await prisma.lookup.findMany({
      where: {
        lookupTitle: type,
        lookupStatus: "ACTIVE",
      },
      select: {
        lookupID: true,
        lookupTitle: true,
        lookupValue: true,
      },
    });
    if (!lookups) {
      return {
        statusCode: 404,
        message: "Lookup data not found",
      };
    }

    // Convert snake_case to Title Case: e.g., jenis_barang_siber -> Jenis Barang Siber
    const defaultTitle = type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    // Transform the lookups data to the required format
    const transformedLookups = [
      { label: `Sila Pilih ${defaultTitle}`, value: null }, // Add an empty option as the first item
      ...lookups.map((lookup) => ({
        label: lookup.lookupValue,
        value: lookup.lookupID,
      })),
    ];

    return {
      statusCode: 200,
      data: transformedLookups,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "Error fetching lookup data",
      error: error.message,
    };
  }
});
