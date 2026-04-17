import sharp from 'sharp'
import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outputDir = join(__dirname, '..', 'public', 'icons')

const svgTemplate = (size) => {
  const radius = size / 2
  const fontSize = Math.round(size * 0.45)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.2)}" fill="#E84C1D"/>
  <text x="${radius}" y="${radius + fontSize * 0.37}" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold" fill="white" text-anchor="middle">S</text>
</svg>`
}

const sizes = [16, 32, 192, 512]

for (const size of sizes) {
  const svg = Buffer.from(svgTemplate(size))
  await sharp(svg).png().toFile(join(outputDir, `icon-${size}.png`))
  console.log(`Generated icon-${size}.png`)
}

console.log('All icons generated.')
