const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib;
const inp = document.querySelector("#name");
const btn = document.querySelector("#submitBtn");
let clickcount=-1;
let value;
let qr = document.getElementById("qrcode");

 //qrGenerator
function qrgenerate(name) {
  let qrcode = new QRCode(qr);
  qrcode.makeCode(name);
}

//pdf editor
async function modifyPdf(name) {  
  const url = "/cert.pdf";
  const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  let srcval = qr.childNodes[clickcount].src;
  const pngUrl = srcval;
  const pngImageBytes = await fetch(pngUrl).then((res) => res.arrayBuffer());
  const pngImage = await pdfDoc.embedPng(pngImageBytes);
  const pngDims = pngImage.scale(0.5);
  firstPage.drawImage(pngImage, {
    x: firstPage.getWidth() / 2 - pngDims.width / 2 + 175,
    y: firstPage.getHeight() / 2 - pngDims.height + 250,
    width: pngDims.width,
    height: pngDims.height,
  });
  const Font = await pdfDoc.embedFont(StandardFonts.TimesRomanBoldItalic);
  const { width, height } = firstPage.getSize();
  firstPage.drawText(name, {
    x: 340,
    y: 245,
    size: 30,
    font: Font,
    color: rgb(0, 0, 0),
  });
  const pdfBytes = await pdfDoc.save();
  download(pdfBytes, "dscCertificate.pdf", "application/pdf");
}

//Change name to camel case
function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

//Enter keypress
inp.addEventListener("keypress", (event) => {
  if (event.keyCode === 13) {
    if (inp.value != "") {
      btn.click();
    } else {
      alert("Please Enter Name");
    }
  }
});

//button click
btn.addEventListener("click", async (event) => {
  var val = inp.value;
  if (val != "") {
    clickcount+=2;
    value = toTitleCase(val);
    qrgenerate(value);
    modifyPdf(value);
    try {
      const res = await fetch("http://127.0.0.1:8080/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: value }),
      });
    } catch (err) {
      console.log("error", err);
    }
  } else {
    alert("Please Enter Name");
  }
});

//dark mode
const btntoggle = document
  .querySelector(".dark-light")
  .addEventListener("click", () => {
    var element = document.body;
    element.classList.toggle("dark-mode");
  });
