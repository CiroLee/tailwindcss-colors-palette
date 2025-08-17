/* eslint-env node */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import chokidar from 'chokidar';

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
    return (stats.size / 1024).toFixed(2) + ' KB';
  }
  return 'N/A';
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

// 构建单个色板文件（开发模式 - 不压缩）
const buildThemeFile = (file) => {
  const inputPath = path.join(colorsDir, file);
  const outputPath = path.join(distDir, file);
  
  console.log(`🔄 ${file}`);
  try {
    execSync(`npx postcss ${inputPath} -o ${outputPath} --verbose`, { stdio: 'inherit' });
    const size = getFileSize(outputPath);
    console.log(`  ✅ ${file} · ${size}`);
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
    
    // 构建最终文件（不压缩）
    execSync(`npx postcss ${tempOutputPath} -o ${mainOutputPath} --verbose`, { stdio: 'inherit' });
    
    // 清理临时文件
    fs.unlinkSync(tempOutputPath);
    
    const size = getFileSize(mainOutputPath);
    console.log(`  ✅ index.css · ${size}`);
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
  console.log('🚀 Initial development build...\n');
  
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

// 启动文件监听
const startWatching = () => {
  console.log('\n👀 Watching for changes...\n');
  
  // 监听色板文件变化
  const colorsWatcher = chokidar.watch(`${colorsDir}/**/*.css`, {
    ignored: /[/\\]\./,
    persistent: true,
    ignoreInitial: true
  });
  
  // 监听主入口文件变化
  const mainWatcher = chokidar.watch('./src/index.css', {
    ignored: /[/\\]\./,
    persistent: true,
    ignoreInitial: true
  });
  
  // 色板文件变化处理
  colorsWatcher.on('change', (filePath) => {
    const fileName = path.basename(filePath);
    console.log(`\n📝 ${fileName} changed`);
    buildThemeFile(fileName);
    buildMainIndex(); // 重新构建主入口文件
  });
  
  // 主入口文件变化处理
  mainWatcher.on('change', () => {
    console.log('\n📝 index.css changed');
    buildMainIndex();
  });
  
  // 新增文件处理
  colorsWatcher.on('add', (filePath) => {
    const fileName = path.basename(filePath);
    if (fileName.endsWith('.css')) {
      console.log(`\n➕ ${fileName} added`);
      buildThemeFile(fileName);
      buildMainIndex(); // 重新构建主入口文件
    }
  });
  
  // 删除文件处理
  colorsWatcher.on('unlink', (filePath) => {
    const fileName = path.basename(filePath);
    console.log(`\n🗑️  ${fileName} removed`);
    
    // 删除对应的dist文件
    const distFilePath = path.join(distDir, fileName);
    if (fs.existsSync(distFilePath)) {
      fs.unlinkSync(distFilePath);
    }
    
    buildMainIndex(); // 重新构建主入口文件
  });
  
  console.log('🎯 Watching:');
  console.log(`  ${colorsDir}/*.css`);
  console.log(`  ./src/index.css`);
  console.log('\nPress Ctrl+C to stop');
};

// 主程序
const main = () => {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (command === '--watch' || command === '-w') {
    // 先执行初始构建，然后启动监听
    initialBuild();
    startWatching();
  } else {
    // 单次构建模式
    initialBuild();
  }
};

// 检查chokidar是否安装
if (!fs.existsSync(path.resolve('./node_modules/chokidar'))) {
  console.error('❌ chokidar is required for file watching. Please install it:');
  console.log('   npm install chokidar --save-dev');
  console.log('   # or');
  console.log('   pnpm add chokidar --save-dev');
  process.exit(1);
}

// 运行主程序
main();