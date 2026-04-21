import Papa from "papaparse";

export function parseCSV(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length) {
          console.error("Errors while parsing:", results.errors);
        }
        
        const data = results.data;
        if (!data || data.length === 0) {
          reject(new Error("File is empty or invalid"));
          return;
        }

        // Analyze columns
        const keys = Object.keys(data[0]);
        const numericKeys = [];
        const categoricalKeys = [];

        keys.forEach(key => {
          // Check type of first few rows for this key to determine column type
          let isNumeric = true;
          for (let i = 0; i < Math.min(10, data.length); i++) {
            if (typeof data[i][key] !== 'number' && data[i][key] !== null) {
              isNumeric = false;
              break;
            }
          }
          if (isNumeric) {
            numericKeys.push(key);
          } else {
            categoricalKeys.push(key);
          }
        });

        resolve({
          data,
          columns: keys,
          numericKeys,
          categoricalKeys,
          summary: {
            totalRows: data.length,
            totalColumns: keys.length,
          }
        });
      },
      error: (error) => reject(error),
    });
  });
}

export function parseJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        const data = Array.isArray(json) ? json : [json];
        
        if (data.length === 0) {
          reject(new Error("JSON is empty"));
          return;
        }
        
        const keys = Object.keys(data[0]);
        const numericKeys = keys.filter(k => typeof data[0][k] === 'number');
        const categoricalKeys = keys.filter(k => typeof data[0][k] !== 'number');

        resolve({
          data,
          columns: keys,
          numericKeys,
          categoricalKeys,
          summary: {
            totalRows: data.length,
            totalColumns: keys.length,
          }
        });
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsText(file);
  });
}
