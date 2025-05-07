export default defineEventHandler(async (event) => {
  // Extract the `noSiri` from the URL params
  const { noSiri } = event.context.params;

  try {
    // Fetch the Semakan status
    const semakan = await prisma.permohonan_semakan.findFirst({
      where: {
        permohonan: {
          no_siri: noSiri,
        },
      },
      select: {
        semakanID: true, // Checking if semakan exists
      },
    });

    // Fetch the Penerimaan status
    const penerimaan = await prisma.permohonan_penerimaan.findFirst({
      where: {
        permohonan: {
          no_siri: noSiri,
        },
      },
      select: {
        penerimaanID: true, // Checking if penerimaan exists
      },
    });

    // Determine statuses based on existence
    const statusSemakan = semakan ? "Selesai" : "Belum Disemak";
    const statusPenerimaan = penerimaan ? "Diterima" : "Belum Diterima";

    // Return the statuses
    return {
      statusCode: 200,
      data: {
        statusSemakan,
        statusPenerimaan,
      },
    };
  } catch (error) {
    // Return an error if something goes wrong
    return {
      statusCode: 500,
      message: "Gagal mendapatkan status",
    };
  }
});
