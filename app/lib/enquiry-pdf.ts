export interface EnquiryPdfRecord {
  id: string;
  source: string;
  customerName: string;
  customerPhone: string;
  customerType: string;
  message: string;
  status: string;
  createdAt: string;
}

type EnquiryStatus = "all" | "new" | "reviewed";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const CANVAS_SCALE = 2;
const CANVAS_WIDTH = Math.round(PAGE_WIDTH * CANVAS_SCALE);
const CANVAS_HEIGHT = Math.round(PAGE_HEIGHT * CANVAS_SCALE);
const MARGIN = 38;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const encoder = new TextEncoder();

export async function downloadEnquiryPdf(
  records: EnquiryPdfRecord[],
  date: string,
  status: EnquiryStatus,
) {
  if (records.length === 0) {
    throw new Error("There are no enquiries for the selected date and status.");
  }

  const pages = renderPages(records, date, status);
  const images = await Promise.all(pages.map(canvasToJpeg));
  const bytes = buildPdf(images);
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = `sharda-mica-enquiries-${date}.pdf`;
  link.style.display = "none";
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 30_000);
}

function renderPages(
  records: EnquiryPdfRecord[],
  date: string,
  status: EnquiryStatus,
) {
  const pages: HTMLCanvasElement[] = [];
  let page = createPage(date, status, records.length);
  pages.push(page.canvas);

  for (const record of records) {
    const layout = layoutRecord(page.context, record);
    if (page.y + layout.height > PAGE_HEIGHT - 48) {
      page = createPage(date, status, records.length);
      pages.push(page.canvas);
    }
    const currentLayout = layoutRecord(page.context, record);
    drawRecord(page.context, currentLayout, page.y);
    page.y += currentLayout.height + 10;
  }

  for (let index = 0; index < pages.length; index += 1) {
    const context = pages[index].getContext("2d");
    if (!context) continue;
    context.fillStyle = "#77786f";
    context.font = "9px Arial, sans-serif";
    context.fillText(
      "Private Admin copy - contains customer enquiry details",
      MARGIN,
      PAGE_HEIGHT - 23,
    );
    context.textAlign = "right";
    context.fillText(`Page ${index + 1} of ${pages.length}`, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 23);
    context.textAlign = "left";
  }

  return pages;
}

function createPage(
  date: string,
  status: EnquiryStatus,
  count: number,
) {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Your browser could not prepare the PDF. Please try again.");
  context.scale(CANVAS_SCALE, CANVAS_SCALE);
  context.fillStyle = "#fffdf7";
  context.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
  context.fillStyle = "#34452e";
  context.font = "bold 11px Arial, sans-serif";
  context.fillText("SHARDA MICA PALACE", MARGIN, 40);
  context.font = "bold 23px Georgia, serif";
  context.fillText("Enquiry report", MARGIN, 72);
  context.fillStyle = "#55584f";
  context.font = "11px Arial, sans-serif";
  context.fillText(`Date: ${formatReportDate(date)} (India time)`, MARGIN, 96);
  context.fillText(`Status: ${statusLabel(status)}    Enquiries: ${count}`, MARGIN, 114);
  context.strokeStyle = "#d9d2c3";
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(MARGIN, 128);
  context.lineTo(PAGE_WIDTH - MARGIN, 128);
  context.stroke();
  return { canvas, context, y: 145 };
}

interface RecordLayout {
  height: number;
  titleLines: string[];
  metaLines: string[];
  contactLines: string[];
  messageLines: string[];
}

function layoutRecord(context: CanvasRenderingContext2D, record: EnquiryPdfRecord): RecordLayout {
  context.font = "bold 13px Arial, sans-serif";
  const title = record.customerName.trim() || sourceLabel(record.source);
  const titleLines = wrapText(context, title, CONTENT_WIDTH - 28);
  context.font = "10px Arial, sans-serif";
  const metaLines = wrapText(
    context,
    `${sourceLabel(record.source)} | ${formatTimestamp(record.createdAt)} | ${record.status === "reviewed" ? "Reviewed" : "New"}`,
    CONTENT_WIDTH - 28,
  );
  const contact = [
    `Phone: ${record.customerPhone.trim() || "Not provided"}`,
    record.customerType.trim() ? `Customer type: ${record.customerType.trim()}` : "",
  ]
    .filter(Boolean)
    .join(" | ");
  const contactLines = wrapText(context, contact, CONTENT_WIDTH - 28);
  context.font = "10px Arial, sans-serif";
  const messageLines = wrapText(context, record.message.trim() || "No message provided.", CONTENT_WIDTH - 28);
  const height =
    20 +
    titleLines.length * 17 +
    metaLines.length * 14 +
    contactLines.length * 14 +
    14 +
    messageLines.length * 14 +
    12;
  return { height, titleLines, metaLines, contactLines, messageLines };
}

function drawRecord(context: CanvasRenderingContext2D, layout: RecordLayout, top: number) {
  context.fillStyle = "#ffffff";
  context.fillRect(MARGIN, top, CONTENT_WIDTH, layout.height);
  context.strokeStyle = "#e2dccf";
  context.lineWidth = 1;
  context.strokeRect(MARGIN, top, CONTENT_WIDTH, layout.height);
  let y = top + 18;
  context.fillStyle = "#34452e";
  context.font = "bold 13px Arial, sans-serif";
  for (const line of layout.titleLines) {
    context.fillText(line, MARGIN + 14, y);
    y += 17;
  }
  context.fillStyle = "#77786f";
  context.font = "10px Arial, sans-serif";
  for (const line of layout.metaLines) {
    context.fillText(line, MARGIN + 14, y);
    y += 14;
  }
  context.fillStyle = "#42443d";
  for (const line of layout.contactLines) {
    context.fillText(line, MARGIN + 14, y);
    y += 14;
  }
  y += 4;
  context.fillStyle = "#34452e";
  context.font = "bold 10px Arial, sans-serif";
  context.fillText("Message", MARGIN + 14, y);
  y += 14;
  context.fillStyle = "#42443d";
  context.font = "10px Arial, sans-serif";
  for (const line of layout.messageLines) {
    context.fillText(line, MARGIN + 14, y);
    y += 14;
  }
}

function wrapText(context: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const result: string[] = [];
  for (const paragraph of text.split(/\r?\n/u)) {
    const words = paragraph.split(/\s+/u).filter(Boolean);
    if (words.length === 0) {
      result.push("");
      continue;
    }
    let line = "";
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (context.measureText(candidate).width <= maxWidth) {
        line = candidate;
        continue;
      }
      if (line) result.push(line);
      line = "";
      for (const character of Array.from(word)) {
        const next = `${line}${character}`;
        if (context.measureText(next).width > maxWidth && line) {
          result.push(line);
          line = character;
        } else {
          line = next;
        }
      }
    }
    if (line) result.push(line);
  }
  return result;
}

function sourceLabel(source: string) {
  if (source === "contact") return "Contact form";
  if (source === "cart") return "Enquiry cart";
  return "Product request";
}

function statusLabel(status: EnquiryStatus) {
  return status === "all" ? "All enquiries" : status === "new" ? "New" : "Reviewed";
}

function formatReportDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(`${date}T12:00:00+05:30`));
}

function formatTimestamp(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(parsed);
}

async function canvasToJpeg(canvas: HTMLCanvasElement) {
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (value) => (value ? resolve(value) : reject(new Error("The PDF image could not be prepared."))),
      "image/jpeg",
      0.94,
    );
  });
  return new Uint8Array(await blob.arrayBuffer());
}

function buildPdf(images: Uint8Array[]) {
  const objectCount = 3 + images.length * 3;
  const objects: Uint8Array[] = new Array(objectCount);
  const pageIds = images.map((_, index) => 3 + index * 3);
  objects[1] = ascii("<< /Type /Catalog /Pages 2 0 R >>");
  objects[2] = ascii(`<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${images.length} >>`);

  images.forEach((image, index) => {
    const pageId = pageIds[index];
    const contentId = pageId + 1;
    const imageId = pageId + 2;
    const content = ascii(`q\n${PAGE_WIDTH} 0 0 ${PAGE_HEIGHT} 0 0 cm\n/Im0 Do\nQ`);
    objects[pageId] = ascii(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /XObject << /Im0 ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>`,
    );
    objects[contentId] = joinBytes([
      ascii(`<< /Length ${content.length} >>\nstream\n`),
      content,
      ascii("\nendstream"),
    ]);
    objects[imageId] = joinBytes([
      ascii(
        `<< /Type /XObject /Subtype /Image /Width ${CANVAS_WIDTH} /Height ${CANVAS_HEIGHT} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${image.length} >>\nstream\n`,
      ),
      image,
      ascii("\nendstream"),
    ]);
  });

  const parts: Uint8Array[] = [ascii("%PDF-1.4\n")];
  const offsets = new Array<number>(objectCount).fill(0);
  let byteLength = parts[0].length;
  for (let id = 1; id < objectCount; id += 1) {
    offsets[id] = byteLength;
    const objectBytes = joinBytes([ascii(`${id} 0 obj\n`), objects[id], ascii("\nendobj\n")]);
    parts.push(objectBytes);
    byteLength += objectBytes.length;
  }

  const xrefOffset = byteLength;
  const xref = ["xref", `0 ${objectCount}`, "0000000000 65535 f "];
  for (let id = 1; id < objectCount; id += 1) {
    xref.push(`${String(offsets[id]).padStart(10, "0")} 00000 n `);
  }
  parts.push(
    ascii(
      `${xref.join("\n")}\ntrailer\n<< /Size ${objectCount} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`,
    ),
  );
  return joinBytes(parts);
}

function ascii(value: string) {
  return encoder.encode(value);
}

function joinBytes(parts: Uint8Array[]) {
  const result = new Uint8Array(parts.reduce((length, part) => length + part.length, 0));
  let offset = 0;
  for (const part of parts) {
    result.set(part, offset);
    offset += part.length;
  }
  return result;
}
