<template>
  <div class="email-form-component">
    <!-- <div class="form-header">
      <div class="form-title">发送邮件通知</div>
      <p>发送邮件给相关人员，通知网站创建计划</p>
    </div> -->

    <el-form
      ref="emailFormRef"
      :model="emailForm"
      :rules="emailRules"
      label-width="120px"
      class="email-form"
    >
      <el-form-item label="发件人邮箱" prop="userEmail">
        <el-input
          v-model="emailForm.userEmail"
          placeholder="请输入您的邮箱账户"
        />
        <div class="form-tip">请输入您要用来发送邮件的邮箱地址</div>
      </el-form-item>

      <el-form-item label="邮箱密码" prop="userPassword">
        <el-input
          v-model="emailForm.userPassword"
          type="password"
          placeholder="请输入邮箱密码"
          show-password
        />
      </el-form-item>



      <el-form-item label="收件人" prop="to">
        <el-select
          v-model="emailForm.to"
          filterable
          allow-create
          default-first-option
          placeholder="请选择或输入收件人邮箱"
          style="width: 100%"
        >
          <el-option
            v-for="email in defaultToOptions"
            :key="email"
            :label="email"
            :value="email"
          />
        </el-select>
        <div class="form-tip">可选择默认收件人或输入新的邮箱地址</div>
      </el-form-item>

      <el-form-item label="抄送人" prop="cc">
        <el-select
          v-model="emailForm.cc"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="请选择或输入抄送人邮箱"
          style="width: 100%"
        >
          <el-option
            v-for="email in defaultCcOptions"
            :key="email"
            :label="email"
            :value="email"
          />
        </el-select>
        <div class="form-tip">可选择默认抄送人或输入新的邮箱地址</div>
      </el-form-item>

      <el-form-item label="邮件主题" prop="subject">
        <el-input
          v-model="emailForm.subject"
          placeholder="请输入邮件主题"
        />
      </el-form-item>

      <!-- 发布配置模板时显示小说多选 -->
      <el-form-item v-if="template === 'publish'" label="选择小说" prop="selectedNovels">
        <el-select
          v-model="emailForm.selectedNovels"
          multiple
          placeholder="请选择要创建发布配置的小说"
          style="width: 100%"
          :loading="novelsLoading"
          @change="updateEmailContent"
        >
          <el-option
            v-for="novel in availableNovels"
            :key="novel.value"
            :label="novel.label"
            :value="novel.value"
          >
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span>{{ novel.label }}</span>
              <el-tag size="small" :type="novel.hostType">{{ novel.hostLabel }}</el-tag>
            </div>
          </el-option>
        </el-select>
        <div class="form-tip">选择需要创建发布配置的小说（支持多选）</div>
      </el-form-item>

      <el-form-item label="邮件内容" prop="content">
        <!-- 编辑提示信息 -->
        <div class="editor-tips">
          <el-alert
            type="info"
            :closable="false"
            :show-icon="false"
          >
            <template #default>
              <div class="tips-content">
                <p>请根据实际情况修改小说名称、域名地址、主体名称和重定向链接参数</p>
              </div>
            </template>
          </el-alert>
        </div>

        <div class="rich-editor-container">
          <div
            ref="editorRef"
            class="rich-editor"
            contenteditable="true"
            @input="onEditorInput"
            @paste="onPaste"
            @keydown="onKeyDown"
            placeholder="请输入邮件内容"
            style="word-wrap: break-word; overflow-wrap: break-word; word-break: break-word; max-width: 100%;"
          ></div>
        </div>
        <div class="editor-actions">
          <el-button link @click="useTemplate">
            {{ props.template === 'publish' ? '使用发布配置模板' : '使用域名申请模板' }}
          </el-button>
          <el-button link @click="clearContent">清空内容</el-button>
          <el-button link @click="toggleHtmlMode">{{ isHtmlMode ? '预览模式' : 'HTML模式' }}</el-button>
        </div>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="sendEmail"
          :loading="sending"
          :disabled="!isFormValid"
        >
          发送邮件
        </el-button>
<!--        <el-button @click="$emit('next-step')" :disabled="!emailForm.content">-->
<!--          下一步：创建网站-->
<!--        </el-button>-->
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, defineEmits, defineProps, onMounted, nextTick, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { emailAPI } from '@/api/email'
import { useNovelSelector } from '@/composables/useConfig'

// 定义事件
const emit = defineEmits(['email-sent', 'next-step'])

// 定义属性
const props = defineProps({
  defaultTo: {
    type: String,
    default: ''
  },
  defaultSubject: {
    type: String,
    default: '小说业务需域名申请'
  },
  template: {
    type: String,
    default: 'domain' // 'domain' 域名申请模板, 'publish' 发布配置模板
  }
})

const sending = ref(false)
const emailFormRef = ref()
const editorRef = ref()
const isHtmlMode = ref(false)

// 使用小说选择器
const {
  novelsLoading,
  allNovelData,
  fetchNovelOptions
} = useNovelSelector()

// 可用的小说选项（转换为适合select组件的格式）
const availableNovels = computed(() => {
  return allNovelData.value.map(novel => ({
    value: `${novel.clientId}-${novel.host}-${novel.brandCode}`,
    label: `${novel.appName} (${novel.brandCode})`,
    hostLabel: getHostLabel(novel.host),
    hostType: getHostType(novel.host),
    data: novel
  }))
})

// 获取端的显示标签
const getHostLabel = (host) => {
  const hostMap = {
    'tth5': 'TT H5',
    'ksh5': 'KS H5', 
    'h5': 'H5'
  }
  return hostMap[host] || host
}

// 获取端的标签类型
const getHostType = (host) => {
  const typeMap = {
    'tth5': 'primary',
    'ksh5': 'success',
    'h5': 'warning'
  }
  return typeMap[host] || 'info'
}

// 默认收件人选项
const defaultToOptions = [
  'aogb@fun.tv',
  'chenwy@fun.tv'
]

// 默认抄送人选项
const defaultCcOptions = [
  'chenwy@fun.tv',
  'lijj@fun.tv',
  'zhengcheng@fun.tv',
  'aogb@fun.tv',
]

// 邮件表单数据
const emailForm = reactive({
  userEmail: '',
  userPassword: '',
  to: props.defaultTo,
  cc: [], // 抄送人，支持多个
  subject: props.defaultSubject,
  content: '',
  selectedNovels: [] // 选择的小说列表
})

// 邮件表单验证规则
const emailRules = {
  userEmail: [
    { required: true, message: '请输入发件人邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  userPassword: [
    { required: true, message: '请输入邮箱密码', trigger: 'blur' }
  ],
  to: [
    { required: true, message: '请输入收件人邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  subject: [
    { required: true, message: '请输入邮件主题', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入邮件内容', trigger: 'blur' }
  ],
  selectedNovels: [
    { 
      required: false, // 不再必需，可以默认选择第一个小说
      message: '请选择至少一个小说', 
      trigger: 'change'
    }
  ]
}

// 检查表单是否有效
const isFormValid = computed(() => {
  // 检查所有必填字段是否都有值
  const hasRequiredFields = emailForm.userEmail &&
                           emailForm.userPassword &&
                           emailForm.to &&
                           emailForm.subject &&
                           emailForm.content

  // 检查邮箱格式（简单验证）
  const isValidEmailFormat = (email) => {
    return email && email.includes('@') && email.includes('.') && email.length > 5
  }

  const hasValidEmails = isValidEmailFormat(emailForm.userEmail) &&
                        isValidEmailFormat(emailForm.to)

  // 检查内容是否为空（去除HTML标签后）
  const hasValidContent = emailForm.content &&
                         emailForm.content.replace(/<[^>]*>/g, '').trim().length > 0

  return hasRequiredFields && hasValidEmails && hasValidContent
})

// 邮件模板
const emailTemplates = {
  // 域名申请模板
  domain: () => {
    // 如果没有选择小说，默认使用第一个小说
    let novelsToProcess = emailForm.selectedNovels
    if (!novelsToProcess || novelsToProcess.length === 0) {
      if (availableNovels.value.length > 0) {
        novelsToProcess = [availableNovels.value[0].value]
      } else {
        return `你好，${emailForm.to ? emailForm.to.split('@')[0] : ''}老师：<br>
小说业务需进行h5投放，需要申请域名使用，具体如下：<br><br>
<strong>暂无可用的小说配置</strong><br><br>
如有疑问，随时沟通，谢谢！`
      }
    }

    let content = `你好，${emailForm.to ? emailForm.to.split('@')[0] : ''}老师：<br>
小说业务需进行h5投放，需要申请域名使用，具体如下：<br><br>`

    // 为每个选择的小说生成域名申请信息
    novelsToProcess.forEach((selectedValue, index) => {
      const novel = availableNovels.value.find(n => n.value === selectedValue)
      if (!novel) return

      const novelData = novel.data
      const brandCode = novelData.brandCode
      const ttLoginCallbackDomain = novelData.tt_login_callback_domain

      // 生成域名
      let testDomain, prodDomain
      if (ttLoginCallbackDomain) {
        // 使用小说配置中的tt_login_callback_domain作为测试环境域名
        testDomain = ttLoginCallbackDomain
        // 生产环境域名是测试环境域名去掉test
        prodDomain = testDomain.replace('test', '')
      } else {
        // 如果没有配置tt_login_callback_domain，使用默认规则
        testDomain = `noveltest${brandCode}.funshion.tv`
        prodDomain = `novel${brandCode}.funshion.tv`
      }

      if (index > 0) content += '<br>'

      content += `<strong>${index + 1}. ${novel.label}</strong><br>
● <strong>域名申请：</strong><br>
${prodDomain}<br>
${testDomain}<br>
解析到 <strong>funshion.tv</strong> 的服务器即可<br><br>
● <strong>访问域名根目录重定向到：</strong><br>
<a href="https://${testDomain}">https://${testDomain}</a><br>
<a href="https://${prodDomain}">https://${prodDomain}</a><br><br>`
    })

    content += `如有疑问，随时沟通，谢谢！`
    return content
  },

  // 发布配置模板
  publish: () => {
    // 如果没有选择小说，默认使用第一个小说
    let novelsToProcess = emailForm.selectedNovels
    if (!novelsToProcess || novelsToProcess.length === 0) {
      if (availableNovels.value.length > 0) {
        novelsToProcess = [availableNovels.value[0].value]
      } else {
        return `你好，${emailForm.to ? emailForm.to.split('@')[0] : ''}老师：<br>
因小说业务需要，辛苦帮忙创建发布配置，具体如下：<br><br>
<strong>暂无可用的小说配置</strong><br><br>
如有疑问，随时沟通，谢谢！`
      }
    }

    let content = `你好，${emailForm.to ? emailForm.to.split('@')[0] : ''}老师：<br>
因小说业务需要，辛苦帮忙创建发布配置，具体如下：<br><br>`

    // 为每个选择的小说生成配置
    novelsToProcess.forEach((selectedValue, index) => {
      const novel = availableNovels.value.find(n => n.value === selectedValue)
      if (!novel) return

      const novelData = novel.data
      const brandCode = novelData.brandCode
      const originalHost = novelData.host
      const scriptBase = novelData.script_base || brandCode
      const ttLoginCallbackDomain = novelData.tt_login_callback_domain

      // 根据端类型映射host值
      const getHostForBranch = (host) => {
        if (host === 'tth5') return 'tt'
        if (host === 'ksh5') return 'ks'
        if (host === 'h5') return 'h5'
        return host // 默认返回原值
      }

      const hostForBranch = getHostForBranch(originalHost)

      // 生成域名
      let testDomain, prodDomain
      if (ttLoginCallbackDomain) {
        // 使用小说配置中的tt_login_callback_domain作为测试环境域名
        testDomain = `https://${ttLoginCallbackDomain}`
        // 生产环境域名是测试环境域名去掉test
        prodDomain = testDomain.replace('test', '')
      } else {
        // 如果没有配置tt_login_callback_domain，使用默认规则
        testDomain = `https://noveltest${brandCode}.funshion.tv`
        prodDomain = `https://novel${brandCode}.funshion.tv`
      }

      // 生成分支名（使用映射后的host）
      const releaseBranch = `release_${hostForBranch}_${brandCode}`
      const masterBranch = `master_${hostForBranch}_${brandCode}`

      if (index > 0) content += '<br>'
      
      content += `<strong>${index + 1}. ${novel.label}</strong><br>
<strong>//正式环境</strong><br>
域名：${prodDomain}<br>
目录：${scriptBase}<br>
代码：git@code.funshion.com:somalia/funnovel.git<br>
分支：${releaseBranch}<br><br>
<strong>//测试环境</strong><br>
域名：${testDomain}<br>
目录：${scriptBase}<br>
代码：git@code.funshion.com:somalia/funnovel.git<br>
分支：${masterBranch}<br><br>`
    })

    content += '如有疑问，随时沟通，谢谢！'
    return content
  }
}

// 获取当前模板内容
const generateEmailTemplate = () => {
  const templateType = props.template || 'domain'
  const template = emailTemplates[templateType]
  return template ? template() : emailTemplates.domain()
}

// 更新邮件内容（当小说选择改变时）
const updateEmailContent = () => {
  if (props.template === 'publish') {
    emailForm.content = generateEmailTemplate()
    // 如果编辑器存在，更新编辑器内容
    nextTick(() => {
      if (editorRef.value && !isHtmlMode.value) {
        editorRef.value.innerHTML = emailForm.content
      }
    })
  }
}

// 富文本编辑器相关方法
const onEditorInput = () => {
  if (editorRef.value) {
    emailForm.content = editorRef.value.innerHTML
  }
}

const onPaste = (e) => {
  e.preventDefault()
  const text = e.clipboardData.getData('text/plain')
  document.execCommand('insertText', false, text)
}

const onKeyDown = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    document.execCommand('insertHTML', false, '<br>')
  }
}

const toggleHtmlMode = () => {
  isHtmlMode.value = !isHtmlMode.value
  if (isHtmlMode.value) {
    // HTML模式：显示HTML代码
    if (editorRef.value) {
      editorRef.value.textContent = emailForm.content
    }
  } else {
    // 预览模式：显示格式化内容
    if (editorRef.value) {
      editorRef.value.innerHTML = emailForm.content
    }
  }
}

const setEditorContent = (html) => {
  emailForm.content = html
  if (editorRef.value) {
    editorRef.value.innerHTML = html
  }
}

// 初始化编辑器
onMounted(async () => {
  // 如果是发布配置模板，先加载小说数据
  if (props.template === 'publish') {
    await fetchNovelOptions()
  }
  
  await nextTick()
  if (editorRef.value) {
    // 设置初始内容
    if (emailForm.content) {
      editorRef.value.innerHTML = emailForm.content
    } else {
      // 如果没有内容，自动加载对应模板
      const template = generateEmailTemplate()
      setEditorContent(template)
    }
  }
})

// 使用模板
const useTemplate = () => {
  const template = generateEmailTemplate()
  setEditorContent(template)
  const templateName = props.template === 'publish' ? '发布配置' : '域名申请'
  ElMessage.success(`已加载${templateName}邮件模板`)
}

// 清空内容
const clearContent = () => {
  setEditorContent('')
  ElMessage.info('已清空邮件内容')
}



// 发送邮件
const sendEmail = async () => {
  try {
    await emailFormRef.value.validate()

    sending.value = true

    // 调用后端邮件API（用户输入邮箱和授权码）
    const response = await emailAPI.sendEmailWithUserAuth({
      user_email: emailForm.userEmail,
      user_password: emailForm.userPassword,
      to_email: emailForm.to,
      cc_emails: emailForm.cc, // 抄送人邮箱列表
      subject: emailForm.subject,
      content: emailForm.content
    })

    if (response.success) {
      ElMessage.success('邮件发送成功！')
      // 触发邮件发送成功事件
      emit('email-sent', {
        success: true,
        data: response.data,
        message: response.message
      })
    }
  } catch (error) {
    console.error('发送邮件失败:', error)
    // const errorMessage = '邮件发送失败，请检查网络连接或联系管理员'
    // ElMessage.error(errorMessage)
  } finally {
    sending.value = false
  }
}

// 暴露方法给父组件
defineExpose({
  resetForm: () => {
    emailFormRef.value?.resetFields()
    setEditorContent('')
  },
  getFormData: () => ({ ...emailForm }),
  setFormData: (data) => {
    Object.assign(emailForm, data)
    if (data.content && editorRef.value) {
      editorRef.value.innerHTML = data.content
    }
  }
})
</script>

<style scoped>
.email-form-component {
  width: 100%;
}

.editor-tips {
  margin-bottom: 16px;
}

.tips-content {
  font-size: 13px;
  line-height: 1.6;
}

.tips-content p {
  margin: 0;
  color: #606266;
}

/* .form-header {
  margin-bottom: 30px;
  text-align: center;
}

.form-title {
  font-size: 20px;
  color: #303133;
  margin-bottom: 8px;
  font-weight: 600;
}

.form-header p {
  color: #909399;
  margin: 0;
} */

/* 邮件表单 */
.email-form {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.form-tip .el-button {
  padding: 0;
  margin-right: 16px;
  font-size: 12px;
}

.html-tip {
  display: inline-block;
  margin-left: 16px;
  padding: 4px 8px;
  background-color: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 4px;
  color: #0369a1;
  font-size: 11px;
  line-height: 1.4;
}

/* 富文本编辑器样式 */
.rich-editor-container {
  width: 100%;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.rich-editor-container:hover {
  border-color: #c0c4cc;
}

.rich-editor-container:focus-within {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.rich-editor {
  min-height: 200px;
  padding: 12px;
  outline: none;
  line-height: 1.6;
  color: #303133;
  font-size: 14px;
  overflow-y: auto;
}

.rich-editor:empty:before {
  content: attr(placeholder);
  color: #c0c4cc;
  pointer-events: none;
}

.rich-editor strong {
  font-weight: bold;
}

.rich-editor a {
  color: #409eff;
  text-decoration: underline;
}

.rich-editor a:hover {
  color: #337ecc;
}

/* 编辑器操作按钮样式 */
.editor-actions {
  margin-top: 8px;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.editor-actions .el-button {
  padding: 4px 8px;
  font-size: 12px;
  color: #606266;
}

.editor-actions .el-button:hover {
  color: #409eff;
}

/* 小屏幕响应式样式 */
@media (max-width: 768px) {
  .rich-editor {
    min-height: 150px;
    padding: 8px;
    font-size: 13px;
  }

  /* 编辑器操作按钮在小屏幕上换行 */
  .editor-actions {
    gap: 8px;
  }

  .editor-actions .el-button {
    font-size: 11px;
    padding: 2px 6px;
  }

  /* 表单提示文字 */
  .form-tip {
    font-size: 11px;
  }

  /* 提示框样式 */
  .tips-content {
    font-size: 12px;
  }
}

/* 表单项样式 */
.email-form .el-form-item {
  margin-bottom: 24px;
}

.email-form .el-form-item__label {
  font-weight: 600;
  color: #303133;
}

.email-form .el-input__wrapper {
  border-radius: 6px;
}

.email-form .el-input__wrapper:hover {
  border-color: #409eff;
}

.email-form .el-input__wrapper.is-focus {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .email-form {
    max-width: 100%;
  }
}

/* 禁用按钮样式 */
.el-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.el-button:disabled:hover {
  transform: none !important;
  box-shadow: none !important;
}
</style>
