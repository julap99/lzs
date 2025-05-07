// File: /api/permohonan/[noSiri]/terima.put.js
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

    // Create or update the permohonan penerimaan entry
    await prisma.permohonan_penerimaan.upsert({
      where: {
        permohonanID: permohonan.id,
      },
      update: {
        peralatan_keadaan_baik: body.peralatanBaik === "Ya" ? 1 : 0,
        pegawai_berkelayakan: body.pegawaiBerkelayakan === "Ya" ? 1 : 0,
        kaedah_dpt_dilakukan: body.kaedahDapatDilakukan === "Ya" ? 1 : 0,
        subkontrak_diperlukan: body.subkontrakDiperlukan === "Ya" ? 1 : 0,
        tugasan_diterima: body.tugasanDiterima === "Ya" ? 1 : 0,
        ulasan_pegawai: body.ulasanPegawaiKaunter,
        diterima_oleh: user.userID,
        create_at: new Date(), // Store current date
      },
      create: {
        permohonanID: permohonan.id,
        peralatan_keadaan_baik: body.peralatanBaik === "Ya" ? 1 : 0,
        pegawai_berkelayakan: body.pegawaiBerkelayakan === "Ya" ? 1 : 0,
        kaedah_dpt_dilakukan: body.kaedahDapatDilakukan === "Ya" ? 1 : 0,
        subkontrak_diperlukan: body.subkontrakDiperlukan === "Ya" ? 1 : 0,
        tugasan_diterima: body.tugasanDiterima === "Ya" ? 1 : 0,
        ulasan_pegawai: body.ulasanPegawaiKaunter,
        diterima_oleh: user.userID,
        create_at: new Date(),
      },
    });

    // Update the status of the permohonan to "Diterima"
    await prisma.permohonan.update({
      where: { no_siri: noSiri },
      data: { status_permohonan: "Permohonan Diterima" },
    });

    return {
      statusCode: 200,
      message: "Maklumat penerimaan berjaya dikemaskini.",
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      message: "Gagal mengemaskini maklumat penerimaan.",
    };
  }
});
