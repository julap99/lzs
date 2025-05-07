export default defineEventHandler(async (event) => {
  const { noSiri } = event.context.params;
  const body = await readBody(event);
  const { pegawaiID } = body;

  try {
    // Ensure that the permohonan exists
    const permohonan = await prisma.permohonan.findUnique({
      where: { no_siri: noSiri },
    });

    if (!permohonan) {
      return { statusCode: 404, message: "Permohonan tidak dijumpai." };
    }

    // Ensure that the pegawai is not already assigned
    const existingAssignment =
      await prisma.permohonan_assign_forensik.findFirst({
        where: {
          permohonanID: permohonan.id,
          pegawai_forensikID: pegawaiID,
        },
      });

    if (existingAssignment) {
      return { statusCode: 400, message: "Pegawai sudah ditugaskan." };
    }

    // Assign the pegawai to this permohonan
    await prisma.permohonan_assign_forensik.create({
      data: {
        permohonanID: permohonan.id,
        pegawai_forensikID: pegawaiID,
      },
    });

    return { statusCode: 200, message: "Pegawai berjaya ditambah." };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, message: "Error adding forensic officer." };
  }
});
