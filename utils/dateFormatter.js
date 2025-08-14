/**
 * Smart Date Formatter Utility
 * Handles multiple date formats including DD-MM-YYYY (our standard)
 * Automatically detects format and converts appropriately
 */

/**
 * Formats a date string to Malaysian locale (DD/MM/YYYY)
 * @param {string} dateString - Date string in various formats
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    // Handle DD-MM-YYYY format (our standard)
    if (dateString.includes('-') && dateString.split('-')[0].length === 2) {
      const [day, month, year] = dateString.split('-');
      const date = new Date(`${year}-${month}-${day}`);
      
      // Validate the date
      if (isNaN(date.getTime())) {
        console.warn(`Invalid date format: ${dateString}`);
        return dateString; // Return original if invalid
      }
      
      // Format as DD-MM-YYYY (our standard)
      return `${day}-${month}-${year}`;
    }
    
    // Handle YYYY-MM-DD format (JavaScript standard)
    if (dateString.includes('-') && dateString.split('-')[0].length === 4) {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
    
    // Handle MM/DD/YYYY format (US standard)
    if (dateString.includes('/')) {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
    
    // Handle ISO date strings
    if (dateString.includes('T') || dateString.includes('Z')) {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
    
    // Fallback: try to parse as is
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
    
    // If all else fails, return original
    console.warn(`Could not parse date: ${dateString}`);
    return dateString;
    
  } catch (error) {
    console.error(`Error formatting date ${dateString}:`, error);
    return dateString; // Return original on error
  }
};

/**
 * Formats a date string to Malaysian locale with time (DD/MM/YYYY HH:MM)
 * @param {string} dateTimeString - Date time string in various formats
 * @returns {string} Formatted date time string
 */
export const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '';
  
  try {
    // Handle DD-MM-YYYYTHH:MM format (our standard)
    if (dateTimeString.includes('-') && dateTimeString.split('-')[0].length === 2) {
      const [datePart, timePart] = dateTimeString.split('T');
      const [day, month, year] = datePart.split('-');
      const date = new Date(`${year}-${month}-${day}T${timePart || '00:00'}`);
      
      if (isNaN(date.getTime())) {
        console.warn(`Invalid date time format: ${dateTimeString}`);
        return dateTimeString;
      }
      
      // Format as DD-MM-YYYY HH:MM (our standard)
      const formattedDay = date.getDate().toString().padStart(2, '0');
      const formattedMonth = (date.getMonth() + 1).toString().padStart(2, '0');
      const formattedYear = date.getFullYear();
      const formattedHour = date.getHours().toString().padStart(2, '0');
      const formattedMinute = date.getMinutes().toString().padStart(2, '0');
      
      return `${formattedDay}-${formattedMonth}-${formattedYear} ${formattedHour}:${formattedMinute}`;
    }
    
    // Handle other formats
    const date = new Date(dateTimeString);
    if (!isNaN(date.getTime())) {
      const formattedDay = date.getDate().toString().padStart(2, '0');
      const formattedMonth = (date.getMonth() + 1).toString().padStart(2, '0');
      const formattedYear = date.getFullYear();
      const formattedHour = date.getHours().toString().padStart(2, '0');
      const formattedMinute = date.getMinutes().toString().padStart(2, '0');
      
      return `${formattedDay}-${formattedMonth}-${formattedYear} ${formattedHour}:${formattedMinute}`;
    }
    
    return dateTimeString;
    
  } catch (error) {
    console.error(`Error formatting date time ${dateTimeString}:`, error);
    return dateTimeString;
  }
};

/**
 * Converts DD-MM-YYYY to YYYY-MM-DD for HTML date inputs
 * @param {string} dateString - Date in DD-MM-YYYY format
 * @returns {string} Date in YYYY-MM-DD format
 */
export const convertToHTMLDateInput = (dateString) => {
  if (!dateString) return '';
  
  try {
    if (dateString.includes('-') && dateString.split('-')[0].length === 2) {
      const [day, month, year] = dateString.split('-');
      return `${year}-${month}-${day}`;
    }
    
    return dateString;
  } catch (error) {
    console.error(`Error converting date ${dateString}:`, error);
    return dateString;
  }
}; 