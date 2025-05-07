export default defineEventHandler(async (event) => {
  const { temujanjiID } = event.context.params;

  try {
    // Check if temujanji_detail exists before deleting
    const detailExists = await prisma.temujanji_detail.findFirst({
      where: { temujanjiID: parseInt(temujanjiID) },
    });

    if (detailExists) {
      await prisma.temujanji_detail.deleteMany({
        where: { temujanjiID: parseInt(temujanjiID) },
      });
    }

    const pemohonExists = await prisma.pemohon.findFirst({
      where: { temujanjiID: parseInt(temujanjiID) },
    });

    if (pemohonExists) {
      await prisma.pemohon.delete({
        where: { temujanjiID: parseInt(temujanjiID) },
      });
    }

    await prisma.temujanji.delete({
      where: { temujanjiID: parseInt(temujanjiID) },
    });

    return { statusCode: 200, message: "Berjaya" };
  } catch (error) {
    return { statusCode: 500, message: error.message };
  }
});
