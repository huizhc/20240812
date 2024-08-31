"use client";

import { Document, Page, pdfjs } from "react-pdf";
import { PDFDocument, degrees } from "pdf-lib";
import Image from "next/image";
import "../styles/Home.scss";
import { useEffect, useState } from "react";


pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function Home() {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [rotate, setRotate] = useState<number[]>([]);
  const [pageWidth, setPageWidth] = useState(300);


  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setRotate(new Array(numPages).fill(0));
  }

  function readFileAsync(file: File) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const { files } = event.target;

    const nextFile = files?.[0];

    if (nextFile) {
      setFile(nextFile);
      setFileName(nextFile.name.substring(0, nextFile.name.lastIndexOf(".")));
    }
  }

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
    if (pageWidth >= 500) return;
    setPageWidth(pageWidth + 50);
  };

  const zoomOut = () => {
    if (pageWidth <= 100) return;
    setPageWidth(pageWidth - 50);
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

  return (
    <>
      <header>
        <div className="leftBox">
          <Image src="/logo.svg" alt="logo" width={32} height={18} priority />
          PDF.ai
        </div>
        <div className="rightBox">
          <a className="hover:underline">Pricing</a>
          <a className="hover:underline">Chrome extension</a>
          <a className="hover:underline">Use cases</a>
          <a className="hover:underline">Get started →</a>
        </div>
      </header>
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
              <div className="flex justify-center items-center space-x-3 selecto-ignore">
                <button className="sc-7ff41d46-0 rotateAllBtn !w-auto">
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
                  disabled={pageWidth <= 100}
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
                  disabled={pageWidth >= 500}
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
              <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
                className="flex flex-wrap justify-center"
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <div
                    className="m-3"
                    style={{
                      maxWidth: pageWidth + "px",
                      flex: "0 0 " + pageWidth + "px",
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
                        <Image
                          src="/rotate.svg"
                          alt="rotate"
                          width={20}
                          height={20}
                          priority
                        />
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
                              // rotate={rotate[index]}
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
            </>
          )}
        </div>
      </div>
      <footer className="bg-white" aria-labelledby="footer-heading">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="mx-auto max-w-7xl px-6 pb-8 mt-8 sm:mt-12 lg:px-8 lg:mt-16 border-t border-gray-900/10 pt-16">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8">
              <Image
                className="h-7"
                src="/favicon.ico"
                alt="PDF.ai logo"
                width={32}
                height={18}
                priority
              />
              <div className="text-sm leading-6 text-gray-600">
                Chat with any PDF: ask questions, get summaries, find
                information, and more.
              </div>
              <div className="flex space-x-6">
                <a
                  href="https://www.tiktok.com/@pdfai"
                  className="text-gray-400 hover:text-gray-500"
                  target="_blank"
                >
                  <span className="sr-only">TikTok</span>
                  <Image
                    src="/TikTok.svg"
                    alt="TikTok"
                    width={20}
                    height={24}
                    priority
                  />
                </a>
                <a
                  href="https://www.instagram.com/pdfdotai/"
                  className="text-gray-400 hover:text-gray-500"
                  target="_blank"
                >
                  <span className="sr-only">Instagram</span>
                  <Image
                    src="/ins.svg"
                    alt="Instagram"
                    width={24}
                    height={24}
                    priority
                  />
                </a>
                <a
                  href="https://twitter.com/pdfdotai"
                  className="text-gray-400 hover:text-gray-500"
                  target="_blank"
                >
                  <span className="sr-only">Twitter</span>
                  <Image
                    src="/Twitter.svg"
                    alt="Twitter"
                    width={24}
                    height={24}
                    priority
                  />
                </a>
                <a
                  href="https://www.youtube.com/@pdfai"
                  className="text-gray-400 hover:text-gray-500"
                  target="_blank"
                >
                  <span className="sr-only">YouTube</span>
                  <Image
                    src="/YouTube.svg"
                    alt="YouTube"
                    width={24}
                    height={24}
                    priority
                  />
                </a>
              </div>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-8 xl:col-span-2 xl:mt-0">
              <div className="md:grid md:grid-cols-3 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold leading-6 text-gray-900">
                    Products
                  </h3>
                  <ul role="list" className="mt-6 space-y-4 list-none p-0">
                    <li className="p-0 m-0">
                      <a
                        href="/use-cases"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        Use cases
                      </a>
                    </li>
                    <li className="p-0 m-0">
                      <a
                        href="/chrome-extension"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        Chrome extension
                      </a>
                    </li>
                    <li className="p-0 m-0">
                      <a
                        href="https://api.pdf.ai/"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        API docs
                      </a>
                    </li>
                    <li className="p-0 m-0">
                      <a
                        href="https://pdf.ai/pricing"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        Pricing
                      </a>
                    </li>
                    <li className="p-0 m-0">
                      <a
                        href="https://pdf.ai/tutorials"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        Video tutorials
                      </a>
                    </li>
                    <li className="p-0 m-0">
                      <a
                        href="https://pdf.ai/resources"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        Resources
                      </a>
                    </li>
                    <li className="p-0 m-0">
                      <a
                        href="https://pdf.ai/blog"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        Blog
                      </a>
                    </li>
                    <li className="p-0 m-0">
                      <a
                        href="/faq"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        FAQ
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-sm font-semibold leading-6 text-gray-900">
                    We also built
                  </h3>
                  <ul role="list" className="mt-6 space-y-4 list-none p-0">
                    <li className="p-0 m-0">
                      <a
                        href="https://pdf.ai/tools/resume-ai-scanner"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        Resume AI Scanner
                      </a>
                    </li>
                    <li className="p-0 m-0">
                      <a
                        href="https://pdf.ai/tools/invoice-ai-scanner"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        Invoice AI Scanner
                      </a>
                    </li>
                    <li className="p-0 m-0">
                      <a
                        href="https://pdf.ai/tools/quiz-ai-generator"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        AI Quiz Generator
                      </a>
                    </li>
                    <li className="p-0 m-0">
                      <a
                        href="https://quickyai.com"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        QuickyAI
                      </a>
                    </li>
                    <li className="p-0 m-0">
                      <a
                        href="https://docsium.com"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        Docsium
                      </a>
                    </li>
                    <li className="p-0 m-0">
                      <a
                        href="https://pdf.ai/gpts"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        PDF GPTs
                      </a>
                    </li>
                    <li className="p-0 m-0">
                      <a
                        href="https://pdfgen.com"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        PDF AI generator
                      </a>
                    </li>
                    <li className="p-0 m-0">
                      <a
                        href="https://pdf.ai/tools"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        Other PDF tools
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-sm font-semibold leading-6 text-gray-900">
                    Company
                  </h3>
                  <ul role="list" className="mt-6 space-y-4 list-none p-0">
                    <li className="p-0 m-0">
                      <a
                        href="/compare/chatpdf-alternative"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        PDF.ai vs ChatPDF
                      </a>
                    </li>
                    <li className="p-0 m-0">
                      <a
                        href="/compare/adobe-acrobat-reader-alternative"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        PDF.ai vs Acrobat Reader
                      </a>
                    </li>
                    <li className="p-0 m-0">
                      <a
                        href="/privacy-policy"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        Legal
                      </a>
                    </li>
                    <li className="p-0 m-0">
                      <a
                        href="/affiliate-program"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        Affiliate program 💵
                      </a>
                    </li>
                    <li className="p-0 m-0">
                      <a
                        href="/investor"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        Investor
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
