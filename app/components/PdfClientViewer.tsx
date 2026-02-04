import dynamic from "next/dynamic";

const PdfClientViewer = dynamic(() => import("./FileViewer"), { ssr: false });

export default function FileViewer({
  fileUrl,
  highlightText,
}: {
  fileUrl: string;
  highlightText?: string;
}) {
  return <PdfClientViewer fileUrl={fileUrl} highlightText={highlightText} />;
}
