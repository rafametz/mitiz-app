import sharp from "sharp";
import { mkdirSync } from "fs";

mkdirSync("public/icons", { recursive: true });

const src = "public/mitiz-simbolo.svg";

async function run() {
  // icones "any": logo ocupando quase todo o quadro, fundo transparente
  for (const size of [192, 512]) {
    await sharp(src, { density: 384 })
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(`public/icons/icon-${size}.png`);
  }

  // icone "maskable": logo com margem de seguranca e fundo solido (branco sal)
  for (const size of [192, 512]) {
    const logoSize = Math.round(size * 0.7);
    const logo = await sharp(src, { density: 384 })
      .resize(logoSize, logoSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();

    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 242, g: 236, b: 230, alpha: 1 },
      },
    })
      .composite([{ input: logo, gravity: "center" }])
      .png()
      .toFile(`public/icons/icon-maskable-${size}.png`);
  }

  console.log("Icones PWA gerados em public/icons/");
}

run();
