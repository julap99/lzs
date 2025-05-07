export default defineEventHandler(async (event) => {
  // Get the `noSiri` from the request parameters
  const { noSiri } = event.context.params;

  try {
    // Fetch the permohonan by `no_siri` from the Prisma database
    const permohonan = await prisma.permohonan.findUnique({
      where: {
        no_siri: noSiri, // Unique identifier for permohonan
      },
      include: {
        // Include related fields if necessary
        pemohon: {
          select: {
            user: {
              select: {
                userFullName: true,
              },
            },
            pangkat_pemohon: true,
            no_pegawai_pemohon: true,
          },
        },
        penghantar: true,
        report: {
          select: {
            jenis_barang: true,
            lookup_report_jenis_barangTolookup: {
              select: {
                lookupID: true,
                lookupValue: true,
              },
            },
            tanda_barang: true,
            keadaan_barang: true,
            kuantiti_barang: true,
          },
        },
      },
    });

    // If no permohonan found, return a 404 response
    if (!permohonan) {
      return {
        statusCode: 404,
        message: `Permohonan with noSiri ${noSiri} not found`,
      };
    }

    // Map and return the data as expected by the frontend
    return {
      statusCode: 200,
      data: {
        namaPemohon: permohonan.pemohon?.user?.userFullName || "", // Get namaPemohon from userID
        pangkatPemohon: permohonan.pemohon?.pangkat_pemohon || "",
        noPegawaiPemohon: permohonan.pemohon?.no_pegawai_pemohon || "",
        namaPenghantar: permohonan.penghantar?.nama_penghantar || "",
        pangkatPenghantar: permohonan.penghantar?.pangkat_penghantar || "",
        noPegawaiPenghantar: permohonan.penghantar?.no_pegawai_penghantar || "",
        ringkasanKenyataanKes: permohonan.ringkasan_kenyataan_kes || "",
        bilangan: permohonan.bilangan || 0,
        barangList: permohonan.report.map((barang) => ({
          jenisBarangDetail:
            barang.lookup_report_jenis_barangTolookup.lookupID || "",
          jenisBarangDetailLabel:
            barang.lookup_report_jenis_barangTolookup.lookupValue || "",
          tandaBarang: barang.tanda_barang || "",
          keadaanBarang: barang.keadaan_barang || "",
          kuantitiBarang: barang.kuantiti_barang || 0,
        })),
        noKertasSiasatan: permohonan.no_kertas_siasatan || "",
        noLaporanPolis: permohonan.no_laporan_polis || "",
        tarikhTemujanji:
          permohonan.tarikh_temujanji?.toISOString().split("T")[0] || "",
        slotMasa: permohonan.slot_masa
          ? new Date(permohonan.slot_masa).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          : "",
        isPenghantarSameAsPemohon: !permohonan.penghantar,
      },
    };
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error fetching permohonan:", error);
    return {
      statusCode: 500,
      message: "Something went wrong while fetching permohonan data",
    };
  }
});
