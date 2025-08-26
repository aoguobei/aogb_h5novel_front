import { ref } from 'vue'
import { ElMessage } from 'element-plus'

export function useGit() {
  // 响应式状态
  const gitStatus = ref(null)
  const pullLoading = ref(false)
  const pushLoading = ref(false)
  const pullResult = ref(null)
  const pushResult = ref(null)
  const realtimeOutput = ref([])

  // 获取Git状态
  const getGitStatus = async (basePath = '') => {
    try {
      const response = await fetch(`/api/git/status?base_path=${basePath}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
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
  const refreshGitStatus = async (basePath = '') => {
    const status = await getGitStatus(basePath)
    if (status) {
      ElMessage.success('Git状态刷新成功')
    }
    return status
  }

  // 拉取代码
  const pullCode = async (basePath = '') => {
    pullLoading.value = true
    pullResult.value = null

    try {
      // 先获取Git状态
      const status = await getGitStatus(basePath)
      if (!status) {
        ElMessage.error('无法获取Git状态，请检查Git仓库配置')
        return null
      }

      // 如果分支领先，先重置分支
      if (status.ahead && status.ahead > 0) {
        ElMessage.info('检测到分支领先，正在重置分支...')
        
        const resetResponse = await fetch('/api/git/reset-branch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            remote_name: 'origin',
            branch_name: status.branch || 'uni/funNovel/devNew',
            base_path: basePath
          })
        })

        const resetData = await resetResponse.json()
        if (!resetData.success) {
          ElMessage.error('重置分支失败: ' + (resetData.error || resetData.message))
          return null
        }
        
        ElMessage.success('分支重置成功，继续拉取代码...')
      }

      // 执行拉取操作
      const response = await fetch('/api/git/pull', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          remote_name: 'origin',
          branch_name: status.branch || 'uni/funNovel/devNew',
          base_path: basePath
        })
      })

      const data = await response.json()

      if (data.success) {
        pullResult.value = data.data
        ElMessage.success('代码拉取成功')
        // 刷新Git状态
        await getGitStatus(basePath)
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
  const pushCode = async (commitMessage, basePath = '') => {
    // 检查提交信息
    if (!commitMessage || !commitMessage.trim()) {
      ElMessage.warning('请输入提交信息')
      return null
    }

    pushLoading.value = true
    pushResult.value = null

    try {
      // 先获取Git状态
      const status = await getGitStatus(basePath)
      if (!status) {
        ElMessage.error('无法获取Git状态，请检查Git仓库配置')
        return null
      }

      // 检查是否有修改
      if (status.status === 'clean' || status.status === 'up to date') {
        ElMessage.warning('当前没有需要提交的修改，请先修改代码后再提交')
        return null
      }

      const response = await fetch('/api/git/commit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          commit_msg: commitMessage.trim(),
          branch_name: status.branch || 'uni/funNovel/devNew',
          remote_name: 'origin',
          target_ref: `HEAD:refs/for/${status.branch || 'uni/funNovel/devNew'}`,
          base_path: basePath
        })
      })

      const data = await response.json()

      if (data.success) {
        pushResult.value = data.data
        ElMessage.success('代码提交成功')
        // 刷新Git状态
        await getGitStatus(basePath)
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



  // 重置分支到远程状态
  const resetBranch = async (remoteName = 'origin', branchName, basePath = '') => {
    try {
      const response = await fetch('/api/git/reset-branch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          remote_name: remoteName,
          branch_name: branchName,
          base_path: basePath
        })
      })

      const data = await response.json()
      if (data.success) {
        ElMessage.success('分支重置操作成功')
        // 刷新Git状态
        await getGitStatus(basePath)
        return data.data
      } else {
        ElMessage.error('分支重置操作失败: ' + (data.error || data.message))
        return null
      }
    } catch (error) {
      console.error('分支重置操作失败:', error)
      ElMessage.error('分支重置操作失败: ' + error.message)
      return null
    }
  }

  // 在指定代码库创建新分支
  const pullBranchFromRepository = async (repositoryUrl, branchName, defaultBranch = 'master') => {
    try {
      const response = await fetch('/api/git/pull-branch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          repository_url: repositoryUrl,
          branch_name: branchName,
          remote_name: 'origin',
          default_branch: defaultBranch
        })
      })

      const data = await response.json()
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

  return {
    // 状态
    gitStatus,
    pullLoading,
    pushLoading,
    pullResult,
    pushResult,
    realtimeOutput,
    
    // 方法
    getGitStatus,
    refreshGitStatus,
    pullCode,
    pushCode,
    resetBranch,
    pullBranchFromRepository,
  }
} 