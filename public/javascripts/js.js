//for the requests

window.addEventListener('load', (event) => {

    //check the input from the user before request leave from me
    function validateForm() {

        //delete orange red border color if exists
        document.getElementById('author').style.borderColor = '';
        document.getElementById('title').style.borderColor = '';
        document.getElementById('price').style.borderColor = '';
        document.getElementById('genre').style.borderColor = '';

        //get the values of the elements to use them below
        const author = document.getElementById('author').value;
        const title = document.getElementById('title').value;
        const price = document.getElementById('price').value;
        const genre = document.getElementById('genre').value;

        if (author == '') {

            document.getElementById('author').style.borderColor = 'OrangeRed';
            alert("All the fields must be filled out.Please fill out the field 'Author'");
            return false;

        }

        if (title == '') {

            document.getElementById('title').style.borderColor = 'OrangeRed';
            alert("All the fields must be filled out.Please fill out the field 'Title Of The Book'");
            return false;

        }

        if (genre == 'select') {

            document.getElementById('genre').style.borderColor = 'OrangeRed';
            alert("All the fields must be filled out. Fill out the genre please");
            return false;

        }

        if (price == '' || price < 0 || Number.isInteger(price)) {

            document.getElementById('price').style.borderColor = 'OrangeRed';
            alert("Please give a valid price like 8.5 or 8.0 . Not -8.5 or 8 or nothing");
            return false;

        }
        return true;
    }

    const request = new XMLHttpRequest();

    //for asynchronised
    request.open('GET', 'http://20.101.91.72:3000/searchBooks/', true);
    //request.open('GET', 'http://localhost:8080/searchBooks/', true);
    request.send();
    //to check when the request is okay to leave
    request.onreadystatechange = function () {

        if (request.readyState == 4) {
            if (request.status == 200) {

                let divElem = document.getElementById('printBooks');
                let headersValues = ['Id','Author', 'Title', 'Genre', 'Price in $'];

                let table = document.createElement('table');
                let headersRows = document.createElement('tr');

                //delete all the childrens besause maybe already exists a table with not updated info
                while (divElem.firstChild) {
                    divElem.removeChild(divElem.firstChild);
                }

                const results = JSON.parse(request.responseText);

                //if results is 0 means that the select returns 0 rows because it doesn't find books to database
                if (results.length == 0) {

                    let errorTextNode = document.createTextNode("We don't have books in our database");
                    //add this child to divElem to print the message to user
                    divElem.appendChild(errorTextNode);
                    return false;
                }

                //do the row and the cells for the headers of the table
                headersValues.forEach(headerText => {
                    let header = document.createElement('th');
                    let textNode = document.createTextNode(headerText);
                    header.appendChild(textNode);
                    headersRows.appendChild(header);
                });

                table.appendChild(headersRows);

                /*for each row that exists in the results (the rows that given by select)
                   i do a foreach for each value that object book has to create the table to
                   put all the values for each book that i have*/

                /*if something went wrong with the database in the table appeared the wrong
                    message to inform the user*/
                results.forEach(book => {
                    let row = document.createElement('tr');

                    Object.values(book).forEach(text => {
                        let cell = document.createElement('td');
                        let textNode = document.createTextNode(text);
                        cell.appendChild(textNode);
                        //add cell by cell into the row to complite the info of one book that i have in the database
                        row.appendChild(cell);
                    })

                    //add row by row into the table
                    table.appendChild(row);

                });

                //add the completed table
                divElem.appendChild(table);
            }
        }
    };

    document.getElementById('sendRequestAdd').addEventListener('click', (event) => {

        //check the user input
        if(!validateForm()){
            return false;
        }else{
            //create an object
            const book = {
                'author': document.getElementById('author').value,
                'title': document.getElementById('title').value,
                'price': document.getElementById('price').value,
                'genre': document.getElementById('genre').value
            };

            const request = new XMLHttpRequest();

            //for unsynchronised
            request.open('POST', 'http://20.101.91.72:3000/addBook', true);
            //request.open('POST', 'http://localhost:8080/addBook', true);

            //to save as JSON type
            request.setRequestHeader('Content-Type', 'application/json');
            request.send(JSON.stringify(book));

            //to check when the request is okay to leave
            request.onreadystatechange = function () {

                if (request.readyState == 4) {

                    //print to the user the correct message if the addition of a new book succeed or not
                    if (request.status == 200) {

                        alert(request.responseText);
                    } else {
                        alert("Something went wrong");
                    }
                }

            };
        }
    });



    document.getElementById('searchByKeyword').addEventListener('click', (event) => {


        const request = new XMLHttpRequest();

        //for asynchronised
        request.open('GET', 'http://20.101.91.72:3000/searchBooks/' + document.getElementById('keyword').value, true);
        //request.open('GET', 'http://localhost:8080/searchBooks/' + document.getElementById('keyword').value, true);
        request.send();
        //to check when the request is okay to leave
        request.onreadystatechange = function () {

            if (request.readyState == 4) {
                if (request.status == 200) {

                    let divElem = document.getElementById('listBook');
                    let headersValues = ['Id','Author', 'Title', 'Genre', 'Price in $'];

                    let table = document.createElement('table');
                    let headersRows = document.createElement('tr');

                    //delete all the children because maybe already exists a table with not updated info
                    while (divElem.firstChild) {
                        divElem.removeChild(divElem.firstChild);
                    }

                    const results = JSON.parse(request.responseText);

                    //if results is 0 means that the select returns 0 rows because it doesn't find books to database
                    if (results.length == 0) {

                        let errorTextNode = document.createTextNode("We don't have a book with that title");
                        //add this child to divElem to print the message to user
                        divElem.appendChild(errorTextNode);
                        return false;
                    }

                    //add a caption to understand the user what he sees
                    let caption = document.createElement('h3');
                    let captionText = document.createTextNode('The Results of the Search');
                    divElem.appendChild(captionText);

                    //do the row and the cells for the headers of the table
                    headersValues.forEach(headerText => {
                        let header = document.createElement('th');
                        let textNode = document.createTextNode(headerText);
                        header.appendChild(textNode);
                        headersRows.appendChild(header);
                    });

                    table.appendChild(headersRows);

                    /*for each row that exists in the results (the rows that given by select)
                    i do a foreach for each value that object book has to create the table to
                    put all the values for each book that i have*/

                    /*if something went wrong with the database in the table appeared the wrong
                    message to inform the user*/
                    results.forEach(book => {
                        let row = document.createElement('tr');

                        Object.values(book).forEach(value => {
                            let cell = document.createElement('td');
                            let textNode = document.createTextNode(value);
                            cell.appendChild(textNode);
                            //add cell by cell into the row to complete the info of one book that i have in the database
                            row.appendChild(cell);
                        })

                        //add row by row into the table
                        table.appendChild(row);

                    });

                    //add the completed table
                    divElem.appendChild(table);

                }

            }


        };
    });
});