$(document).ready(function () {

    const stocks = [];

    const addBttn = function (event) {
        event.preventDefault();
        const stockSymbol = $('#stockInput').val().trim().toUpperCase();
        stocks.push(stockSymbol);
        $('#stockInput').val('');
        console.log(stockSymbol);
        render();

    }

    const render = function () {
        $('#stockButtons').empty();
        for (let i = 0; i < stocks.length; i++) {
            const makeBttn = $('<button class="btn btn-success">');
            makeBttn.addClass('listBttn');
            makeBttn.attr('stockSym', stocks[i]);
            makeBttn.text(stocks[i]);
            $('#stockButtons').append(makeBttn);

        }
    }

    const getStocks = function () {
        const stock = $(this).attr('stockSym');
        const queryURL = `https://api.iextrading.com/1.0/stock/${stock}/batch?types=quote,news&range=1m&last=15`;

        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function (response) {
            const stockDiv = $('<div>').addClass('stock');
            const stockName = response.quote.companyName;
            const compName = $('<p>').text(`Company Name: ${stockName}`);
            const stockSymbol = response.quote.symbol;
            const compSymbol = $('<p>').text(`Stock Symbol: ${stockSymbol}`);
            const stockPrice = response.quote.latestPrice;
            const compPrice = $('<p>').text(`Stock Price: $${stockPrice}`);
            const stockNews = response.news[0].summary;
            stockDiv.append(compName, compSymbol, compPrice);
            $('#stockBody').prepend(stockDiv);

            // const compNews = $('<p>').text(`News Summary: ${stockNews}`);
            for (let i = 0; i < 10; i++) {
                const compNews = response.news[i].summary;
                const newsLink = response.news[i].url;
                console.log(compNews);
                if (compNews === "No summary available.") {
                    stockDiv.append(`<p><a href=${newsLink}>${response.news[i].headline}</a></p>`);
                } else {
                    stockDiv.append(`<p><a href=${newsLink}>${compNews}</a></p>`);
                }
            }

        });
    }
    $('#addStock').on('click', addBttn);
    $('#stockButtons').on('click', '.listBttn', getStocks);



});