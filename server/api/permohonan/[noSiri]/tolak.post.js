// File: /api/permohonan/[noSiri]/tolak.put.js
export default defineEventHandler(async (event) => {
  const { noSiri } = event.context.params;
  const body = await readBody(event); // Get form data from frontend

  try {
    // Get the current user (assuming user authentication is handled)
    const user = event.context.user;

    // Find the permohonan by its noSiri
    const permohonan = await prisma.permohonan.findUnique({
      where: { no_siri: noSiri },
    });

    if (!permohonan) {
      return { statusCode: 404, message: "Permohonan tidak dijumpai." };
    }

    // Create or update the permohonan penolakan entry
    await prisma.permohonan_penolakan.upsert({
      where: {
        permohonanID: permohonan.id,
      },
      update: {
        sebab_penolakan: parseInt(body.sebabPenolakan), // Assuming lookupID is passed
        lain_sebab: body.lainLainSebab || null,
        ditolak_oleh: user.userID,
        create_at: new Date(),
      },
      create: {
        permohonanID: permohonan.id,
        sebab_penolakan: parseInt(body.sebabPenolakan),
        lain_sebab: body.lainLainSebab || null,
        ditolak_oleh: user.userID,
        create_at: new Date(),
      },
    });

    // Update the status of the permohonan to "Permohonan Ditolak"
    await prisma.permohonan.update({
      where: { no_siri: noSiri },
      data: { status_permohonan: "Permohonan Ditolak" },
    });

    return {
      statusCode: 200,
      message: "Maklumat penolakan berjaya dikemaskini.",
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      message: "Gagal mengemaskini maklumat penolakan.",
    };
  }
});
