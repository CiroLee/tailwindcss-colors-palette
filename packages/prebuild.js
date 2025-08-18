/* eslint-env node */
// 同步 README.md 和 LICENSE
import fs from 'fs';
import path from 'path';

// 复制文件函数
const copyFile = (source, destination) => {
  try {
    const sourcePath = path.resolve(source);
    const destPath = path.resolve(destination);

    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`📋 Copied ${source} -> ${destination}`);
    } else {
      console.warn(`⚠️  Source file not found: ${source}`);
    }
  } catch (error) {
    console.error(`❌ Error copying ${source}:`, error.message);
  }
};

// 主函数
const prebuild = () => {
  console.log('📋 Preparing package files...\n');

  // 复制 README 和 LICENSE
  copyFile('../README.md', './README.md');
  copyFile('../LICENSE', './LICENSE');

  console.log('\n✅ Package files prepared');
};

// 运行预构建
prebuild();
