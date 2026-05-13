import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error, defaultMessage = 'Something went wrong') {
  if (error.message === 'Network Error') {
    return 'Connection failed. This may be due to a server issue or the file size exceeding the allowed limit (e.g. PDF too large).';
  }
  
  if (error.response?.status === 413) {
    return 'The file is too large. Please upload a smaller file.';
  }

  if (error.response?.data?.errors) {
    const errorMessages = Object.values(error.response.data.errors);
    if (errorMessages.length > 0) return errorMessages[0];
  }
  
  return error.response?.data?.message || error.response?.data?.error || error.message || defaultMessage;
}

export function formatPublisher(publisher) {
  if (!publisher) return 'N/A';
  if (typeof publisher === 'string') return publisher;
  if (typeof publisher === 'object') {
    const name = `${publisher.firstname || publisher.firstName || ''} ${publisher.lastname || publisher.lastName || ''}`.trim();
    return name || publisher.username || publisher.email || 'N/A';
  }
  return String(publisher);
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}
