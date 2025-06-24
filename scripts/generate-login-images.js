// 로그인 창의 이미지에 관여하는 script파일입니다.
// assets/images의 파일을 모두 불러오고 이를 반영합니다.

import fs from "fs";
import path from "path";

// 경로 설정
const imagesDir = path.resolve("assets/images/login/main");
const outputFile = path.resolve("constants/LoginImages.ts");

const files = fs.readdirSync(imagesDir).filter((file) => file.endsWith(".png"));

const lines = [];
lines.push("export const loginImages = {");

for (const file of files) {
  const name = path.basename(file, ".png"); // ex: apple_logo
  const importPath = `@/assets/images/login/main/${file}`;
  lines.push(`  ${name}: require("${importPath}"),`);
}

lines.push("};");

fs.writeFileSync(outputFile, lines.join("\n"), "utf-8");

console.log("🚀 로그인 이미지가 최신화되었습니다.");
