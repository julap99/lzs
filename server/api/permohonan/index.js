// File: server/api/permohonan/index.get.js
export default defineEventHandler(async () => {
  try {
    const permohonan = await prisma.permohonan.findMany({
      where: {
        status_permohonan: {
          notIn: ["Permohonan Ditolak"],
        },
      },
      select: {
        id: true,
        no_siri: true,
        create_at: true,
        status_permohonan: true,
      },
      orderBy: {
        create_at: "desc",
      },
    });

    return {
      statusCode: 200,
      message: "Success",
      data: permohonan.map((item, index) => {
        // Convert UTC to GMT+8
        const gmt8Date = new Date(
          item.create_at.getTime() + 8 * 60 * 60 * 1000
        );
        return {
          no: index + 1,
          noSiri: item.no_siri,
          tarikhMasa: gmt8Date.toISOString().replace("T", " ").slice(0, 19),
          status: item.status_permohonan,
          butiran: item.id,
        };
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "Failed to fetch permohonan data.",
    };
  }
});
