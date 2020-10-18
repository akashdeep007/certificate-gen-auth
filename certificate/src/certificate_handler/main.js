const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib;
const inp = document.querySelector("#name");
const btn = document.querySelector("#submitBtn");

async function modifyPdf(name) {
  const url = "/cert.pdf";
  const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const Font = await pdfDoc.embedFont(StandardFonts.TimesRomanBoldItalic);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
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

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

inp.addEventListener("keypress", (event) => {
  if (event.keyCode === 13) {
    if (inp.value != "") {
      btn.click();
    } else {
      alert("Please Enter Name");
    }
  }
});
btn.addEventListener("click", async (event) => {
  var val = inp.value;
  if (val != "") {
    value = toTitleCase(val);
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

const btntoggle = document
  .querySelector(".dark-light")
  .addEventListener("click", () => {
    var element = document.body;
    element.classList.toggle("dark-mode");
  });
