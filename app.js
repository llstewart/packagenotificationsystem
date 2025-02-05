const sheet = SpreadsheetApp.openById('YOUR_SHEET_ID');
const residentsSheet = sheet.getSheetByName('Residents');
const packagesSheet = sheet.getSheetByName('Packages');

// Handle Resident Registration
function doPost(e) {
    const data = JSON.parse(e.postData.contents);
    const endpoint = e.parameter.endpoint;
  
    if (endpoint === 'register') {
      residentsSheet.appendRow([
        new Date(),
        data.name || '',
        data.email,
        data.aptNumber
      ]);
      return ContentService.createTextOutput('Registration successful');
    }
  
    if (endpoint === 'logPackage') {
      packagesSheet.appendRow([
        data.date,
        data.time,
        data.courier,
        data.aptNumber,
        data.description,
        'Pending Pickup', // Default status
        '', // Pickup Date
        '' // Signature/Notes
      ]);
      return ContentService.createTextOutput('Package logged successfully');
    }
  
    if (endpoint === 'sendEmails') {
      const residents = residentsSheet.getDataRange().getValues();
      const packages = packagesSheet.getDataRange().getValues();
      let count = 0;
  
      packages.forEach((pkg, index) => {
        if (pkg[5] === 'Pending Pickup') {  // Check status in column 5
          const resident = residents.find(r => r[3] === pkg[3]); // Match apartment number
          if (resident) {
            GmailApp.sendEmail(
              resident[2],
              'Package Notification',
              `Hello ${resident[1] || 'Resident'},\nYou have a new package:\n\n` +
              `Date: ${pkg[0]}\nTime: ${pkg[1]}\nCourier: ${pkg[2]}\nDescription: ${pkg[4]}\n\n` +
              `Please pick it up at your earliest convenience.`
            );
            packagesSheet.getRange(index + 1, 6).setValue('Picked Up'); // Update Status (column 6)
            packagesSheet.getRange(index + 1, 7).setValue(new Date().toLocaleDateString()); // Update Pickup Date (column 7)
            count++;
          }
        }
      });
      return ContentService.createTextOutput(count.toString());
    }

  if (endpoint === 'getPendingCount') {
    const packages = packagesSheet.getDataRange().getValues();
    const pendingCount = packages.filter(pkg => pkg[5] === 'Pending Pickup').length; // Check status in column 5
    return ContentService.createTextOutput(pendingCount.toString());
  }

  return ContentService.createTextOutput('Invalid endpoint');
}

// Deploy as Web App
function doGet() {
  return HtmlService.createHtmlOutput('This is a POST-only API.');
}