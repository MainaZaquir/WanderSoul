import { supabase } from './supabase';

interface ErrorLogData {
  errorType: string;
  errorMessage: string;
  stackTrace?: string;
  url?: string;
  userAgent?: string;
  userId?: string;
}

export const logError = async (error: Error, context?: Partial<ErrorLogData>) => {
  try {
    const errorData: ErrorLogData = {
      errorType: error.name || 'UnknownError',
      errorMessage: error.message,
      stackTrace: error.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...context,
    };

    // Log to Supabase
    const { error: logError } = await supabase
      .from('error_logs')
      .insert([errorData]);

    if (logError) {
      console.error('Failed to log error to database:', logError);
    }

    // Also log to console in development
    if (import.meta.env.DEV) {
      console.error('Error logged:', errorData);
    }
  } catch (loggingError) {
    console.error('Error in error logging:', loggingError);
  }
};

export const logUserAction = async (action: string, details?: Record<string, any>) => {
  try {
    console.log(`User action: ${action}`, details);
    
    // In production, you might want to log user actions to analytics
    // or a separate logging service
    if (import.meta.env.PROD) {
      // Example: Send to analytics service
      // analytics.track(action, details);
    }
  } catch (error) {
    console.error('Error logging user action:', error);
  }
};

// Global error handler
export const setupGlobalErrorHandling = () => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logError(new Error(event.reason), {
      errorType: 'UnhandledPromiseRejection',
    });
  });

  // Handle JavaScript errors
  window.addEventListener('error', (event) => {
    logError(new Error(event.message), {
      errorType: 'JavaScriptError',
      url: event.filename,
    });
  });
};