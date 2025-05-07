export default defineEventHandler(async (event) => {
  const { noSiri } = event.context.params;

  try {
    // Fetch the permohonan by noSiri
    const permohonan = await prisma.permohonan.findUnique({
      where: { no_siri: noSiri },
      select: {
        permohonan_assign_forensik: {
          include: {
            user: {
              select: {
                userID: true,
                userFullName: true,
                userUsername: true,
              },
            },
          },
        },
      },
    });

    if (!permohonan) {
      return { statusCode: 404, message: "Permohonan tidak dijumpai." };
    }

    // Return the list of assigned forensic officers
    const forensicOfficers = permohonan.permohonan_assign_forensik.map(
      (assignment) => ({
        nama: assignment.user.userFullName,
        tindakan: {
          userID: assignment.user.userID,
          assignID: assignment.assignID,
        },
      })
    );

    return {
      statusCode: 200,
      data: forensicOfficers,
    };
  } catch (error) {
    return { statusCode: 500, message: "Error fetching forensic officers." };
  }
});
