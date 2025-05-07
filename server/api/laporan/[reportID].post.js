// Path: /api/report/[reportID].post.js
export default defineEventHandler(async (event) => {
  const { reportID } = event.context.params;
  const body = await readBody(event);

  const {
    peralatan,
    langkah2,
    dapatan, // This should correspond to lookupID in the `lookup` table
    documentTambahan, // Array of documents
  } = body;

  console.log(body);

  try {
    // Update the report in the database
    const updatedReport = await prisma.report.update({
      where: { reportID: parseInt(reportID) },
      data: {
        peralatan,
        langkah_langkah: langkah2,
        dapatan: parseInt(dapatan), // Assuming this is a lookupID from the `lookup` table
      },
    });

    // Handle document uploads (if necessary)
    if (documentTambahan && documentTambahan.length > 0) {
      // Create documents first
      const createdDocuments = await prisma.document.createMany({
        data: documentTambahan.map((doc) => ({
          documentName: doc.nama,
        })),
        skipDuplicates: true,
      });

      // Get the IDs of the newly created documents
      const newDocumentIds = await prisma.document.findMany({
        where: {
          documentName: {
            in: documentTambahan.map((doc) => doc.nama),
          },
        },
        select: {
          documentID: true,
          documentName: true,
        },
      });

      // Update report_doc_support table
      await prisma.report_doc_support.createMany({
        data: newDocumentIds.map((doc) => ({
          reportID: updatedReport.reportID,
          documentID: doc.documentID,
        })),
      });
    }

    return { statusCode: 200, message: "Report updated successfully" };
  } catch (error) {
    console.log(error);
    return { statusCode: 500, message: "Failed to update report" };
  }
});
