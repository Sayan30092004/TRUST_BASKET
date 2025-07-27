import { OTPVerification } from '@/types';

// In a real application, these would be environment variables
const TWILIO_CONFIG = {
  accountSid: process.env.VITE_TWILIO_ACCOUNT_SID || 'your_twilio_account_sid',
  authToken: process.env.VITE_TWILIO_AUTH_TOKEN || 'your_twilio_auth_token',
  phoneNumber: process.env.VITE_TWILIO_PHONE_NUMBER || '+1234567890'
};

// Alternative SMS providers configuration
const SMS_PROVIDERS = {
  textlocal: {
    apiKey: process.env.VITE_TEXTLOCAL_API_KEY || 'your_textlocal_api_key',
    username: process.env.VITE_TEXTLOCAL_USERNAME || 'your_username'
  },
  msg91: {
    authKey: process.env.VITE_MSG91_AUTH_KEY || 'your_msg91_auth_key',
    templateId: process.env.VITE_MSG91_TEMPLATE_ID || 'your_template_id'
  }
};

// In-memory storage for OTP (in production, use Redis or database)
const otpStorage = new Map<string, OTPVerification>();

export const generateOTP = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const sendOTPViaTwilio = async (phone: string, otp: string): Promise<boolean> => {
  try {
    // For demo purposes, we'll simulate API call
    // In production, uncomment and use real Twilio API
    
    /*
    const twilio = require('twilio');
    const client = twilio(TWILIO_CONFIG.accountSid, TWILIO_CONFIG.authToken);
    
    await client.messages.create({
      body: `Your TRUST_BASKET verification code is: ${otp}. Valid for 5 minutes.`,
      from: TWILIO_CONFIG.phoneNumber,
      to: `+91${phone}`
    });
    */
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`SMS sent to +91${phone}: Your TRUST_BASKET verification code is: ${otp}`);
    return true;
  } catch (error) {
    console.error('Error sending SMS via Twilio:', error);
    return false;
  }
};

export const sendOTPViaTextLocal = async (phone: string, otp: string): Promise<boolean> => {
  try {
    const message = `Your TRUST_BASKET verification code is: ${otp}. Valid for 5 minutes.`;
    
    // For demo purposes, simulate API call
    /*
    const response = await fetch('https://api.textlocal.in/send/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        apikey: SMS_PROVIDERS.textlocal.apiKey,
        numbers: `91${phone}`,
        message: message,
        sender: 'TRUSTBSKT'
      })
    });
    
    const result = await response.json();
    return result.status === 'success';
    */
    
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log(`SMS sent via TextLocal to +91${phone}: ${message}`);
    return true;
  } catch (error) {
    console.error('Error sending SMS via TextLocal:', error);
    return false;
  }
};

export const sendOTPViaMsg91 = async (phone: string, otp: string): Promise<boolean> => {
  try {
    // For demo purposes, simulate API call
    /*
    const response = await fetch(`https://api.msg91.com/api/v5/otp?otp=${otp}&mobile=91${phone}`, {
      method: 'POST',
      headers: {
        'authkey': SMS_PROVIDERS.msg91.authKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        template_id: SMS_PROVIDERS.msg91.templateId,
        mobile: `91${phone}`,
        otp: otp
      })
    });
    
    const result = await response.json();
    return result.type === 'success';
    */
    
    await new Promise(resolve => setTimeout(resolve, 900));
    console.log(`SMS sent via MSG91 to +91${phone}: Your TRUST_BASKET OTP is: ${otp}`);
    return true;
  } catch (error) {
    console.error('Error sending SMS via MSG91:', error);
    return false;
  }
};

export const sendOTP = async (phone: string): Promise<{ success: boolean; otp?: string; error?: string }> => {
  try {
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    
    // Store OTP in memory (use database in production)
    const otpData: OTPVerification = {
      phone,
      otp,
      expiresAt,
      attempts: 0,
      isVerified: false
    };
    
    otpStorage.set(phone, otpData);
    
    // Try multiple SMS providers as fallback
    let smsSuccess = false;
    
    // Try Twilio first
    smsSuccess = await sendOTPViaTwilio(phone, otp);
    
    // If Twilio fails, try TextLocal
    if (!smsSuccess) {
      smsSuccess = await sendOTPViaTextLocal(phone, otp);
    }
    
    // If both fail, try MSG91
    if (!smsSuccess) {
      smsSuccess = await sendOTPViaMsg91(phone, otp);
    }
    
    if (smsSuccess) {
      return { success: true, otp }; // Remove OTP from response in production
    } else {
      return { success: false, error: 'Failed to send SMS. Please try again.' };
    }
  } catch (error) {
    console.error('Error in sendOTP:', error);
    return { success: false, error: 'Failed to send OTP. Please try again.' };
  }
};

export const verifyOTP = (phone: string, inputOtp: string): { success: boolean; error?: string } => {
  const otpData = otpStorage.get(phone);
  
  if (!otpData) {
    return { success: false, error: 'OTP not found. Please request a new OTP.' };
  }
  
  if (otpData.isVerified) {
    return { success: false, error: 'OTP already used. Please request a new OTP.' };
  }
  
  if (new Date() > otpData.expiresAt) {
    otpStorage.delete(phone);
    return { success: false, error: 'OTP expired. Please request a new OTP.' };
  }
  
  if (otpData.attempts >= 3) {
    otpStorage.delete(phone);
    return { success: false, error: 'Too many attempts. Please request a new OTP.' };
  }
  
  if (otpData.otp !== inputOtp) {
    otpData.attempts++;
    otpStorage.set(phone, otpData);
    return { success: false, error: `Invalid OTP. ${3 - otpData.attempts} attempts remaining.` };
  }
  
  // OTP is valid
  otpData.isVerified = true;
  otpStorage.set(phone, otpData);
  
  // Clean up after 1 minute
  setTimeout(() => {
    otpStorage.delete(phone);
  }, 60000);
  
  return { success: true };
};

export const resendOTP = async (phone: string): Promise<{ success: boolean; error?: string }> => {
  // Remove existing OTP
  otpStorage.delete(phone);
  
  // Send new OTP
  const result = await sendOTP(phone);
  return { success: result.success, error: result.error };
};