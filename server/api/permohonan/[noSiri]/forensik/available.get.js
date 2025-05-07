export default defineEventHandler(async (event) => {
  const { noSiri } = event.context.params;

  try {
    // Fetch the list of assigned officers
    const assignedOfficers = await prisma.permohonan_assign_forensik.findMany({
      where: { permohonan: { no_siri: noSiri } },
      select: { pegawai_forensikID: true },
    });

    const assignedOfficerIDs = assignedOfficers.map(
      (officer) => officer.pegawai_forensikID
    );

    // Fetch all pegawai forensik that are not assigned to this permohonan
    const availablePegawai = await prisma.user.findMany({
      where: {
        userID: { notIn: assignedOfficerIDs },
        userStatus: "ACTIVE",
        userrole: {
          some: {
            role: {
              roleName: "Pegawai Forensik",
            },
          },
        },
      },
      select: {
        userID: true,
        userFullName: true,
        userUsername: true,
      },
    });

    return {
      statusCode: 200,
      data: [
        { value: "", label: "Sila Pilih Pegawai" },
        ...availablePegawai.map((pegawai) => ({
          value: pegawai.userID,
          label: `${pegawai.userFullName}`,
        })),
      ],
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "Error fetching available forensic officers.",
    };
  }
});
