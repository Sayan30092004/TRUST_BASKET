import { BusinessDocument } from '@/types';

// Allowed file types for business documents
export const ALLOWED_FILE_TYPES = {
  'application/pdf': '.pdf',
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp'
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const DOCUMENT_TYPES = {
  business_license: 'Business License',
  trade_license: 'Trade License',
  gst_certificate: 'GST Certificate',
  shop_establishment: 'Shop & Establishment License',
  other: 'Other Business Document'
};

export const validateFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file type
  if (!ALLOWED_FILE_TYPES[file.type as keyof typeof ALLOWED_FILE_TYPES]) {
    return {
      isValid: false,
      error: 'Invalid file type. Please upload PDF, JPG, PNG, or WebP files only.'
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: 'File size too large. Please upload files smaller than 5MB.'
    };
  }

  // Check file name
  if (file.name.length > 100) {
    return {
      isValid: false,
      error: 'File name too long. Please rename the file to less than 100 characters.'
    };
  }

  return { isValid: true };
};

export const uploadDocument = async (
  file: File,
  documentType: keyof typeof DOCUMENT_TYPES,
  userPhone: string
): Promise<{ success: boolean; document?: BusinessDocument; error?: string }> => {
  try {
    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    // In a real application, you would upload to a cloud storage service
    // For demo purposes, we'll create a mock URL
    const mockUrl = `https://storage.trustbasket.com/documents/${userPhone}/${Date.now()}_${file.name}`;

    // Create document object
    const document: BusinessDocument = {
      id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      uploadedAt: new Date(),
      url: mockUrl,
      status: 'pending',
      documentType,
      verificationNotes: undefined
    };

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Document uploaded successfully:', document);

    return { success: true, document };
  } catch (error) {
    console.error('Error uploading document:', error);
    return { success: false, error: 'Failed to upload document. Please try again.' };
  }
};

export const getFilePreviewUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getDocumentStatusColor = (status: BusinessDocument['status']): string => {
  switch (status) {
    case 'pending': return 'text-yellow-600';
    case 'approved': return 'text-green-600';
    case 'rejected': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

export const getDocumentStatusIcon = (status: BusinessDocument['status']): string => {
  switch (status) {
    case 'pending': return '⏳';
    case 'approved': return '✅';
    case 'rejected': return '❌';
    default: return '📄';
  }
};

// Mock function to simulate document verification by admin
export const verifyDocument = async (
  documentId: string,
  status: 'approved' | 'rejected',
  notes?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // In a real application, this would update the database
    console.log(`Document ${documentId} ${status}`, notes ? `with notes: ${notes}` : '');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true };
  } catch (error) {
    console.error('Error verifying document:', error);
    return { success: false, error: 'Failed to update document status.' };
  }
};