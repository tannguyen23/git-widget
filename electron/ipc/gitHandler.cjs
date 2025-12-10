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
        changes: 0,
        toPush: 0,
        error: 'Không phải Git repository',
      };
    }

    // Lấy branch hiện tại
    const branch = await git.revparse(['--abbrev-ref', 'HEAD']);
    const currentBranch = branch.trim();

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

    return { currentBranch, changes, toPush };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
    return { currentBranch: '', changes: 0, toPush: 0, error: errorMessage };
  }
}

/**
 * Đăng ký IPC handlers
 */
function registerGitHandlers() {
  ipcMain.handle('git:get-data', handleGetGitData);
}

module.exports = { registerGitHandlers };
