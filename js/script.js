
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    var street = $('#street').val();
    var city = $('#city').val();

    var address = street + ',' + city;

    $greeting.text('Updated by Venkat - ' + address);

    var streetviewURL = 'http://maps.googleapis.com/maps/api/streetview?size=1200x1000&location=' + address + '';
    $body.append('<img class="bgimg" src="'+streetviewURL +'"/>');


    var nyTimesURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + address + '&sort=newest&api-key=0e4f786a36704b76af0c9b71b347cb19'

    $.getJSON(nyTimesURL, function(data){
        $nytHeaderElem.text('NewYork Times Articles about ' + address);

        articles = data.response.docs;
        for(var i =0; i < articles.length; i++){
            var article = articles[i];

            $nytElem.append('<li class="article">' +
                '<a href="'+article.web_url+'">' + article.headline.main+'</a>'+
                '<p>' + article.snippet + '</p>' +
                '</li>');
        };
    }).error(function(e){
        $nytHeaderElem.text('NewYork Times Articles Could not be')
    });


    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + address + '&format=json&callback=wikiCallback';

     var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000);;

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",

        success: function( response) {
            var articlelist = response[1];

            for(var i = 0; i < articlelist.length; i++){
                articlestr = articlelist[i];
                var url = 'http://en.wikipedia.org/wiki/' + articlestr;
                $wikiElem.append('<li><a href="' + url + '">' + articlestr1 + '</a></li>');
            };

            clearTimeout(wikiRequestTimeout);
        }

    });

    return false;
};

$('#form-container').submit(loadData);
