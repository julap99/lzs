export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { userID } = event.context.user;

  const { pemohon, jenisSemakan, tarikh, masa, gambarSubjek, gambarCapJari } =
    body;

  try {
    // Validate required fields
    if (
      !pemohon.nama ||
      !pemohon.jawatan ||
      !pemohon.noPegawai ||
      !jenisSemakan ||
      !tarikh ||
      !masa
    ) {
      return {
        statusCode: 400,
        message: "Sila isi semua medan yang diperlukan.",
      };
    }

    // Save the appointment (temujanji) into the database using Prisma
    const temujanjiBaru = await prisma.temujanji.create({
      data: {
        jenisSemakan: jenisSemakan,
        tarikh: new Date(tarikh),
        masa: new Date(`${tarikh}T${masa}:00`) ?? new Date(),
        status: "Temujanji Diterima",
        gambarSubjek: gambarSubjek
          ? await saveDocument(gambarSubjek, "Subjek")
          : undefined,
        gambarCapJari: gambarCapJari
          ? await saveDocument(gambarCapJari, "Cap Jari")
          : undefined,
        pemohon: {
          create: {
            userID: userID,
            pangkat_pemohon: pemohon.jawatan,
            no_pegawai_pemohon: pemohon.noPegawai,
          },
        },
        temujanji_detail: {
          create: {
            create_at: new Date(),
          },
        },
      },
    });

    return {
      statusCode: 200,
      message: "Temujanji berjaya ditambah.",
      data: temujanjiBaru,
    };
  } catch (error) {
    console.error("Error adding appointment:", error);
    return {
      statusCode: 500,
      message: "Terdapat ralat semasa menambah temujanji.",
    };
  }
});

// Helper function to save uploaded documents to the database
async function saveDocument(file, fileType) {
  try {
    const savedDocument = await prisma.document.create({
      data: {
        name: file.name,
        url: `/uploads/${file.name}`,
        type: fileType,
        size: file.size,
      },
    });
    return savedDocument.id;
  } catch (error) {
    console.error("Error saving document:", error);
    throw new Error("Gagal menyimpan dokumen.");
  }
}
