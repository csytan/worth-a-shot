(function() {

var FUNDS;
var FILTER = '';

$.getJSON('../data/funds_compil.json')
    .done(function(data) {
        FUNDS = data;
        run();
    });


function run() {
    $('.investing_search')
        .on('keyup', function() {
            var query = this.value.toLowerCase();
            render(query, 'vaccine_total_value');
        })
        .trigger('keyup')
        .hide();

    $('.investing_sort')
        .on('click', function() {
            $('.investing_sort')
                .removeClass('investing_sort--active');

            $(this)
                .addClass('investing_sort--active');

            render('', this.dataset.sort);
        });
}


function render(query, sortOrder) {
    var html = '';
    var funds = searchFunds(query);
    var sortedFunds = sortFunds(funds, sortOrder);
    

    // Generate html for funds
    sortedFunds.forEach(function(fund) {
        html += renderFund(fund, sortOrder);
    });
    
    // Update DOM
    $('.investing_funds').html(html);
}


function searchFunds(query) {
    // Filter funds that contain query in ticker or name
    return FUNDS.filter(function(fund) {
        var tickerText = fund.mfund_ticker.toLowerCase();
        var nameText = fund.name.toLowerCase();
        var inTicker = tickerText.indexOf(query) != -1;
        var inName = nameText.indexOf(query) != -1;
        return inTicker || inName;
    });
}

function sortFunds(funds, sortOrder) {
    // Sort funds by most invested
    return funds.slice()
        .sort(function(a, b) {
            return b[sortOrder] - a[sortOrder];
        });
}

function renderFund(fund, sortOrder) {
    var total = fund[sortOrder];
    if (sortOrder == 'vaccine_total_percent') {
        var unit = '%';
    } else if (sortOrder == 'vaccine_total_value') {
        var unit = 'M';
    } else if (sortOrder == 'vaccine_total_exposure') {
        var unit = '%';
    }

    return '<div class="investing_fund">' +
        '<div class="investing_fund_ticker">' + 
            fund.mfund_ticker + 
        '</div>' + 
        '<div class="investing_fund_name">' + 
            fund.name +
        '</div>' +
        '<div class="investing_fund_total">' +
            total + unit + 
        '</div>' +  
    '</div>';
}


})();