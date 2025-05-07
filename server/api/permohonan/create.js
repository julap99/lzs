export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { userID } = event.context.user;

  const {
    namaPemohon,
    pangkatPemohon,
    noPegawaiPemohon,
    namaPenghantar,
    pangkatPenghantar,
    noPegawaiPenghantar,
    ringkasanKenyataanKes,
    isPenghantarSameAsPemohon,
    bilangan,
    barangList,
    noKertasSiasatan,
    noLaporanPolis,
    tarikhTemujanji,
    slotMasa,
    isDraft,
  } = body;

  // 1. Mandatory fields validation
  const mandatoryFields = [
    namaPemohon,
    pangkatPemohon,
    noPegawaiPemohon,
    ringkasanKenyataanKes,
    bilangan,
    noKertasSiasatan,
    noLaporanPolis,
    tarikhTemujanji,
    slotMasa,
    ...barangList,
  ];

  if (mandatoryFields.some((field) => !field || field === "")) {
    return {
      statusCode: 400,
      message:
        "Setiap medan mandatori yang bertanda * telah diisi. (Ralat CMN-E001)",
    };
  }

  // 2. Validate date for the appointment
  const appointmentDate = new Date(tarikhTemujanji);
  const currentDate = new Date();

  if (appointmentDate <= currentDate) {
    return {
      statusCode: 400,
      message:
        "Perlu memastikan tarikh janji temu yang dimasukkan adalah tarikh selepas tarikh semasa. (Ralat CMN-E002)",
    };
  }

  // 3. Check if the session is expired
  const sessionExpired = false; // Implement session logic here
  if (sessionExpired) {
    return {
      statusCode: 401,
      message:
        "Sesi aktif pengguna berada dalam sistem telah tamat. (Ralat CMN-E005)",
    };
  }

  // 4. Check for invalid symbols in text fields
  const hasInvalidSymbols = (text) => /[^a-zA-Z0-9\s]/.test(text); // Allow alphanumeric and spaces

  const fieldsToCheck = [
    namaPemohon,
    pangkatPemohon,
    noPegawaiPemohon,
    ...barangList.map((barang) => barang.tandaBarang),
  ];

  if (fieldsToCheck.some((field) => hasInvalidSymbols(field))) {
    return {
      statusCode: 400,
      message:
        "Perlu memastikan tiada penggunaan simbol dalam medan yang ditetapkan. (Ralat CMN-E011)",
    };
  }

  // 5. Insert data into the database
  const caseReferenceID = generateCaseReferenceID();
  let permohonanStatus = isDraft ? "Permohonan Draf" : "Permohonan Dihantar";

  try {
    // Insert into `permohonan` table
    const newPermohonan = await prisma.permohonan.create({
      data: {
        no_siri: caseReferenceID,
        status_permohonan: permohonanStatus,
        pemohon: {
          create: {
            userID: userID, // Assuming the user is authenticated, replace with actual user ID
            pangkat_pemohon: pangkatPemohon,
            no_pegawai_pemohon: noPegawaiPemohon,
          },
        },
        penghantar: {
          create: {
            nama_penghantar: namaPenghantar,
            pangkat_penghantar: pangkatPenghantar,
            no_pegawai_penghantar: noPegawaiPenghantar,
          },
        },
        ringkasan_kenyataan_kes: ringkasanKenyataanKes,
        bilangan: parseInt(bilangan),
        penghantar_sama_dengan_pemohon: isPenghantarSameAsPemohon ? 1 : 0,
        no_kertas_siasatan: noKertasSiasatan,
        no_laporan_polis: noLaporanPolis,
        tarikh_temujanji: new Date(tarikhTemujanji),
        slot_masa: new Date(`1970-01-01T${slotMasa}`), // Convert slotMasa string to Time
        create_at: new Date(),
      },
    });

    // Insert related `report` and `document` data
    for (const barang of barangList) {
      await prisma.report.create({
        data: {
          permohonanID: newPermohonan.id,
          jenis_barang: barang.jenisBarangDetail,
          kuantiti_barang: parseInt(barang.kuantitiBarang),
          tanda_barang: barang.tandaBarang,
          keadaan_barang: barang.keadaanBarang,
          create_by: userID,
          create_at: new Date(),
        },
      });
    }

    // 6. Send confirmation email
    if (!isDraft) {
      await sendEmail({
        to: [
          /* pemohon, pegawai_kaunter, ketua_bahagian */
        ],
        subject: `Permohonan Baru: ${caseReferenceID}`,
        body: `
            Case ID: ${caseReferenceID}
            Appointment Date: ${tarikhTemujanji}
            Time Slot: ${slotMasa}
            Barang: ${barangList
              .map(
                (barang) =>
                  `${barang.tandaBarang} - ${barang.kuantitiBarang} units`
              )
              .join(", ")}
            Pemohon Details: ${namaPemohon} (${pangkatPemohon})
            ${
              isPenghantarSameAsPemohon
                ? ""
                : `Penghantar Details: ${namaPenghantar} (${pangkatPenghantar})`
            }
            Ringkasan Kenyataan Kes: ${ringkasanKenyataanKes}
          `,
      });
    }

    return {
      statusCode: 200,
      message: isDraft
        ? "Rekod telah berjaya disimpan. (Status CMN-S001)"
        : "Permohonan pemeriksaan forensik telah dihantar. (Status FOR-S001)",
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Terdapat masalah. Silakan cuba lagi.",
    };
  }
});

// Helper function to generate case reference number
const generateCaseReferenceID = () => {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // JS month is zero-indexed
  const day = String(now.getDate()).padStart(2, "0");
  const uniqueSerial = String(Math.floor(Math.random() * 1000000)).padStart(
    6,
    "0"
  );
  return `${year}${month}${day}-${uniqueSerial}`;
};

const sendEmail = async ({ to, subject, body }) => {
  console.log("Sending email to", to);
  return true;
};
