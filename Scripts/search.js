"use strict";

const createErrMsg = (tbody, msg) => { // Function that generates a row with an error message
  const row = $('<tr class="generatedRow">');
  const errorCell = $('<td colspan="2">').text(msg);
  row.append(errorCell);
  tbody.append(row);
};

$(document).ready(() => {
  $('[name="submit"]').click(async (event) => { // When the search button is clicked

    event.preventDefault(); // Prevents the default form submission

    $('[name="submit"]').blur(); // Removes focus from the button, done to prevent the button from being stuck in the focused state

    const search = $('[name="name"]').val(); // Get the value of the search field

    if (search === "") {
      return; // If the search field is empty, return and do nothing
    }

    const tbody = $("tbody"); // Get the table body element

    tbody.find(".generatedRow").remove(); // Removes all rows that were generated from the previous search

    $('[name="submit"]').prop('disabled', true); // Disables the search button, done to prevent multiple requests from being sent

    try {
      const data = await $.ajax({ // Fetches data from the server
        url: "http://a41d.k.time4vps.cloud:3001/henkilot", // The server's URL
        type: "GET", // The request type
        dataType: "json", // The data type of the response
        timeout: 5000, // The request timeout in milliseconds
      });

      // Loops through the data and generates table rows
      $.each(data, (index, person) => {
        if (person.hasOwnProperty("nimi") && person.hasOwnProperty("puhelin")) { // Checks if the person object has a name and phone number properties
          if (person.nimi.toLowerCase().includes(search.toLowerCase())) { // Checks if the person's name includes the search string
            
            // Create a table row with the class "generatedRow"
            const row = $('<tr class="generatedRow">');

            // Create table cells and fill with person's data
            const nameCell = $("<td>").text(person.nimi);
            const phoneNumberCell = $("<td>").text(person.puhelin);

            // Append cells to the row
            row.append(nameCell, phoneNumberCell);

            // Append row to the table body
            tbody.append(row);
          }
        }
      });

      // If no rows were generated, generate and append a row that says "No results found"
      if (tbody.find(".generatedRow").length === 0) {
        createErrMsg(tbody, "Hakusanalla ei löydy tuloksia");
      }

    } catch (error) {
      // If an error occurs, log it to the console and generate a row that says "Error fetching data"
      console.error("Error fetching data: ", error);
      createErrMsg(tbody, "Virhe haettaessa tietoja");

    } finally { 
      $('[name="submit"]').prop('disabled', false); // Enables the search button
    }
  });
});