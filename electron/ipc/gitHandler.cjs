const { ipcMain } = require('electron');
const simpleGit = require('simple-git');

/**
 * Handler để lấy dữ liệu Git
 */
async function handleGetGitData() {
  try {
    const git = simpleGit();

    // Kiểm tra xem đây có phải là Git repository không
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      return {
        currentBranch: '',
        currentCommitHash: '',
        changes: 0,
        toPush: 0,
        error: 'Không phải Git repository',
      };
    }

    // Lấy branch hiện tại
    const branch = await git.revparse(['--abbrev-ref', 'HEAD']);
    const currentBranch = branch.trim();

    const shortHash = await git.revparse(['--short', 'HEAD']);
    const currentCommitHash = shortHash.trim();

    // Lấy số lượng file thay đổi
    const status = await git.status();
    const changes = status.files.length;

    // Lấy số commit chưa push
    let toPush = 0;
    try {
      const log = await git.log([`origin/${currentBranch}..HEAD`]);
      toPush = log.total;
    } catch (_e) {
      // Nếu origin không tồn tại hoặc branch chưa được push
      toPush = 0;
    }

    return { currentBranch, currentCommitHash, changes, toPush };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
    return { currentBranch: '', currentCommitHash: '', changes: 0, toPush: 0, error: errorMessage };
  }
}

/**
 * Thêm tất cả file thay đổi vào staging area (git add .)
 */
async function handleStageAll() {
  try {
    console.log("Staging all changes...");
    const git = simpleGit();
    await git.add('.');
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Thực hiện commit (git commit -m "...")
 * @param {string} message - Nội dung commit
 */
async function handleCommit(event, message) { // Nhận nội dung commit từ Renderer
  if (!message || message.trim() === '') {
    return { success: false, error: 'Commit message không được để trống.' };
  }
  try {
    const git = simpleGit();
    const result = await git.commit(message);
    return { success: true, commitHash: result.commit };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Đồng bộ hóa (Pull và Push)
 */
async function handleSync() {
  try {
    const git = simpleGit();
    // Cố gắng pull trước để cập nhật code mới nhất
    await git.pull('origin', (await git.revparse(['--abbrev-ref', 'HEAD'])).trim());
    // Sau đó push
    await git.push('origin', (await git.revparse(['--abbrev-ref', 'HEAD'])).trim());
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Đăng ký IPC handlers
 */
function registerGitHandlers() {
  ipcMain.handle('git:get-data', handleGetGitData);
  ipcMain.handle('git:stage-all', handleStageAll);
  ipcMain.handle('git:commit', handleCommit); // Commit cần message
  ipcMain.handle('git:sync', handleSync);
}

module.exports = { registerGitHandlers };
