import { ElMessage } from 'element-plus'

// 颜色验证函数
export const validateColor = (color) => {
  if (!color) return true
  const hexRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/
  const rgbaRegex = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+\s*)?\)$/
  const isValid = hexRegex.test(color) || rgbaRegex.test(color)
  return isValid
}

// 颜色输入处理函数
export const handleColorInput = (uiConfig, field, value) => {
  if (field === 'theme_bg_main' && value && value.startsWith('rgba')) {
    const rgbaMatch = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/)
    if (rgbaMatch) {
      const r = parseInt(rgbaMatch[1]).toString(16).padStart(2, '0')
      const g = parseInt(rgbaMatch[2]).toString(16).padStart(2, '0')
      const b = parseInt(rgbaMatch[3]).toString(16).padStart(2, '0')
      uiConfig[field] = `#${r}${g}${b}`
    }
  } else {
    uiConfig[field] = value
  }
}

// 生成抖音跳转首页URL
export const generateTTUrl = async (extraBaseConfig, novelConfig, isGeneratingUrl) => {
  isGeneratingUrl.value = true

  try {
    const requestParam = {
      business: extraBaseConfig.cl,
      path: 'pages/homePage/homePage',
      query: JSON.stringify({})
    }

    const header = {
      'Content-Type': 'application/x-www-form-urlencoded',
    }

    const response = await fetch('https://paps.funshion.com/v1/applet/createschema', {
      method: 'POST',
      headers: header,
      body: new URLSearchParams(requestParam)
    })

    const result = await response.json()

    if (result.data && result.data.schema) {
      novelConfig.tt_jump_home_url = result.data.schema
      ElMessage.success('抖音跳转首页URL生成成功！')
    } else {
      ElMessage.error('生成URL失败：' + (result.message || '未知错误'))
    }
  } catch (error) {
    console.error('生成URL失败:', error)
    ElMessage.error('生成URL失败：网络错误')
  } finally {
    isGeneratingUrl.value = false
  }
}

// 进度管理函数
export const updateProgress = (progressState, percentage, status, text, detail = null) => {
  progressState.percentage.value = percentage
  progressState.status.value = status
  progressState.text.value = text

  if (detail) {
    progressState.details.value.push(detail)
  }
}

export const resetProgress = (progressState) => {
  progressState.percentage.value = 0
  progressState.status.value = ''
  progressState.text.value = '准备创建...'
  progressState.details.value = []
} 