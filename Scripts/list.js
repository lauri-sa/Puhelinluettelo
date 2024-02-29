"use strict";

const createErrMsg = (tbody, msg) => { // Function that generates a row with an error message
  const row = $("<tr>");
  const errorCell = $('<td colspan="2">').text(msg);
  row.append(errorCell);
  tbody.append(row);
};

$(document).ready(async () => { // Asynchronously fetches data from the server

  const tbody = $("tbody"); // Get the table body element

  try {
    const data = await $.ajax({ // Fetches data from the server
      url: "http://a41d.k.time4vps.cloud:3001/henkilot", // The server's URL
      type: "GET", // The request type
      dataType: "json", // The data type of the response
      timeout: 5000, // The request timeout in milliseconds
    });

    if (data.length === 0) { // If the data array is empty, generate a row that says "No data found" and return
      createErrMsg(tbody, "Tietoja ei löytynyt");
      return;
    }

    // Loops through the data and generates table rows
    $.each(data, (index, person) => {
      if (person.hasOwnProperty("nimi") && person.hasOwnProperty("puhelin")) { // Checks if the person object has a name and phone number properties
        
        // Create a table row
        const row = $("<tr>");

        // Create table cells and fill with person's data
        const nameCell = $("<td>").text(person.nimi);
        const phoneNumberCell = $("<td>").text(person.puhelin);

        // Append cells to the row
        row.append(nameCell, phoneNumberCell);
        // Append row to the table body
        tbody.append(row);
      }
    });
  } catch (error) { // If an error occurs, log it to the console and generate a row that says "Error fetching data"
    console.error("Error fetching data: ", error);
    createErrMsg(tbody, "Virhe haettaessa tietoja");
  }
});