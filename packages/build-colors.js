/* eslint-env node */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const colorsDir = path.resolve('./src/colors');
const distDir = path.resolve('./dist/colors');

// 确保dist目录存在
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

// 获取所有色板文件
const getThemeFiles = () => {
  return fs.readdirSync(colorsDir).filter((f) => f.endsWith('.css'));
};

// 获取文件大小
const getFileSize = (filePath) => {
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    return stats.size;
  }
  return 0;
};

// 提取CSS文件中的变量内容
const extractThemeContent = (cssContent) => {
  // 匹配 @theme { ... } 中的内容
  const themeMatch = cssContent.match(/@theme\s*\{([^}]*)\}/s);
  if (themeMatch) {
    return themeMatch[1].trim();
  }
  
  // 如果没有@theme块，尝试匹配CSS变量
  const varMatches = cssContent.match(/--[^:;]+:[^;]+;/g);
  if (varMatches) {
    return varMatches.join('\n').trim();
  }
  
  return '';
};

// 构建单个色板文件（压缩版本）
const buildThemeFile = (file) => {
  const inputPath = path.join(colorsDir, file);
  const outputPath = path.join(distDir, file);
  const minOutputPath = path.join(distDir, file);
  
  console.log(`🔄 ${file}`);
  try {
    // 构建未压缩版本
    execSync(`npx postcss ${inputPath} -o ${outputPath}`, { stdio: 'inherit' });
    
    // 构建压缩版本（直接覆盖原文件）
    execSync(`npx tailwindcss -i ${inputPath} -o ${minOutputPath} --minify`, { stdio: 'inherit' });
    
    const size = getFileSize(minOutputPath);
    console.log(`  ✅ ${file} · ${(size / 1024).toFixed(2)} KB`);
    return true;
  } catch (error) {
    console.error(`  ❌ ${file} · ${error.message}`);
    return false;
  }
};

// 构建主入口文件（合并所有内容到单个@theme块）
const buildMainIndex = () => {
  const mainInputPath = path.resolve('./src/index.css');
  const tempOutputPath = path.resolve('./dist/index.temp.css');
  const mainOutputPath = path.resolve('./dist/index.css');

  console.log('🔄 index.css');
  
  try {
    const themeFiles = getThemeFiles();
    
    // 读取原始入口文件内容
    let originalContent = '';
    if (fs.existsSync(mainInputPath)) {
      originalContent = fs.readFileSync(mainInputPath, 'utf8');
    }
    
    // 提取原始内容中的@theme内容
    const originalThemeContent = extractThemeContent(originalContent);
    
    // 收集所有色板文件的内容
    let allThemeContent = '';
    themeFiles.forEach((file) => {
      const filePath = path.join(colorsDir, file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const themeContent = extractThemeContent(content);
        if (themeContent) {
          allThemeContent += themeContent + '\n';
        }
      }
    });
    
    // 合并所有内容到单个@theme块
    let combinedContent = '';
    if (originalThemeContent) {
      combinedContent = `@theme {\n${originalThemeContent}\n${allThemeContent}\n}`;
    } else {
      combinedContent = `@theme {\n${allThemeContent}\n}`;
    }
    
    // 写入临时文件
    fs.writeFileSync(tempOutputPath, combinedContent);
    
    // 构建未压缩版本
    execSync(`npx postcss ${tempOutputPath} -o ${mainOutputPath}`, { stdio: 'inherit' });
    
    // 构建压缩版本（直接覆盖原文件）
    execSync(`npx tailwindcss -i ${tempOutputPath} -o ${mainOutputPath} --minify`, { stdio: 'inherit' });
    
    // 清理临时文件
    fs.unlinkSync(tempOutputPath);
    
    const size = getFileSize(mainOutputPath);
    console.log(`  ✅ index.css · ${(size / 1024).toFixed(2)} KB`);
    return true;
  } catch (error) {
    console.error(`  ❌ index.css · ${error.message}`);
    if (fs.existsSync(tempOutputPath)) {
      fs.unlinkSync(tempOutputPath);
    }
    return false;
  }
};

// 初始构建所有文件
const initialBuild = () => {
  console.log('🚀 Initial production build...\n');
  
  const themeFiles = getThemeFiles();
  let successCount = 0;
  
  // 构建所有色板文件
  themeFiles.forEach((file) => {
    if (buildThemeFile(file)) {
      successCount++;
    }
  });
  
  // 构建主入口文件
  if (buildMainIndex()) {
    successCount++;
  }
  
  console.log(`\n🎉 Built ${successCount}/${themeFiles.length + 1} files`);
};

// 运行主程序
const main = () => {
  initialBuild();
};

// 运行主程序
main();
