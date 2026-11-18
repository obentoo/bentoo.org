import type { Strings } from './types';

export const strings = {
  subscribePlaceholder: 'you@email.com',
  subscribeButton: '通知我',
  successMsg: '请查收邮件并完成确认。',
  errorMsg: '请稍后再试。',
  privacyConsent: '订阅即表示你同意我们的隐私政策',
  privacyLinkLabel: '隐私',
  languageToggleLabel: 'zh-CN',
  footerCopyright: '手工打造，源码优先 · © 2026 obentoo.org',
  privacyPageTitle: '隐私',
  privacyPageBody: `Bentoo 尊重你的隐私，只收集宣布上线所需的最少数据。

我们收集什么。如果你通过订阅表单提交电子邮件地址，该地址会直接发送给我们的邮件列表服务商 Buttondown。我们还会从 Cloudflare Web Analytics 获得匿名、汇总的页面浏览量统计（不存储 IP 地址，不进行跨站跟踪，不使用 Cookie）。

用途。你的电子邮件地址仅用于在 Bentoo 上线时通知你。匿名的页面浏览量统计帮助我们了解哪些页面变体更受欢迎。

保留期限。Buttondown 会保留你的电子邮件地址，直到你通过每封邮件中的一键退订链接退订为止。Cloudflare Web Analytics 只保留汇总计数，从不保留个人数据。

localStorage。本网站在你的设备上使用两个 localStorage 键，它们从不同步到服务器："bentoo-variant"（分配给你本次会话的视觉变体，TTL 为 24 小时）和 "bentoo-lang"（你的语言偏好，TTL 为 24 小时）。你可以随时通过浏览器的网站数据设置清除它们。

联系方式。如需访问或删除你的数据，或有任何隐私方面的请求，请发送邮件至 contact@obentoo.org。`,
  notFoundTitle: '页面未找到',
  notFoundBody: '此页面不存在 — 返回首页。',
  notFoundBackLabel: '← 返回首页',
  shuffleAria: '随机切换首页变体',
  shuffleTip: '随机换主题',
  languageMenuLabel: '切换语言',
  noscriptVariantsHint: 'JavaScript 已禁用。请访问以下任一页面：',
  loaderAriaLabel: '正在加载',
  indexTitle: 'bentoo — 正在加载',
  indexDescription: 'Bentoo 是易于上手的 Gentoo Linux Stage5。',
  privacyPageDescription: 'Bentoo 预发布网站如何处理你的数据。',
  backLink: '← 返回',
  noticesTitle: '通知',
  noticesIntro: 'Bentoo 的安全公告、版本发布与新闻，按最近更新时间排列。通知正文以英文发布。',
  noticeType_security: '安全',
  noticeType_release: '发布',
  noticeType_news: '新闻',
  noticeType_announcement: '公告',
  noticeSeverity_info: '信息',
  noticeSeverity_warning: '警告',
  noticeSeverity_critical: '严重',
  noticeAffects: '受影响的软件包',
  noticePublished: '发布于',
  noticeUpdated: '更新于',
  noticesEmpty: '暂无通知。',
  noticesFeedLinks: '订阅通知源：',
} as const satisfies Strings;
