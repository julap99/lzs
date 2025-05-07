export default defineEventHandler(async (event) => {
  const { noSiri } = event.context.params; // Extract the noSiri from the URL
  const body = await readBody(event); // Read the request body

  const { ringkasanKenyataanKes, noKertasSiasatan, noLaporanPolis } = body;

  // 1. Validate the input fields (all three fields must be provided)
  if (!ringkasanKenyataanKes || !noKertasSiasatan || !noLaporanPolis) {
    return {
      statusCode: 400,
      message:
        "Setiap medan mandatori yang bertanda * telah diisi. (Ralat CMN-E001)",
    };
  }

  try {
    // 2. Check if the permohonan exists by its `no_siri`
    const existingPermohonan = await prisma.permohonan.findUnique({
      where: { no_siri: noSiri },
    });

    // If no `permohonan` is found, return a 404 error
    if (!existingPermohonan) {
      return {
        statusCode: 404,
        message: `Permohonan with noSiri ${noSiri} not found.`,
      };
    }

    // 3. Proceed to update only the allowed fields (ringkasanKenyataanKes, noKertasSiasatan, noLaporanPolis)
    const updatedPermohonan = await prisma.permohonan.update({
      where: { no_siri: noSiri },
      data: {
        ringkasan_kenyataan_kes: ringkasanKenyataanKes,
        no_kertas_siasatan: noKertasSiasatan,
        no_laporan_polis: noLaporanPolis,
        modified_at: new Date(), // Update the modified_at timestamp
      },
    });

    // 4. Return success response
    return {
      statusCode: 200,
      message: "Permohonan telah berjaya dikemaskini.",
      data: updatedPermohonan,
    };
  } catch (error) {
    console.error("Error updating permohonan:", error);
    return {
      statusCode: 500,
      message: "Gagal mengemaskini permohonan. Sila cuba lagi.",
    };
  }
});
