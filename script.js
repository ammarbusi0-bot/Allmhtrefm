// Global variable for the spreadsheet ID
// *** تأكد من تحديث هذا المتغير بـ ID الخاص بملف Google Sheet لديك! ***
const SHEET_ID = 'ادخل_هنا_معرف_جوجل_شيت_الخاص_بك'; 

// ==================================================
// دالة POST: استقبال وتسجيل النقاط
// ==================================================
function doPost(request) {
  try {
    const params = request.parameter;
    const action = params.action;

    if (action === 'saveScore') {
      const playerName = params.name;
      const points = parseInt(params.points);

      if (!playerName || isNaN(points)) {
        return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Invalid name or points.' }))
          .setMimeType(ContentService.MimeType.JSON);
      }

      const ss = SpreadsheetApp.openById(SHEET_ID);
      const sheet = ss.getSheets()[0];
      
      // Add a new row: [Timestamp, Player Name, Points]
      sheet.appendRow([new Date(), playerName, points]); 

      return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Score saved.' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Invalid action.' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (e) {
    // Log the error for debugging purposes
    Logger.log('Error in doPost: ' + e.toString()); 
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Server error: ' + e.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ==================================================
// دالة GET: جلب لوحة الصدارة (المعدلة)
// ==================================================
function doGet(request) {
  try {
    const params = request.parameter;
    const action = params.action;

    if (action === 'getLeaderboard') {
      const ss = SpreadsheetApp.openById(SHEET_ID);
      const sheet = ss.getSheets()[0];
      const range = sheet.getDataRange();
      const values = range.getValues();

      if (values.length <= 1) { // Check if there are only headers
        return ContentService.createTextOutput(JSON.stringify({ status: 'success', leaderboard: [] }))
          .setMimeType(ContentService.MimeType.JSON);
      }

      // Skip the header row (index 0)
      const dataRows = values.slice(1); 
      
      // 1. Group points by player and find the highest score (حيث يتم حل مشكلة التكرار)
      const maxScores = {};
      dataRows.forEach(row => {
        // Assuming Name is column 2 (index 1), Points is column 3 (index 2)
        const timestamp = row[0]; // Not used for grouping, but useful for context
        const name = row[1]; // Column B (Name)
        const points = parseInt(row[2]); // Column C (Points)

        if (name && !isNaN(points)) {
          // If player name is new or the current score is higher, update maxScores
          if (!maxScores[name] || points > maxScores[name]) {
            maxScores[name] = points;
          }
        }
      });
      
      // 2. Convert the map into an array of objects
      let leaderboard = Object.keys(maxScores).map(name => ({
        name: name,
        points: maxScores[name]
      }));

      // 3. Sort by points in descending order
      leaderboard.sort((a, b) => b.points - a.points);

      // 4. Limit to top 10 (or whatever limit you want)
      leaderboard = leaderboard.slice(0, 10); 

      return ContentService.createTextOutput(JSON.stringify({ status: 'success', leaderboard: leaderboard }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Invalid action.' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (e) {
    Logger.log('Error in doGet: ' + e.toString());
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Server error: ' + e.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ==================================================
// دالة index: لنشر التطبيق (لا نحتاجها هنا)
// ==================================================
function doGetIndex() {
  // This is a placeholder. Our client (GitHub Page) makes direct API calls.
  return HtmlService.createHtmlOutput('Server is running. Make API calls to /exec?action=...');
}
