import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const projectRoot = path.resolve(import.meta.dirname, "..");

const assets = [
  {
    input: "src/assets/marcas/tecmacol.svg",
    output: "public/assets/brands/tecmacol.webp",
    trim: true,
    width: 640,
  },
  {
    input: "src/assets/marcas/landimotos.svg",
    output: "public/assets/brands/landimotos.webp",
    trim: true,
    width: 640,
  },
  {
    input: "src/assets/images/Responsive.svg",
    output: "public/assets/images/responsive.webp",
    width: 1_000,
  },
  {
    input: "src/assets/images/Soluciones personalizadas.svg",
    output: "public/assets/images/soluciones-personalizadas.webp",
    width: 1_000,
  },
  {
    input: "src/assets/images/seo.svg",
    output: "public/assets/images/seo.webp",
    width: 1_000,
  },
  {
    input: "src/assets/images/bg-header.png",
    output: "public/assets/images/hero.webp",
    width: 1_200,
  },
];

for (const asset of assets) {
  const inputPath = path.join(projectRoot, asset.input);
  const outputPath = path.join(projectRoot, asset.output);
  await mkdir(path.dirname(outputPath), { recursive: true });

  let pipeline = sharp(inputPath, { density: 180 });

  if (asset.trim) {
    pipeline = pipeline.trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } });
  }

  const info = await pipeline
    .resize({ fit: "inside", width: asset.width, withoutEnlargement: true })
    .webp({ alphaQuality: 90, effort: 6, quality: 82, smartSubsample: true })
    .toFile(outputPath);

  const [source, optimized] = await Promise.all([stat(inputPath), stat(outputPath)]);
  const saving = Math.round((1 - optimized.size / source.size) * 100);
  console.log(
    `${asset.output}: ${info.width}x${info.height}, ${optimized.size} bytes (${saving}% smaller)`,
  );
}
