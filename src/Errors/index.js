module.exports.EMAIL_DUPLICATED = {
    status: 200,
    success: false,
    data: null,
    message: 'Thông tin email đã tồn tại trong hệ thống',
    code: 10001,
    messageCode: "EMAIL_DUPLICATED",
};
module.exports.UNKNOWN_ERROR = {
    status: 400,
    success: false,
    data: null,
    message: 'Lỗi không xác định',
    code: 10002,
    messageCode: "UNKNOWN_ERROR",
};
module.exports.LOGIN_FAILED = {
    status: 401,
    success: false,
    data: null,
    message: 'Đăng nhập không thành công. Kiểm tra thông tin xác thực',
    code: 10003,
    messageCode: "LOGIN_FAILED",
};
module.exports.USER_NOT_FOUND = {
    status: 200,
    success: false,
    data: null,
    message: 'Không tìm thấy thông tin tài khoản',
    code: 10004,
    messageCode: "USER_NOT_FOUND",
};
module.exports.LOGIN_INVALID = {
    status: 200,
    success: false,
    data: null,
    message: 'Sai thông tin email hoặc mật khẩu',
    code: 10005,
    messageCode: "LOGIN_INVALID",
};
module.exports.ACCOUNT_DEACTIVE = {
    status: 200,
    success: false,
    data: null,
    message: 'Tài khoản chưa được kích hoạt',
    code: 10006,
    messageCode: "ACCOUNT_DEACTIVE",
};
module.exports.INCORRECT_PASSWORD = {
    status: 200,
    success: false,
    data: null,
    message: 'Sai thông tin mật khẩu',
    code: 10007,
    messageCode: "INCORRECT_PASSWORD",
};
module.exports.ID_INVALID = {
    status: 200,
    success: false,
    data: null,
    message: 'Id không hợp lệ',
    code: 10008,
    messageCode: "ID_INVALID",
};
module.exports.NOT_AUTHORIZED = {
    status: 200,
    success: false,
    data: null,
    message: 'Không được phép truy cập',
    code: 403,
    messageCode: "NOT_AUTHORIZED",
};
module.exports.INVALID_TOKEN = {
    status: 200,
    success: false,
    data: null,
    message: 'Token không hợp lệ',
    code: 401,
    messageCode: "INVALID_TOKEN",
};
module.exports.ONLY_ADMIN = {
    status: 200,
    success: false,
    data: null,
    message: 'Chỉ quản trị viên mới có quyền truy cập',
    code: 10010,
    messageCode: "ONLY_ADMIN",
};
module.exports.ONLY_USER = {
    status: 200,
    success: false,
    data: null,
    message: 'Chỉ người dùng mới có quyền truy cập',
    code: 10011,
    messageCode: "ONLY_USER",
};
module.exports.INVALID_EMAIL = {
    status: 200,
    success: false,
    data: null,
    message: 'Địa chỉ email không hợp lệ',
    code: 10012,
    messageCode: "INVALID_EMAIL",
};
module.exports.INVALID_PHONE = {
    status: 200,
    success: false,
    data: null,
    message: 'Số điện thoại khôngh hợp lệ. Yêu cầu nhập đúng định dạng bao gồm 10 chữ số (VD: 0912345678)',
    code: 10112,
    messageCode: "INVALID_PHONE",
};
module.exports.INVALID_IMAGE = {
    status: 200,
    success: false,
    data: null,
    message: 'Url ảnh không hợp lệ. Hệ thống chỉ hỗ trợ định dạng JPG, PNG, GIF',
    code: 10012,
    messageCode: "INVALID_IMAGE",
};
module.exports.EMAIL_NOT_EXIST = {
    status: 200,
    success: false,
    data: null,
    message: 'Thông tin email không tồn tại trên hệ thống',
    code: 10013,
    messageCode: "EMAIL_NOT_EXIST",
};
module.exports.ACCOUNT_ACTIVED = {
    status: 200,
    success: false,
    data: null,
    message: 'Tài khoản đã được kích hoạt',
    code: 1014,
    messageCode: "ACCOUNT_ACTIVED ",
};
module.exports.TOKEN_WRONG = {
    status: 200,
    success: false,
    data: null,
    message: 'Mã kích hoạt không hợp lệ',
    code: 1015,
    messageCode: "TOKEN_WRONG ",
};
module.exports.TOKEN_EXPIRED = {
    status: 401,
    success: false,
    data: null,
    message: 'Mã token đã hết hạn',
    code: 1016,
    messageCode: "TOKEN_EXPIRED",
};
module.exports.SEND_MAIL_ERROR = {
    status: 200,
    success: false,
    data: null,
    message: 'Không thể gửi email xác thực',
    code: 1017,
    messageCode: "SEND_MAIL_ERROR",
};
module.exports.PASSWORD_INVALID = {
    status: 200,
    success: false,
    data: null,
    message: 'Độ dài mật khẩu phải từ 6 đến 20 ký tự bao gồm cả chữ và số',
    code: 1018,
    messageCode: "PASSWORD_INVALID",
};
module.exports.PASSWORD_CONFIRM_DOES_NOT_MATCH = {
    status: 200,
    success: false,
    data: null,
    message: 'Mật khẩu xác nhận không khớp',
    code: 1019,
    messageCode: "PASSWORD_CONFIRM_DOES_NOT_MATCH",
};
module.exports.PROJECT_NOT_FOUND = {
    status: 200,
    success: false,
    data: null,
    message: 'Không tìm thấy project trên hệ thống',
    code: 1020,
    messageCode: "PROJECT_NOT_FOUND",
};
module.exports.PROJECT_DUPLICATED = {
    status: 200,
    success: false,
    data: null,
    message: 'Thông tin project đã tồn tại trên hệ thống',
    code: 1021,
    messageCode: "PROJECT_DUPLICATED",
};
module.exports.ADMIN_DOES_NOT_EXIST = {
    status: 200,
    success: false,
    data: null,
    message: 'Project phải tồn tại ít nhất một admin',
    code: 1022,
    messageCode: "ADMIN_DOES_NOT_EXIST",
};
module.exports.USER_INVALID = {
    status: 200,
    success: false,
    data: null,
    message: 'Thông tin tài khoản không hợp lệ',
    code: 1023,
    messageCode: "USER_INVALID",
};
module.exports.USER_DUPLICATED_IN_PROJECT = {
    status: 200,
    success: false,
    data: null,
    message: 'Thông tin tài khoản đã tồn tại trong project',
    code: 1024,
    messageCode: "USER_DUPLICATED_IN_PROJECT",
};
module.exports.CHANNEL_DUPLICATED = {
    status: 200,
    success: false,
    data: null,
    message: 'Thông tin channel đã tồn tại trong project',
    code: 1025,
    messageCode: "CHANNEL_DUPLICATED",
};
module.exports.CONNECT_FACEBOOK_FAIL = {
    status: 200,
    success: false,
    data: null,
    message: 'Thông tin channel đã tồn tại trong project',
    code: 1026,
    messageCode: "CONNECT_FACEBOOK_FAIL",
};
module.exports.MESSAGE_FIELD_CONV_ID_WRONG = {
    status: 500,
    success: false,
    data: null,
    message: 'Sai định dạng conversationId',
    code: 1027,
    messageCode: "CONV_ID_WRONG",
};
module.exports.MESSAGE_FIELD_FROM_WRONG = {
    status: 500,
    success: false,
    data: null,
    message: 'Sai định dạng from',
    code: 1028,
    messageCode: "MSG_FROM_WRONG",
};
module.exports.MESSAGE_FIELD_TO_WRONG = {
    status: 500,
    success: false,
    data: null,
    message: 'Sai định dạng to',
    code: 1029,
    messageCode: "MSG_TO_WRONG",
};
module.exports.MESSAGE_FIELD_MSG_WRONG = {
    status: 500,
    success: false,
    data: null,
    message: 'Sai định dạng msg',
    code: 1030,
    messageCode: "MSG_TO_WRONG",
};
module.exports.MESSAGE_API_BAN_AI = {
    status: 500,
    success: false,
    data: null,
    message: 'Server không được cấu hình cho AI gửi tin nhắn',
    code: 1031,
    messageCode: "MESSAGE_API_BAN_AI",
};
module.exports.MESSAGE_API_KEY_WRONG = {
    status: 500,
    success: false,
    data: null,
    message: 'Server nhận được key sai',
    code: 1032,
    messageCode: "MESSAGE_API_KEY_WRONG",
};
module.exports.MISSING_TYPE_VA_CONF = {
    status: 500,
    success: false,
    data: null,
    message: 'Thiếu type của va',
    code: 1033,
    messageCode: "MISSING_TYPE_VA_CONF",
};
module.exports.MISSING_NAME_VA_CONF = {
    status: 500,
    success: false,
    data: null,
    message: 'Thiếu tên của va',
    code: 1034,
    messageCode: "MISSING_NAME_VA_CONF",
};
module.exports.MISSING_PWD_VA_CONF = {
    status: 500,
    success: false,
    data: null,
    message: 'Thiếu mật khẩu của va',
    code: 1035,
    messageCode: "MISSING_PWD_VA_CONF",
};
module.exports.MISSING_CHANNEL_VA_CONF = {
    status: 500,
    success: false,
    data: null,
    message: 'Thiếu kênh fb,zalo... của va',
    code: 1036,
    messageCode: "MISSING_CHANNEL_VA_CONF",
};
module.exports.INVALID_TYPE_VA_TYPE = {
    status: 500,
    success: false,
    data: null,
    message: 'Sai loại VA',
    code: 1037,
    messageCode: "INVALID_TYPE_VA_TYPE",
};
module.exports.VA_EXIST_FOR_CHANNEL = {
    status: 500,
    success: false,
    data: null,
    message: 'VA đã được gán cho kênh khác',
    code: 1038,
    messageCode: "VA_EXIST_FOR_CHANNEL",
};
module.exports.MISSING_VA_CONFIG_PATH = {
    status: 500,
    success: false,
    data: null,
    message: 'VA thiếu đường dẫn',
    code: 1039,
    messageCode: "MISSING_VA_CONFIG_PATH",
};
module.exports.CHANNEL_NOT_FOUND = {
    status: 200,
    success: false,
    data: null,
    message: 'Không tìm thấy thông tin channel',
    code: 1040,
    messageCode: "CHANNEL_NOT_FOUND",
};
module.exports.CONVERSATION_NOT_FOUND = {
    status: 200,
    success: false,
    data: null,
    message: 'Không tìm thấy cuộc hội thoại trên hệ thống',
    code: 1041,
    messageCode: "CONVERSATION_NOT_FOUND",
};
module.exports.CHANNEL_NOT_FOUND_IN_PROJECT = {
    status: 200,
    success: false,
    data: null,
    message: 'Không tồn tại thông tin channel trong project',
    code: 1042,
    messageCode: "CHANNEL_NOT_FOUND_IN_PROJECT",
};
module.exports.AI_CONNECT_ERROR = {
    status: 200,
    success: false,
    data: null,
    message: 'Lỗi gửi bản tin sang AI',
    code: 1043,
    messageCode: "AI_CONNECT_ERROR",
};
module.exports.VA_EXIST_FOR_2_CHANNELS_OR_NOT_CONFIGURED = {
    status: 500,
    success: false,
    data: null,
    message: 'VA đã được gán 2 kênh hoặc chưa gán cho kênh này',
    code: 1044,
    messageCode: "VA_EXIST_FOR_2_CHANNELS_OR_NOT_CONFIGURED",
};