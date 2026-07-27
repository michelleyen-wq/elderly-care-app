import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (query) => new Promise(resolve => rl.question(query, resolve));

async function main() {
  console.log('===================================================');
  console.log('  CareMate 照護寶 - GitHub 自動發布與部署工具');
  console.log('===================================================\n');

  const token = await ask('🔑 請貼上您的 GitHub Personal Access Token (PAT):\n> ');
  if (!token.trim()) {
    console.log('❌ 未提供 Token，取消部署。');
    rl.close();
    return;
  }

  const cleanToken = token.trim();
  const repoName = 'elderly-care-app';

  // 1. Get user profile
  console.log('\n📡 正在連結至 GitHub API...');
  const userRes = await fetch('https://api.github.com/user', {
    headers: {
      'Authorization': `token ${cleanToken}`,
      'User-Agent': 'CareMate-Deployer'
    }
  });

  if (!userRes.ok) {
    console.log(`❌ Token 驗證失敗 (${userRes.status}): 請確認 Token 具備 repo 權限。`);
    rl.close();
    return;
  }

  const userData = await userRes.json();
  const username = userData.login;
  console.log(`✅ 成功登入 GitHub 帳號: ${username}`);

  // 2. Create repo if not exists
  console.log(`\n📦 正在檢查 / 建立 GitHub 儲存庫: ${username}/${repoName}...`);
  const createRepoRes = await fetch('https://api.github.com/user/repos', {
    method: 'POST',
    headers: {
      'Authorization': `token ${cleanToken}`,
      'Content-Type': 'application/json',
      'User-Agent': 'CareMate-Deployer'
    },
    body: JSON.stringify({
      name: repoName,
      description: 'CareMate 照護寶 - 長者居家照顧 APP',
      public: true,
      auto_init: true
    })
  });

  if (createRepoRes.status === 201) {
    console.log(`✨ 成功建立儲存庫: https://github.com/${username}/${repoName}`);
  } else {
    console.log(`ℹ️ 儲存庫已存在或直接進行檔案上傳。`);
  }

  // 3. Upload dist files to repository
  const distDir = path.join(process.cwd(), 'dist');
  if (!fs.existsSync(distDir)) {
    console.log('❌ 找不到 dist 編譯目錄，請先執行 node node_modules/vite/bin/vite.js build');
    rl.close();
    return;
  }

  function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
      const fullPath = path.join(dirPath, file);
      if (fs.statSync(fullPath).isDirectory()) {
        getAllFiles(fullPath, arrayOfFiles);
      } else {
        arrayOfFiles.push(fullPath);
      }
    });
    return arrayOfFiles;
  }

  const allFiles = getAllFiles(distDir);
  console.log(`\n🚀 準備上傳 ${allFiles.length} 個檔案至 GitHub...`);

  for (const filePath of allFiles) {
    const relativePath = path.relative(distDir, filePath).replace(/\\/g, '/');
    const fileContent = fs.readFileSync(filePath);
    const base64Content = fileContent.toString('base64');

    // Check if file sha exists
    let sha = null;
    const getFileRes = await fetch(`https://api.github.com/repos/${username}/${repoName}/contents/${relativePath}`, {
      headers: {
        'Authorization': `token ${cleanToken}`,
        'User-Agent': 'CareMate-Deployer'
      }
    });
    if (getFileRes.ok) {
      const fileData = await getFileRes.json();
      sha = fileData.sha;
    }

    // Upload file
    const uploadRes = await fetch(`https://api.github.com/repos/${username}/${repoName}/contents/${relativePath}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${cleanToken}`,
        'Content-Type': 'application/json',
        'User-Agent': 'CareMate-Deployer'
      },
      body: JSON.stringify({
        message: `Deploy ${relativePath} via CareMate Deployer`,
        content: base64Content,
        sha: sha || undefined
      })
    });

    if (uploadRes.ok) {
      console.log(`  ✓ 已成功發布 ${relativePath}`);
    } else {
      console.log(`  ⚠️ 發布 ${relativePath} 失敗 (${uploadRes.status})`);
    }
  }

  // 4. Enable GitHub Pages
  console.log('\n🌐 正在啟用免費 GitHub Pages 線上託管...');
  const pagesRes = await fetch(`https://api.github.com/repos/${username}/${repoName}/pages`, {
    method: 'POST',
    headers: {
      'Authorization': `token ${cleanToken}`,
      'Accept': 'application/vnd.github.+json',
      'User-Agent': 'CareMate-Deployer'
    },
    body: JSON.stringify({
      source: {
        branch: 'main',
        path: '/'
      }
    })
  });

  console.log('\n===================================================');
  console.log('🎉 CareMate 照護寶已成功發布至 GitHub！');
  console.log(`🔗 儲存庫網址: https://github.com/${username}/${repoName}`);
  console.log(`🌐 免費線上 APP 網址: https://${username}.github.io/${repoName}/`);
  console.log('===================================================\n');

  rl.close();
}

main().catch(err => {
  console.error('發生錯誤:', err);
  rl.close();
});
