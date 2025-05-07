export default defineEventHandler(async (event) => {
  const { temujanjiID } = event.context.params;

  try {
    // Fetch the appointment data and related details from temujanji_detail
    const appointment = await prisma.temujanji.findUnique({
      where: { temujanjiID: parseInt(temujanjiID) },
      include: {
        pemohon: true, // Include pemohon (applicant) details
        temujanji_detail: true,
      },
    });

    console.log(appointment);

    if (!appointment) {
      return {
        statusCode: 404,
        message: "Temujanji tidak dijumpai.",
      };
    }

    // Format the data to fit the front-end expectations
    return {
      statusCode: 200,
      data: {
        temujanjiID: appointment.temujanjiID,
        jenisDokumen: appointment.temujanji_detail.jenisDokumen,
        negara: appointment.temujanji_detail.negara,
        namaPemilik: appointment.temujanji_detail.namaPemilik,
        noDokumen: appointment.temujanji_detail.noDokumen,
        kewarganegaraan: appointment.temujanji_detail.kewarganegaraan,
        tarikhLahir: appointment.temujanji_detail.tarikhLahir,
        jantina: appointment.temujanji_detail.jantina,
        tarikhLuputDokumen: appointment.temujanji_detail.tarikhLuputDokumen,
        skorPersamaanMuka: appointment.temujanji_detail.skorPersamaanMuka,
        skorPersamaanCapJari: appointment.temujanji_detail.skorPersamaanCapJari,
        umur: appointment.temujanji_detail.umur,
        tinggi: appointment.temujanji_detail.tinggi,
        warnaRambut: appointment.temujanji_detail.warnaRambut,
        bangsa: appointment.temujanji_detail.bangsa,
        etnik: appointment.temujanji_detail.etnik,
        bentukKepala: appointment.temujanji_detail.bentukKepala,
        mata: appointment.temujanji_detail.mata,
        telinga: appointment.temujanji_detail.telinga,
        hidung: appointment.temujanji_detail.hidung,
        mulut: appointment.temujanji_detail.mulut,
        parut: appointment.temujanji_detail.parut,
        sejarahPerjalanan: appointment.temujanji_detail.sejarahPerjalanan,
        persamaanTandaTangan: appointment.temujanji_detail.persamaanTandaTangan,
        pemeriksaanLain: appointment.temujanji_detail.pemeriksaanLain,
        dapatan: appointment.temujanji_detail.dapatan,
        laporanSystemTdb:
          appointment.temujanji_detail?.document?.documentURL || null,
      },
    };
  } catch (error) {
    console.error("Error fetching temujanji:", error);
    return {
      statusCode: 500,
      message: "Error fetching appointment data.",
    };
  }
});
