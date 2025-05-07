export default defineEventHandler(async (event) => {
  const { noSiri } = event.context.params; // Get the noSiri from the request parameters

  try {
    // Find the permohonan by its `no_siri`
    const permohonan = await prisma.permohonan.findUnique({
      where: { no_siri: noSiri },
    });

    if (!permohonan) {
      return {
        statusCode: 404,
        message: `Permohonan with noSiri ${noSiri} not found.`,
      };
    }

    // Delete pemohonan
    await prisma.pemohon.delete({
      where: {
        id: permohonan.pemohonID,
      },
    });

    // Delete penghantar
    await prisma.penghantar.delete({
      where: {
        id: permohonan.penghantarID,
      },
    });

    // Delete report
    await prisma.report.deleteMany({
      where: {
        permohonanID: permohonan.id,
      },
    });

    // Delete permohonan
    await prisma.permohonan.delete({
      where: {
        id: permohonan.id,
      },
    });

    return {
      statusCode: 200,
      message: "Permohonan and related data successfully deleted.",
    };
  } catch (error) {
    console.error("Error deleting permohonan:", error);
    return {
      statusCode: 500,
      message: "Failed to delete permohonan. Please try again.",
    };
  }
});
