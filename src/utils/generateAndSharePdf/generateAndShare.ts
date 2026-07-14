import { generatePDF } from "react-native-html-to-pdf";
import Share from "react-native-share";
import { showToast } from "@utils/toastHelper";
import { t } from "i18next";

export interface SharePdfOptions {
  html: string;
  fileName: string;
  directory?: string;
}

export const sharePdfFile = async (
  pdfPath: string,
  fileName: string,
): Promise<string> => {
  if (!pdfPath) {
    showToast("error", t("owner.billSummary.pdfNotFound"));
    throw new Error(t("owner.billSummary.pdfNotFound"));
  }

  const fileUrl = pdfPath.startsWith("file://") ? pdfPath : `file://${pdfPath}`;

  await Share.open({
    url: fileUrl,
    type: "application/pdf",
    filename: fileName,
    failOnCancel: false,
    saveToFiles: false,
  });

  return fileUrl;
};

export const generateAndSharePdf = async ({
  html,
  fileName,
  directory = "Documents",
}: SharePdfOptions): Promise<string> => {
  const file = await generatePDF({
    html,
    fileName,
    directory,
  });

  if (!file.filePath) {
    showToast("error", t("owner.billSummary.pdfFailed"));
    throw new Error(t("owner.billSummary.pdfFailed"));
  }

  return sharePdfFile(file.filePath, fileName);
};
