export default defineEventHandler(async (event) => {
  const { temujanjiID } = event.context.params;
  const body = await readBody(event);

  try {
    // Get temujanji details ID
    const temujanjiDetailsID = await prisma.temujanji.findFirst({
      where: { temujanjiID: parseInt(temujanjiID) },
      select: {
        temujanjiID: true,
        temujanjiDetailID: true,
        noSiri: true,
        jenisSemakan: true,
        tarikh: true,
        masa: true,
        status: true,
      },
    });

    console.log(temujanjiDetailsID);

    // Update the main `temujanji` table and related details in `temujanji_detail`
    await prisma.temujanji_detail.update({
      where: {
        temujanjiDetailID: temujanjiDetailsID.temujanjiDetailID,
      },
      data: {
        negara: body.negara,
        namaPemilik: body.namaPemilik,
        noDokumen: body.noDokumen,
        kewarganegaraan: body.kewarganegaraan,
        tarikhLahir: new Date(body.tarikhLahir),
        jantina: body.jantina,
        tarikhLuputDokumen: new Date(body.tarikhLuputDokumen),
        skorPersamaanMuka: parseFloat(body.skorPersamaanMuka),
        skorPersamaanCapJari: parseFloat(body.skorPersamaanCapJari),
        umur: body.umur ? parseInt(body.umur) : null,
        tinggi: body.tinggi ? parseFloat(body.tinggi) : null,
        warnaRambut: body.warnaRambut || null,
        bangsa: body.bangsa || null,
        etnik: body.etnik || null,
        bentukKepala: body.bentukKepala || null,
        mata: body.mata || null,
        telinga: body.telinga || null,
        hidung: body.hidung || null,
        mulut: body.mulut || null,
        parut: body.parut || null,
        sejarahPerjalanan: body.sejarahPerjalanan || null,
        persamaanTandaTangan: body.persamaanTandaTangan || null,
        pemeriksaanLain: body.pemeriksaanLain || null,
        dapatan: body.dapatan,
        modified_at: new Date(),
      },
    });

    // insert temujanji_log
    await prisma.temujanji_log.create({
      data: {
        temujanjiID: parseInt(temujanjiID),
        jenisSemakan: temujanjiDetailsID.jenisSemakan,
        tarikh: temujanjiDetailsID.tarikh,
        masa: temujanjiDetailsID.masa,
        negara: body.negara,
        namaPemilik: body.namaPemilik,
        noDokumen: body.noDokumen,
        kewarganegaraan: body.kewarganegaraan,
        tarikhLahir: new Date(body.tarikhLahir),
        jantina: body.jantina,
        tarikhLuputDokumen: new Date(body.tarikhLuputDokumen),
        skorPersamaanMuka: parseFloat(body.skorPersamaanMuka),
        skorPersamaanCapJari: parseFloat(body.skorPersamaanCapJari),
        umur: body.umur ? parseInt(body.umur) : null,
        tinggi: body.tinggi ? parseFloat(body.tinggi) : null,
        warnaRambut: body.warnaRambut || null,
        bangsa: body.bangsa || null,
        etnik: body.etnik || null,
        bentukKepala: body.bentukKepala || null,
        mata: body.mata || null,
        telinga: body.telinga || null,
        hidung: body.hidung || null,
        mulut: body.mulut || null,
        parut: body.parut || null,
        sejarahPerjalanan: body.sejarahPerjalanan || null,
        persamaanTandaTangan: body.persamaanTandaTangan || null,
        pemeriksaanLain: body.pemeriksaanLain || null,
        dapatan: body.dapatan,
      },
    });

    return {
      statusCode: 200,
      message: "Temujanji berjaya dikemaskini.",
    };
  } catch (error) {
    console.error("Error updating temujanji:", error);
    return {
      statusCode: 500,
      message: "Gagal mengemaskini temujanji.",
    };
  }
});
