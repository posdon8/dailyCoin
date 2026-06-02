import nodemailer from 'nodemailer';

/**
 * Email Service - Gửi email thông báo
 */

// Cấu hình transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true' || false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Gửi email thông báo nợ mới
 */
export const sendDebtNotificationEmail = async (debtor) => {
  if (!debtor.debtorEmail) {
    console.warn(`Người nợ ${debtor.debtorName} không có email`);
    return false;
  }

  if (!process.env.EMAIL_USER) {
    console.warn('Email service chưa được cấu hình');
    return false;
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: debtor.debtorEmail,
      subject: `Thông báo: Bạn có khoản nợ - ${debtor.amount.toLocaleString('vi-VN')} VND`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Thông báo Khoản Nợ</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>Xin chào <strong>${debtor.debtorName}</strong>,</p>
            
            <p>Bạn có một khoản nợ cần thanh toán:</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
              <table style="width: 100%; font-size: 14px;">
                <tr>
                  <td style="color: #666; padding: 8px 0;"><strong>Số tiền nợ:</strong></td>
                  <td style="text-align: right; color: #e74c3c; font-size: 18px; font-weight: bold;">
                    ${debtor.amount.toLocaleString('vi-VN')} VND
                  </td>
                </tr>
                <tr>
                  <td style="color: #666; padding: 8px 0;"><strong>Mô tả:</strong></td>
                  <td style="text-align: right; color: #333;">${debtor.description}</td>
                </tr>
                <tr>
                  <td style="color: #666; padding: 8px 0;"><strong>Ngày đến hạn:</strong></td>
                  <td style="text-align: right; color: #333;">
                    ${new Date(debtor.dueDate).toLocaleDateString('vi-VN')}
                  </td>
                </tr>
                ${debtor.priority === 'high' ? `
                <tr>
                  <td style="color: #e74c3c; padding: 8px 0;"><strong>⚠️ Mức độ ưu tiên:</strong></td>
                  <td style="text-align: right; color: #e74c3c; font-weight: bold;">CAO</td>
                </tr>
                ` : ''}
              </table>
              
              ${(debtor.bankName || debtor.bankAccount) ? `
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="margin: 0 0 10px 0; color: #666;"><strong>💳 Thông tin thanh toán:</strong></p>
                ${debtor.bankName ? `<p style="margin: 5px 0; color: #333;">🏦 Ngân hàng: <strong>${debtor.bankName}</strong></p>` : ''}
                ${debtor.bankAccount ? `<p style="margin: 5px 0; color: #333;">🔢 Số tài khoản: <strong>${debtor.bankAccount}</strong></p>` : ''}
              </div>
              ` : ''}
            </div>

            ${debtor.notes ? `
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
              <p style="margin: 0; color: #856404;"><strong>Ghi chú thêm:</strong> ${debtor.notes}</p>
            </div>
            ` : ''}

            <p style="color: #666; margin-top: 25px;">
              Vui lòng thanh toán trong thời hạn quy định. 
              Nếu bạn có câu hỏi, vui lòng liên hệ với người cho vay.
            </p>

            <p style="text-align: center; color: #999; font-size: 12px; margin-top: 30px;">
              Email này được gửi từ Daily Expenses App. Vui lòng không trả lời email này.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email thông báo nợ gửi thành công tới ${debtor.debtorEmail}`);
    return true;
  } catch (error) {
    console.error('Lỗi khi gửi email:', error);
    return false;
  }
};

/**
 * Gửi email nhắc nhở thanh toán
 */
export const sendPaymentReminderEmail = async (debtor, remainingAmount) => {
  if (!debtor.debtorEmail || !process.env.EMAIL_USER) {
    return false;
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: debtor.debtorEmail,
      subject: `Nhắc nhở: Thanh toán khoản nợ - ${remainingAmount.toLocaleString('vi-VN')} VND`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">⏰ Nhắc nhở Thanh toán</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>Xin chào <strong>${debtor.debtorName}</strong>,</p>
            
            <p>Đây là lời nhắc nhở về khoản nợ của bạn:</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #f5576c; margin: 20px 0;">
              <p style="margin: 0; color: #666;">Số tiền còn phải thanh toán:</p>
              <p style="margin: 10px 0 0 0; font-size: 24px; color: #f5576c; font-weight: bold;">
                ${remainingAmount.toLocaleString('vi-VN')} VND
              </p>
            </div>

            <p style="color: #666; margin-top: 25px;">
              Vui lòng thanh toán sớm nhất có thể để tránh các vấn đề liên quan.
            </p>

            <p style="text-align: center; color: #999; font-size: 12px; margin-top: 30px;">
              Email này được gửi từ Daily Expenses App.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email nhắc nhở gửi thành công tới ${debtor.debtorEmail}`);
    return true;
  } catch (error) {
    console.error('Lỗi khi gửi email nhắc nhở:', error);
    return false;
  }
};

/**
 * Gửi email xác nhận thanh toán
 */
export const sendPaymentConfirmationEmail = async (debtor, paymentAmount, remainingAmount, status) => {
  if (!debtor.debtorEmail || !process.env.EMAIL_USER) {
    return false;
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: debtor.debtorEmail,
      subject: status === 'settled' 
        ? 'Xác nhận: Khoản nợ đã được thanh toán xong!' 
        : `Xác nhận: Thanh toán ${paymentAmount.toLocaleString('vi-VN')} VND`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">✅ Xác nhận Thanh toán</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>Xin chào <strong>${debtor.debtorName}</strong>,</p>
            
            <p>Cảm ơn bạn đã thanh toán!</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin: 20px 0;">
              <table style="width: 100%; font-size: 14px;">
                <tr>
                  <td style="color: #666; padding: 8px 0;"><strong>Số tiền thanh toán:</strong></td>
                  <td style="text-align: right; color: #28a745; font-size: 16px; font-weight: bold;">
                    ${paymentAmount.toLocaleString('vi-VN')} VND
                  </td>
                </tr>
                ${remainingAmount > 0 ? `
                <tr>
                  <td style="color: #666; padding: 8px 0;"><strong>Còn lại:</strong></td>
                  <td style="text-align: right; color: #f5576c; font-weight: bold;">
                    ${remainingAmount.toLocaleString('vi-VN')} VND
                  </td>
                </tr>
                ` : `
                <tr>
                  <td style="color: #28a745; padding: 8px 0;"><strong>Trạng thái:</strong></td>
                  <td style="text-align: right; color: #28a745; font-weight: bold;">✓ Đã thanh toán xong</td>
                </tr>
                `}
              </table>
              
              ${(debtor.bankName || debtor.bankAccount) ? `
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="margin: 0 0 10px 0; color: #666;"><strong>💳 Thông tin tài khoản:</strong></p>
                ${debtor.bankName ? `<p style="margin: 5px 0; color: #333;">🏦 Ngân hàng: <strong>${debtor.bankName}</strong></p>` : ''}
                ${debtor.bankAccount ? `<p style="margin: 5px 0; color: #333;">🔢 Số tài khoản: <strong>${debtor.bankAccount}</strong></p>` : ''}
              </div>
              ` : ''}
            </div>

            <p style="text-align: center; color: #666; margin-top: 25px; padding: 15px; background: #e8f5e9; border-radius: 8px;">
              ${status === 'settled' 
                ? '🎉 Cảm ơn bạn! Khoản nợ đã được thanh toán hoàn toàn.' 
                : 'Vui lòng tiếp tục thanh toán phần còn lại trong thời gian quy định.'}
            </p>

            <p style="text-align: center; color: #999; font-size: 12px; margin-top: 30px;">
              Email này được gửi từ Daily Expenses App.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email xác nhận thanh toán gửi thành công tới ${debtor.debtorEmail}`);
    return true;
  } catch (error) {
    console.error('Lỗi khi gửi email xác nhận:', error);
    return false;
  }
};

/**
 * Kiểm tra cấu hình email
 */
export const isEmailConfigured = () => {
  return !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD);
};

export default {
  sendDebtNotificationEmail,
  sendPaymentReminderEmail,
  sendPaymentConfirmationEmail,
  isEmailConfigured,
};
