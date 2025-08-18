import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 源目录和目标目录
const sourceDir = path.join(__dirname, 'src', 'colors');
const targetDirInApp = path.join(__dirname, '..', 'app', 'src', 'config', 'colors');

// 确保目标目录存在
if (!fs.existsSync(targetDirInApp)) {
  fs.mkdirSync(targetDirInApp, { recursive: true });
}

// 读取并转换CSS文件为TypeScript对象
function convertCssToTs(cssFilePath, tsFilePath) {
  const cssContent = fs.readFileSync(cssFilePath, 'utf-8');

  // 使用正则表达式匹配CSS变量
  const variableRegex = /--color-([^:]+):\s*([^;]+);/g;
  const colorObject = {};

  let match;
  while ((match = variableRegex.exec(cssContent)) !== null) {
    const key = match[1].trim();
    const value = match[2].trim();
    colorObject[key] = value;
  }

  // 从文件名获取变量名（首字母大写）
  const fileName = path.basename(tsFilePath, '.ts');
  const variableName = fileName.charAt(0) + fileName.slice(1) + 'Colors';
  const typeName = fileName.charAt(0) + fileName.slice(1) + 'ColorKeys';

  // 生成TypeScript内容
  const tsContent = `export const ${variableName} = ${JSON.stringify(colorObject, null, 2)} as const;

export type ${typeName} = keyof typeof ${variableName};`;

  // 写入TypeScript文件
  fs.writeFileSync(tsFilePath, tsContent, 'utf-8');
  console.log(`✅ 已生成: ${tsFilePath} (${variableName})`);
}

// 处理所有CSS文件
function processAllCssFiles() {
  const cssFiles = fs.readdirSync(sourceDir).filter((file) => file.endsWith('.css'));

  cssFiles.forEach((cssFile) => {
    const baseName = path.basename(cssFile, '.css');
    const cssFilePath = path.join(sourceDir, cssFile);

    // 只在app目录下的config目录中生成同名ts文件
    const tsFilePathInApp = path.join(targetDirInApp, `${baseName}.ts`);

    // 转换并生成ts文件
    convertCssToTs(cssFilePath, tsFilePathInApp);
  });
}

// 执行转换
console.log('🔄 开始转换CSS文件到TypeScript对象...');
processAllCssFiles();
console.log('🎉 所有文件转换完成！');
