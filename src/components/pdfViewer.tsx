import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfJSWorkerURL from "pdfjs-dist/build/pdf.worker?url";
import { useEffect, useRef } from "preact/hooks";

GlobalWorkerOptions.workerSrc = pdfJSWorkerURL;

const pdfUrl = "/play-pokemon-deck-list-85x11-tef.pdf";

export const PdfViewer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const renderPdf = async () => {
      var canvas = canvasRef.current;

      if (!canvas) {
        return;
      }

      const pdf = await getDocument(pdfUrl).promise;
      const page = await pdf.getPage(1);

      const scale = 1.5;
      const viewport = page.getViewport({ scale });
      const outputScale = window.devicePixelRatio || 1;

      const context = canvas.getContext("2d");

      if (!context) {
        return;
      }

      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = Math.floor(viewport.width) + "px";
      canvas.style.height = Math.floor(viewport.height) + "px";

      const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined;

      const renderContext = {
        canvasContext: context,
        transform,
        viewport,
      };

      const renderTask = page.render(renderContext);
      await renderTask.promise;
    };

    renderPdf().catch((err) => console.error(err));
  }, [canvasRef]);

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};
