// Function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Helper function to format time from date string
export const formatTime = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  } catch {
    return '';
  }
};

export const API_URL = '/api/calories';

