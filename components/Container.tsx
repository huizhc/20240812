"use client";

import Image from "next/image";
import { degrees, PDFDocument } from "pdf-lib";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import RotateSvg from "../public/rotate.svg";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function Container() {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [rotate, setRotate] = useState<number[]>([]);
  const [viewWidth, setViewWidth] = useState(300);
  const [loading, setLoading] = useState(false);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setLoading(false);
    setNumPages(numPages);
    setRotate(new Array(numPages).fill(0));
  };

  const onDocumentLoadError = () => {
    setLoading(false)
    setFile(null)
    setFileName(null)
  }

  const readFileAsync = (file: File) => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { files } = event.target;

    const nextFile = files?.[0];

    if (nextFile) {
      setLoading(true);
      setFile(nextFile);
      setFileName(nextFile.name.substring(0, nextFile.name.lastIndexOf(".")));
    }
  };

  const pageRotate = (current: number) => {
    let tmp = [...rotate];
    tmp[current] = tmp[current] + 90;
    setRotate(tmp);
  };

  const removePDF = () => {
    setFile(null);
    setNumPages(0);
    setRotate([]);
  };

  const zoomIn = () => {
    if (viewWidth >= 500) return;
    setViewWidth(viewWidth + 50);
  };

  const zoomOut = () => {
    if (viewWidth <= 100) return;
    setViewWidth(viewWidth - 50);
  };

  const download = async () => {
    const pdfDoc = await PDFDocument.load(
      (await readFileAsync(file as File)) as ArrayBuffer
    );

    const pages = pdfDoc.getPages();

    pages.forEach((page, i) => {
      if (rotate[i] !== 0) {
        page.setRotation(degrees(rotate[i]));
      }
    });

    saveByteArray(fileName + "(rotated).pdf", await pdfDoc.save());
  };

  const saveByteArray = (reportName: string, byte: ArrayBuffer) => {
    var blob = new Blob([byte], { type: "application/pdf" });
    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    var fileName = reportName;
    link.download = fileName;
    link.click();
  };

  const rotateAll = () => {
    setRotate(rotate.map((v) => v + 90));
  };

  return (
    <div className="bg-[#f7f5ee] text-black">
      <div className="container mx-auto py-20 space-y-5">
        <div className="flex flex-col text-center !mb-10 space-y-5">
          <h1 className="text-5xl font-serif">Rotate PDF Pages</h1>
          <p className="mt-2 text-gray-600 max-w-lg mx-auto">
            Simply click on a page to rotate it. You can then download your
            modified PDF.
          </p>
        </div>

        {!file ? (
          <div className="w-full flex justify-center">
            <div className="h-[350px] relative text-center w-[275px]">
              <input
                className="cursor-pointer hidden"
                type="file"
                id="input-file-upload"
                accept=".pdf"
                onChange={onFileChange}
              />
              <label
                className="h-full flex items-center justify-center border rounded transition-all bg-white border-dashed border-stone-300"
                htmlFor="input-file-upload"
              >
                <div className="cursor-pointer flex flex-col items-center space-y-3">
                  <Image
                    src="/upload.svg"
                    alt="upload"
                    width={32}
                    height={32}
                    priority
                  />
                  <p className="pointer-events-none font-medium text-sm leading-6 pointer opacity-75">
                    Click to upload or drag and drop
                  </p>
                </div>
              </label>
            </div>
          </div>
        ) : (
          <>
            {!loading && (
              <div className="flex justify-center items-center space-x-3 selecto-ignore">
                <button
                  className="sc-7ff41d46-0 rotateAllBtn !w-auto"
                  onClick={rotateAll}
                >
                  Rotate all
                </button>
                <button
                  className="sc-7ff41d46-0 removePDF !w-auto !bg-gray-800"
                  aria-label="Remove this PDF and select a new one"
                  data-microtip-position="top"
                  role="tooltip"
                  onClick={removePDF}
                >
                  Remove PDF
                </button>
                <button
                  className="bg-[#ff612f] shadow rounded-full p-2 flex items-center justify-center hover:scale-105 grow-0 shrink-0 disabled:opacity-50 !bg-white disabled:opacity-50"
                  aria-label="Zoom in"
                  data-microtip-position="top"
                  role="tooltip"
                  onClick={zoomIn}
                  disabled={viewWidth <= 100}
                >
                  <Image
                    src="/zoomIn.svg"
                    alt="zoomIn"
                    width={20}
                    height={20}
                    priority
                  />
                </button>
                <button
                  className="bg-[#ff612f] shadow rounded-full p-2 flex items-center justify-center hover:scale-105 grow-0 shrink-0 disabled:opacity-50 !bg-white"
                  aria-label="Zoom out"
                  data-microtip-position="top"
                  role="tooltip"
                  onClick={zoomOut}
                  disabled={viewWidth >= 500}
                >
                  <Image
                    src="/zoomOut.svg"
                    alt="zoomOut"
                    width={20}
                    height={20}
                    priority
                  />
                </button>
              </div>
            )}
            <Document
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={<div className="loading"></div>}
              className="flex flex-wrap justify-center"
            >
              {Array.from(new Array(numPages), (el, index) => (
                <div
                  className="m-3"
                  style={{
                    maxWidth: viewWidth + "px",
                    flex: "0 0 " + viewWidth + "px",
                  }}
                  onClick={() => {
                    pageRotate(index);
                  }}
                  key={index}
                >
                  <div
                    className="relative cursor-pointer pdf-page"
                    data-page-num="0"
                  >
                    <div className="absolute z-10 top-1 right-1 rounded-full p-1 hover:scale-105 hover:fill-white bg-[#ff612f] fill-white">
                      <RotateSvg width={12} height={12} />
                    </div>
                    <div className="overflow-hidden transition-transform">
                      <div className="relative h-full w-full flex flex-col justify-between items-center shadow-md p-3 bg-white hover:bg-gray-50">
                        <div
                          className="rotateWrap"
                          style={{
                            transform: "rotate(" + rotate[index] + "deg)",
                          }}
                        >
                          <Page
                            className="pointer-events-none w-full shrink"
                            pageNumber={index + 1}
                            loading=""
                            error="fail to load resource"
                            renderMode="canvas"
                            renderAnnotationLayer={false}
                            renderTextLayer={false}
                          />
                        </div>
                        <div className="w-[90%] text-center shrink-0 text-xs italic overflow-hidden text-ellipsis whitespace-nowrap">
                          {index + 1}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Document>
            {!loading && (
              <div className="flex flex-col justify-center items-center space-y-3 selecto-ignore">
                <button
                  onClick={download}
                  className="downloadBtn !w-auto shadow"
                  aria-label="Split and download PDF"
                  data-microtip-position="top"
                  role="tooltip"
                >
                  Download
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
