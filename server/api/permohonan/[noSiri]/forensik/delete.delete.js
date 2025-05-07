export default defineEventHandler(async (event) => {
  const { noSiri } = event.context.params;
  const body = await readBody(event);
  const { assignID } = body;

  try {
    // Fetch the existing permohonan
    const permohonan = await prisma.permohonan.findUnique({
      where: { no_siri: noSiri },
    });

    if (!permohonan) {
      return { statusCode: 404, message: "Permohonan tidak dijumpai." };
    }

    // Delete the pegawai assignment
    await prisma.permohonan_assign_forensik.delete({
      where: {
        assignID: assignID,
      },
    });

    return { statusCode: 200, message: "Pegawai berjaya dipadamkan." };
  } catch (error) {
    return { statusCode: 500, message: "Error deleting forensic officer." };
  }
});
