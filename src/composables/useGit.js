import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { gitApi } from '@/api/git'

export function useGit() {
  // 响应式状态
  const gitStatus = ref(null)
  const pullLoading = ref(false)
  const pushLoading = ref(false)
  const pullResult = ref(null)
  const pushResult = ref(null)
  const realtimeOutput = ref([])

  // Git日志相关状态
  const gitLog = ref([])
  const gitLogLoading = ref(false)

  // 获取Git状态
  const getGitStatus = async () => {
    try {
      const data = await gitApi.getStatus()

      if (data.success) {
        gitStatus.value = data.data
        return data.data
      } else {
        console.error('获取Git状态失败:', data.message)
        ElMessage.warning('获取Git状态失败: ' + (data.message || '未知错误'))
        return null
      }
    } catch (error) {
      console.error('获取Git状态失败:', error)
      ElMessage.error('获取Git状态失败: ' + error.message)
      return null
    }
  }

  // 刷新Git状态
  const refreshGitStatus = async () => {
    const status = await getGitStatus()
    if (status) {
      ElMessage.success('Git状态刷新成功')
    }
    return status
  }

  // 拉取代码
  const pullCode = async () => {
    pullLoading.value = true
    pullResult.value = null

    try {
      // 先获取Git状态
      const status = await getGitStatus()
      if (!status) {
        ElMessage.error('无法获取Git状态，请检查Git仓库配置')
        return null
      }


      // 执行拉取操作
      const data = await gitApi.pull({
        remote_name: 'origin',
        branch_name: status.branch || 'uni/funNovel/devNew'
      })

      if (data.success) {
        pullResult.value = data.data
        ElMessage.success('代码拉取成功')
        // 刷新Git状态
        await getGitStatus()
        return data.data
      } else {
        const errorMsg = data.error || data.message || '代码拉取失败'
        ElMessage.error(errorMsg)

        pullResult.value = {
          success: false,
          message: data.message || '代码拉取失败',
          error: data.error || data.message || '代码拉取失败'
        }
        return null
      }
    } catch (error) {
      console.error('代码拉取失败:', error)
      ElMessage.error('代码拉取失败: ' + error.message)
      return null
    } finally {
      pullLoading.value = false
    }
  }

  // 推送代码
  const pushCode = async (commitMessage) => {
    // 检查提交信息
    if (!commitMessage || !commitMessage.trim()) {
      ElMessage.warning('请输入提交信息')
      return null
    }

    pushLoading.value = true
    pushResult.value = null

    try {
      // 先获取Git状态
      const status = await getGitStatus()
      if (!status) {
        ElMessage.error('无法获取Git状态，请检查Git仓库配置')
        return null
      }

      // 检查是否有修改
      if (status.status === 'clean' || status.status === 'up to date') {
        ElMessage.warning('当前没有需要提交的修改，请先修改代码后再提交')
        return null
      }

      const data = await gitApi.commit({
        commit_msg: commitMessage.trim(),
        branch_name: status.branch || 'uni/funNovel/devNew',
        remote_name: 'origin',
        target_ref: `HEAD:refs/for/${status.branch || 'uni/funNovel/devNew'}`
      })

      if (data.success) {
        pushResult.value = data.data
        ElMessage.success('代码提交成功')
        // 刷新Git状态
        await getGitStatus()
        return data.data
      } else {
        const errorMsg = data.error || data.message || '代码提交失败'
        ElMessage.error(errorMsg)

        pushResult.value = {
          success: false,
          message: data.message || '代码提交失败',
          error: data.error || data.message || '代码提交失败'
        }
        return null
      }
    } catch (error) {
      console.error('代码提交失败:', error)
      ElMessage.error('代码提交失败: ' + error.message)
      return null
    } finally {
      pushLoading.value = false
    }
  }

  // 重置到远程分支
  const resetToRemote = async (branchName) => {
    try {
      const data = await gitApi.resetToRemote({
        branch_name: branchName
      })

      if (data.success) {
        ElMessage.success('重置成功')
        // 刷新Git状态
        await getGitStatus()
        return data.data
      } else {
        ElMessage.error('重置失败: ' + (data.message || '未知错误'))
        return null
      }
    } catch (error) {
      console.error('重置失败:', error)
      ElMessage.error('重置失败: ' + error.message)
      return null
    }
  }

  // 在指定代码库创建新分支
  const pullBranchFromRepository = async (repositoryUrl, branchName, defaultBranch = 'master') => {
    try {
      const data = await gitApi.pullBranch({
        repository_url: repositoryUrl,
        branch_name: branchName,
        remote_name: 'origin',
        default_branch: defaultBranch
      })

      console.log('分支创建响应:', data)
      if (data.success) {
        ElMessage.success('分支创建成功')
        return data.data
      } else {
        ElMessage.error('分支创建失败: ' + (data.error || data.message))
        return null
      }
    } catch (error) {
      console.error('分支创建失败:', error)
      ElMessage.error('分支创建失败: ' + error.message)
      return null
    }
  }

  // 获取Git日志
  const getGitLog = async (params = {}) => {
    gitLogLoading.value = true

    try {
      const data = await gitApi.getLog(params)

      if (data.success) {
        gitLog.value = data.data.commits || []
        return data.data
      } else {
        console.error('获取Git日志失败:', data.message)
        ElMessage.warning('获取Git日志失败: ' + (data.message || '未知错误'))
        return null
      }
    } catch (error) {
      console.error('获取Git日志失败:', error)
      ElMessage.error('获取Git日志失败: ' + error.message)
      return null
    } finally {
      gitLogLoading.value = false
    }
  }

  return {
    // 状态
    gitStatus,
    pullLoading,
    pushLoading,
    pullResult,
    pushResult,
    realtimeOutput,
    gitLog,
    gitLogLoading,

    // 方法
    getGitStatus,
    refreshGitStatus,
    pullCode,
    pushCode,
    resetToRemote,
    pullBranchFromRepository,
    getGitLog
  }
}
