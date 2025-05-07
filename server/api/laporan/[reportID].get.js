// Path: /api/report/[reportID].get.js

export default defineEventHandler(async (event) => {
  const { reportID } = event.context.params;

  try {
    const report = await prisma.report.findUnique({
      where: { reportID: parseInt(reportID) },
      include: {
        permohonan: {
          include: {
            penghantar: true,
            pemohon: {
              include: {
                user: true,
              },
            },
          },
        },
        lookup_report_jenis_barangTolookup: true,
        lookup_report_dapatanTolookup: {
          select: {
            lookupID: true,
            lookupValue: true,
          },
        },
        report_doc_support: {
          include: {
            document: true,
          },
        },
      },
    });

    console.log(report);

    if (!report) {
      return { statusCode: 404, message: "Report not found" };
    }

    // Format the data for the frontend
    const reportData = {
      kesId: report.permohonan.no_siri,
      tagNo: report.tanda_barang,
      jenisBrg: report.lookup_report_jenis_barangTolookup.lookupValue,
      jenisPemeriksaan: "Forensik", // Assuming it's static for now
      pegawai: {
        PENYIASAT: {
          nama: report.permohonan.pemohon?.user?.userFullName || "",
          pangkat: report.permohonan.pemohon?.pangkat_pemohon || "",
          noPegawai: report.permohonan.pemohon?.no_pegawai_pemohon || "",
        },
        PENGHANTAR: {
          nama: report.permohonan.penghantar_sama_dengan_pemohon
            ? report.permohonan.pemohon?.user?.userFullName || ""
            : report.permohonan.penghantar?.nama_penghantar || "",
          pangkat: report.permohonan.penghantar_sama_dengan_pemohon
            ? report.permohonan.pemohon?.pangkat_pemohon || ""
            : report.permohonan.penghantar?.pangkat_penghantar || "",
          noPegawai: report.permohonan.penghantar_sama_dengan_pemohon
            ? report.permohonan.pemohon?.no_pegawai_pemohon || ""
            : report.permohonan.penghantar?.no_pegawai_penghantar || "",
        },
        PEMERIKSA: {
          nama: report.permohonan.pemerikasa?.user?.userFullName || "",
          pangkat: report.permohonan.pemerikasa?.pangkat_pemerikasa || "",
          noPegawai: report.permohonan.pemerikasa?.no_pegawai_pemerikasa || "",
        },
        PENERIMA: {
          nama: report.permohonan.penerima?.user?.userFullName || "",
          pangkat: report.permohonan.penerima?.pangkat_penerima || "",
          noPegawai: report.permohonan.penerima?.no_pegawai_penerima || "",
        },

        // Fill in other roles accordingly
      },
      peralatan: report.peralatan,
      langkah2: report.langkah_langkah,
      dapatan: {
        value: report.lookup_report_dapatanTolookup?.lookupID,
        label: report.lookup_report_dapatanTolookup?.lookupValue,
      },
      documentTambahan: report.report_doc_support
        ? [
            {
              nama: report.report_doc_support[0].document.documentName,
              file: report.report_doc_support[0].document.documentURL,
            },
          ]
        : [
            {
              nama: "",
              file: "",
            }
        ],
    };

    return { statusCode: 200, data: reportData };
  } catch (error) {
    console.log(error);
    return { statusCode: 500, message: error.message };
  }
});
