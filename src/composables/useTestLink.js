import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { testLinkApi } from '@/api/testLink'
import { testWebsiteApi } from '@/api/testWebsite'

// 预加载 qrcode 库
import('qrcode').then(module => {
  window.QRCode = module.default
  console.log('QRCode library loaded')
})

export function useTestLink() {
  // 纯业务数据
  const testLinks = ref([])
  const selectedWebsiteId = ref(null)
  const selectedWebsite = ref(null)
  const qrCodeCache = ref({})
  const currentDomainType = ref('prod') // 当前选择的环境类型，用于显示

  // 表单数据
  const formData = reactive({
    id: null,
    website_id: '',
    test_url: '',
    test_title: ''
  })

  // 批量表单数据
  const batchFormData = reactive({
    website_ids: [],
    test_links_data: ''
  })

  // 解析后的链接数据
  const parsedLinks = ref([])

  // 表单验证规则
  const formRules = {
    website_id: [
      { required: true, message: '请选择测试网站', trigger: 'change' }
    ],
    test_url: [
      { required: true, message: '请输入测试URL', trigger: 'blur' }
    ],
    test_title: [
      { required: true, message: '请输入测试标题', trigger: 'blur' }
    ]
  }

  // 批量表单验证规则
  const batchFormRules = {
    website_ids: [
      { required: true, message: '请选择测试网站', trigger: 'change' }
    ],
    test_links_data: [
      { required: true, message: '请输入测试链接数据', trigger: 'blur' }
    ]
  }

  // 统一的URL处理工具函数
  const urlUtils = {
    // 清理域名，确保末尾没有/
    cleanDomain: (domain) => {
      return domain?.endsWith('/') ? domain.slice(0, -1) : domain
    },
    
    // 清理base路径，确保首尾都有/
    cleanBase: (base) => {
      if (!base) return ''
      let cleanBase = base.startsWith('/') ? base : `/${base}`
      return cleanBase.endsWith('/') ? cleanBase : `${cleanBase}/`
    },
    
    // 清理测试URL，确保不以/开头
    cleanTestUrl: (testUrl) => {
      return testUrl?.startsWith('/') ? testUrl.slice(1) : testUrl
    },
    
    // 构建完整URL
    buildFullUrl: (domain, base, testUrl) => {
      const cleanDomain = urlUtils.cleanDomain(domain)
      const cleanBase = urlUtils.cleanBase(base)
      const cleanTestUrl = urlUtils.cleanTestUrl(testUrl)
      return `${cleanDomain}${cleanBase}${cleanTestUrl}`
    },
    
    // 解析URL，提取base后的部分
    parseTestUrl: (fullUrl, basePath) => {
      if (!fullUrl || !basePath) return fullUrl
      
      // 如果输入的不是完整URL，直接返回
      if (!fullUrl.startsWith('http')) {
        return fullUrl
      }
      
      try {
        const url = new URL(fullUrl)
        const fullPath = url.pathname + url.search + url.hash
        const cleanBase = urlUtils.cleanBase(basePath)
        
        // 使用split取base后的部分
        const parts = fullPath.split(cleanBase)
        if (parts.length > 1) {
          const testUrl = parts[1]
          return urlUtils.cleanTestUrl(testUrl)
        }
        
        // 如果不包含base，返回整个path（去掉开头的/）
        return urlUtils.cleanTestUrl(fullPath)
      } catch (error) {
        console.error('URL解析失败:', error)
        return fullUrl
      }
    }
  }

  // 获取完整URL的方法
  const getFullUrl = (row) => {
    if (!selectedWebsite.value || !row.test_url) return ''
    
    const domain = selectedWebsite.value[currentDomainType.value === 'prod' ? 'prod_domain' : 'test_domain']
    const base = selectedWebsite.value.script_base || ''
    
    return urlUtils.buildFullUrl(domain, base, row.test_url)
  }

  // 生成二维码
  const generateQRCode = async (linkId, url) => {
    try {
      if (qrCodeCache.value[linkId]) {
        return
      }

      // 检查 QRCode 是否已加载
      if (!window.QRCode) {
        // 如果还没加载，动态导入
        const QRCodeModule = await import('qrcode')
        window.QRCode = QRCodeModule.default
      }
      
      const qrCodeDataURL = await window.QRCode.toDataURL(url, {
        width: 120,
        height: 120,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'M'
      })

      qrCodeCache.value[linkId] = qrCodeDataURL
    } catch (error) {
      console.error('生成二维码失败:', error)
      ElMessage.error('生成二维码失败: ' + error.message)
    }
  }

  // 解析测试链接数据
  const parseTestLinks = (data, domain) => {
    parsedLinks.value = []

    if (!data || !domain) {
      return { ok: false, error: '缺少必要信息：数据或域名为空' }
    }

    const lines = data.split('\n').filter(line => line.trim())
    const links = []

    for (const line of lines) {
      const trimmedLine = line.trim()
      if (!trimmedLine) continue

      const spaceIndex = trimmedLine.indexOf(' ')
      if (spaceIndex === -1) {
        return { ok: false, error: `格式错误：缺少空格分隔（${trimmedLine}）` }
      }

      const testTitle = trimmedLine.substring(0, spaceIndex).trim()
      const urlInput = trimmedLine.substring(spaceIndex + 1).trim()

      if (!testTitle || !urlInput) {
        return { ok: false, error: `格式错误：标题或URL为空（${trimmedLine}）` }
      }

      let testUrl = ''
      let extractedDomain = domain
      const basePath = selectedWebsite.value?.script_base || ''

      if (!(urlInput.startsWith('http://') || urlInput.startsWith('https://'))) {
        return { ok: false, error: `必须填写完整URL（http/https）：${urlInput}` }
      }
      
      try {
        const url = new URL(urlInput)
        let pathname = url.pathname || '/'
        let search = url.search || ''

        // 组合路径和查询参数
        let fullPath = pathname + search

        if (basePath && fullPath.startsWith(basePath)) {
          const sliced = fullPath.slice(basePath.length)
          testUrl = sliced.startsWith('/') ? sliced.slice(1) : sliced
        } else {
          testUrl = fullPath.startsWith('/') ? fullPath.slice(1) : fullPath
        }

        extractedDomain = url.origin
      } catch (error) {
        return { ok: false, error: `解析URL失败：${urlInput}` }
      }

      links.push({
        test_title: testTitle,
        test_url: testUrl,
        domain: extractedDomain
      })
    }

    parsedLinks.value = links
    return { ok: true, count: links.length }
  }

  // 获取测试链接列表
  const loadTestLinks = async () => {
    if (!selectedWebsiteId.value) return

    try {
      const response = await testWebsiteApi.getTestLinksByWebsiteId(selectedWebsiteId.value)

      let list = []
      let total = 0
      const respData = response?.data
      if (respData?.list) {
        list = respData.list
        total = (respData.total ?? respData?.data?.total ?? respData.list.length) || 0
      } else if (respData?.data?.list) {
        list = respData.data.list
        total = (respData.data.total ?? respData.total ?? respData.data.list.length) || 0
      } else if (Array.isArray(respData)) {
        list = respData
        total = respData.length
      }

      testLinks.value = Array.isArray(list) ? list : []

      return { list: testLinks.value, total }
    } catch (error) {
      console.error('获取测试链接失败:', error)
      ElMessage.error('获取测试链接失败')
      return { list: [], total: 0 }
    }
  }

  // 重置表单
  const resetForm = () => {
    Object.assign(formData, {
      id: null,
      website_id: selectedWebsiteId.value || '',
      test_url: '',
      test_title: ''
    })
  }

  // 重置批量表单
  const resetBatchForm = () => {
    Object.assign(batchFormData, {
      website_ids: selectedWebsiteId.value ? [selectedWebsiteId.value] : [],
      test_links_data: ''
    })
  }

  // 提交表单
  const submitForm = async (formRef) => {
    if (!formRef) return false

    try {
      await formRef.validate()

      // 解析URL，提取base后的部分
      const parsedTestUrl = urlUtils.parseTestUrl(formData.test_url, selectedWebsite.value?.script_base)

      const submitData = {
        website_id: formData.website_id,
        test_url: parsedTestUrl,
        test_title: formData.test_title
      }

      if (formData.id) {
        await testLinkApi.updateTestLink(formData.id, submitData)
        ElMessage.success('测试链接更新成功')
      } else {
        await testLinkApi.createTestLink(submitData)
        ElMessage.success('测试链接创建成功')
      }

      return true
    } catch (error) {
      console.error('提交失败:', error)
      ElMessage.error('提交失败: ' + (error?.response?.data?.message || error.message))
      return false
    }
  }

  // 提交批量表单
  const submitBatchForm = async (formRef) => {
    if (!formRef) return false

    try {
      await formRef.validate()

      // 解析测试链接数据
      const domain = selectedWebsite.value?.[currentDomainType.value === 'prod' ? 'prod_domain' : 'test_domain'] || ''
      const parseResult = parseTestLinks(batchFormData.test_links_data, domain)
      
      if (!parseResult.ok) {
        ElMessage.error(parseResult.error)
        return false
      }

      const submitData = {
        website_ids: batchFormData.website_ids,
        test_links: parsedLinks.value
      }

      await testLinkApi.batchCreateTestLinks(submitData)
      ElMessage.success(`批量创建成功，共创建 ${parseResult.count} 个测试链接`)

      return true
    } catch (error) {
      console.error('批量提交失败:', error)
      ElMessage.error('批量提交失败: ' + (error?.response?.data?.message || error.message))
      return false
    }
  }

  // 删除测试链接
  const deleteTestLink = async (row) => {
    try {
      await ElMessageBox.confirm(
        `确定要删除测试链接"${row.test_title}"吗？`,
        '确认删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )

      await testLinkApi.deleteTestLink(row.id)
      ElMessage.success('删除成功')
      return true
    } catch (error) {
      if (error !== 'cancel') {
        console.error('删除失败:', error)
        ElMessage.error('删除失败: ' + (error?.response?.data?.message || error.message))
      }
      return false
    }
  }

  // 复制测试链接
  const copyTestLink = async (row) => {
    try {
      const testUrl = getFullUrl(row)
      
      if (!testUrl) {
        ElMessage.error('无法生成完整链接')
        return
      }
      
      // 检查是否支持现代剪贴板 API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(testUrl)
        ElMessage.success('链接已复制到剪贴板')
      } else {
        // 降级到传统方法
        const textArea = document.createElement('textarea')
        textArea.value = testUrl
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        
        try {
          const successful = document.execCommand('copy')
          if (successful) {
            ElMessage.success('链接已复制到剪贴板')
          } else {
            throw new Error('复制命令失败')
          }
        } catch (err) {
          throw new Error('复制失败，请手动复制')
        } finally {
          document.body.removeChild(textArea)
        }
      }
    } catch (error) {
      console.error('复制失败:', error)
      ElMessage.error('复制失败: ' + error.message)
    }
  }

  // 设置选中的测试网站
  const setSelectedWebsite = (website) => {
    selectedWebsite.value = website
    selectedWebsiteId.value = website?.id || null
  }

  // 清除选择
  const clearSelection = () => {
    selectedWebsite.value = null
    selectedWebsiteId.value = null
    testLinks.value = []
  }

  // 填充默认批量数据
  const fillDefaultBatchData = () => {
    if (!selectedWebsite.value) {
      ElMessage.warning('请先选择测试网站')
      return
    }

    const domain = selectedWebsite.value[currentDomainType.value === 'prod' ? 'prod_domain' : 'test_domain']
    const base = selectedWebsite.value.script_base || ''
    
    if (!domain) {
      ElMessage.warning('测试网站域名配置不完整')
      return
    }

    // 根据网站类型生成不同的默认测试链接
    const defaultTestUrls = [
      'pages/userInfo/userInfo',
      'pages/testJump/testJump'
    ]

    const testLinks = defaultTestUrls.map((testUrl, index) => {
      const fullUrl = urlUtils.buildFullUrl(domain, base, testUrl)
      return `测试链接${index + 1} ${fullUrl}`
    }).join('\n')

    batchFormData.test_links_data = testLinks
  }

  // 构建URL的辅助方法
  const buildUrl = (fixedPath) => {
    if (!selectedWebsite.value) return ''
    const domain = selectedWebsite.value[currentDomainType.value === 'prod' ? 'prod_domain' : 'test_domain'] || ''
    const base = selectedWebsite.value.script_base || ''
    return urlUtils.buildFullUrl(domain, base, fixedPath)
  }

  return {
    // 纯业务数据
    testLinks,
    selectedWebsiteId,
    selectedWebsite,
    qrCodeCache,
    currentDomainType,
    formData,
    batchFormData,
    parsedLinks,
    formRules,
    batchFormRules,
    // 业务方法
    getFullUrl,
    generateQRCode,
    loadTestLinks,
    resetForm,
    resetBatchForm,
    submitForm,
    fillDefaultBatchData,
    submitBatchForm,
    deleteTestLink,
    copyTestLink,
    setSelectedWebsite,
    clearSelection,
    buildUrl
  }
}
