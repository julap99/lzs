export default defineEventHandler(async (event) => {
  const { noSiri } = event.context.params;
  const body = await readBody(event);
  const { oldPegawaiID, newPegawaiID, assignID } = body;

  try {
    // Fetch the existing permohonan
    const permohonan = await prisma.permohonan.findUnique({
      where: { no_siri: noSiri },
    });

    if (!permohonan) {
      return { statusCode: 404, message: "Permohonan tidak dijumpai." };
    }

    // Check if the new pegawai is already assigned
    const existingAssignment =
      await prisma.permohonan_assign_forensik.findFirst({
        where: {
          permohonanID: permohonan.id,
          pegawai_forensikID: newPegawaiID,
        },
      });

    console.log("existingAssignment", existingAssignment);

    if (existingAssignment) {
      return { statusCode: 400, message: "Pegawai baru sudah ditugaskan." };
    }

    // Update the old pegawai with the new pegawai
    await prisma.permohonan_assign_forensik.update({
      where: {
        assignID: assignID,
      },
      data: {
        pegawai_forensikID: newPegawaiID,
      },
    });

    return { statusCode: 200, message: "Pegawai berjaya dikemaskini." };
  } catch (error) {
    console.log(error);
    return { statusCode: 500, message: "Error updating forensic officer." };
  }
});
