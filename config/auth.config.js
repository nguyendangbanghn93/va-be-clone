module.exports = {
  secret: "Ftech-ai",
  refreshTokenSecret: "Ftech-ai-refresh-token",
  tokenLife: 86400, // 1 ngày
  refreshTokenLife: 86400 * 5, // 5 ngày
  salt: 8,
  activeEmailLife: 86400 * 3 * 1000, // 3 ngày,
  isActiveByMail: true,
  emailService: "gmail",
  emailHost: "smtp.gmail.com",
  emailUser: "va.crm.ftech@gmail.com",
  emailPass: "Vbn693178"
};
