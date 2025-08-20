import request from './request'

// 邮件相关API
export const emailAPI = {
  // 用户输入邮箱和授权码发送邮件
  sendEmailWithUserAuth: (data) => {
    return request({
      url: '/email/send-user',
      method: 'post',
      data
    })
  }
} 