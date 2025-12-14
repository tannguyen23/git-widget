const { ipcMain } = require('electron');
const simpleGit = require('simple-git');

/**
 * Handler để lấy dữ liệu Git
 */

async function handleGetGitData() {
  const git = simpleGit();

  try {
    // 1. Kiểm tra Repository
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      return {
        currentBranch: '',
        currentCommitHash: '',
        changes: { staged: 0, modified: 0, untracked: 0, total: 0 },
        toPush: 0,
        error: 'Không phải Git repository',
      };
    }

    // 2. Lấy thông tin Branch và Commit Hash
    // Chạy song song để tối ưu hiệu suất
    const [branchResult, hashResult] = await Promise.all([
      git.revparse(['--abbrev-ref', 'HEAD']),
      git.revparse(['--short', 'HEAD'])
    ]);
    const currentBranch = branchResult.trim();
    const currentCommitHash = hashResult.trim();

    // 3. Lấy chi tiết thay đổi file (SỬ DỤNG HÀM getGitFileChanges)
    // Đây là bước quan trọng để đảm bảo đồng bộ dữ liệu.
    const fileChanges = await getGitFileChanges();

    // 4. Tính toán các con số tổng hợp từ danh sách file chi tiết
    const stagedCount = fileChanges.staged.length;
    const modifiedCount = fileChanges.modified.length;
    const untrackedCount = fileChanges.untracked.length;
    const totalChanges = stagedCount + modifiedCount + untrackedCount;

    const changes = {
      staged: stagedCount,
      modified: modifiedCount,
      untracked: untrackedCount,
      total: totalChanges
    };

    // 5. Lấy số commit chưa push
    let toPush = 0;
    try {
      // Cần đảm bảo 'origin' tồn tại. Có thể thêm logic kiểm tra remote.
      const log = await git.log([`origin/${currentBranch}..HEAD`]);
      toPush = log.total;
    } catch (_e) {
      // Lỗi thường gặp khi chưa có remote branch hoặc lần push đầu tiên
      console.log('Chưa thể xác định số commit toPush (có thể do chưa có remote branch).');
      toPush = 0;
    }

    return { currentBranch, currentCommitHash, changes, toPush };

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định trong handleGetGitData';
    console.error(errorMessage);
    // Trả về trạng thái lỗi an toàn cho UI
    return {
        currentBranch: '',
        currentCommitHash: '',
        changes: { staged: 0, modified: 0, untracked: 0, total: 0 },
        toPush: 0,
        error: errorMessage
    };
  }
}

/**
 * Hàm helper để lấy danh sách chi tiết các file thay đổi.
 * Chỉ trả về danh sách file, không bao gồm các biến đếm (counts).
 */
async function getGitFileChanges() {
  const git = simpleGit();

  try {
    // Kiểm tra xem đây có phải là Git repository không
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      // Trả về các mảng rỗng nếu không phải là repository
      return {
        staged: [],
        modified: [],
        untracked: []
      };
    }

    // Lấy trạng thái git
    const status = await git.status();

    // Khởi tạo object kết quả CHỈ chứa các danh sách file
    const fileLists = {
      staged: [],
      modified: [],
      untracked: []
    };

    console.log("Git status files:", status.files);

    // Duyệt qua từng file trong kết quả status để phân loại vào các danh sách
    status.files.forEach(file => {
      // --- Phân loại file dựa trên cột index và working_dir ---

      // 1. STAGED: File đã được 'git add' (cột Index khác ' ' và không phải '?')
      // Ưu tiên xếp vào staged nếu nó có thay đổi trong index.
      if (file.index !== ' ' && file.index !== '?') {
        fileLists.staged.push({
          path: file.path,
          status: 'staged',
          index: file.index,
        });
      }
      // 2. UNTRACKED: File mới chưa từng được git theo dõi (cả 2 cột đều là '?')
      else if (file.index === '?' && file.working_dir === '?') {
        fileLists.untracked.push({
          path: file.path,
          status: 'untracked',
          index : file.index,
        });
      }
      // 3. MODIFIED: File đã được theo dõi nhưng có thay đổi trong working directory
      // (cột Working Directory khác ' ' và không phải '?')
      else if (file.working_dir !== ' ' && file.working_dir !== '?') {
        fileLists.modified.push({
          path: file.path,
          status: 'modified',
          index: file.index,
        });
      }
    });

    // Hàm sắp xếp theo đường dẫn để danh sách dễ nhìn hơn (tùy chọn)
    const sortByPath = (a, b) => a.path.localeCompare(b.path);

    // Áp dụng sắp xếp
    fileLists.staged.sort(sortByPath);
    fileLists.modified.sort(sortByPath);
    fileLists.untracked.sort(sortByPath);

    return fileLists;

  } catch (error) {
    console.error("Error getting file changes:", error);
    // Trả về đối tượng với các mảng rỗng nếu gặp lỗi
    return {
        staged: [], modified: [], untracked: []
    };
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
  ipcMain.handle('git:get-file-changes', getGitFileChanges);
  ipcMain.handle('git:stage-all', handleStageAll);
  ipcMain.handle('git:commit', handleCommit); // Commit cần message
  ipcMain.handle('git:sync', handleSync);
}

module.exports = { registerGitHandlers };
