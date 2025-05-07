export default defineEventHandler(async (event) => {
  try {
    const appointments = await prisma.temujanji.findMany({
      include: {
        pemohon: {
          include: {
            user: true,
          },
        }, // Join with pemohon table to get applicant details
      },
    });

    return {
      statusCode: 200,
      data: appointments.map((appointment, index) => ({
        no: index + 1,
        kesId: appointment.temujanjiID,
        namaPemohon: appointment.pemohon.user.userFullName,
        caraSemakan: appointment.jenisSemakan,
        status: appointment.status || "Pending",
        tindakan: appointment.temujanjiID,
      })),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Failed to fetch appointments.",
    };
  }
});
