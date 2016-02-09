function Article (opts) {
  this.author = opts.author;
  this.authorUrl = opts.authorUrl;
  this.title = opts.title;
  this.category = opts.category;
  this.body = opts.body;
  this.publishedOn = opts.publishedOn;
}

// DONE: Instead of a global `articles = []` array, let's track this list of all articles directly on the
// constructor function. Note: it is NOT on the prototype. In JavaScript, functions are themselves
// objects, which means we can add properties/values to them at any time. In this case, we have
// a key/value pair to track, that relates to ALL of the Article objects, so it does not belong on
// the prototype, as that would only be relevant to a single instantiated Article.
Article.all = [];

Article.prototype.toHtml = function() {
  var template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
  this.publishStatus = this.publishedOn ? 'published ' + this.daysAgo + ' days ago' : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

// DONE: There are some other functions that also relate to articles across the board, rather than
// just single instances. Object-oriented programming would call these "class-level" functions,
// that are relevant to the entire "class" of objects that are Articles.

// DONE: This function will take the rawData, how ever it is provided,
// and use it to instantiate all the articles. This code is moved from elsewhere, and
// encapsulated in a simply-named function for clarity.
Article.loadAll = function(data) {
  // console.log(data);
  data.sort(function(a,b) {
    return (new Date(b.publishedOn)) - (new Date(a.publishedOn));
  });

  data.forEach(function(ele) {
    Article.all.push(new Article(ele));
  })
}

// This function will retrieve the data from either a local or remote source,
// and process it, then hand off control to the View.
Article.fetchAll = function() {
  if (localStorage.articles) {
    // console.log('we have localStorage.articles');

    $.ajax({
      type: 'HEAD',
      url: 'data/hackerIpsum.json',
      success: function(data, message, xhr){
        // console.log(xhr);
        var eTag = xhr.getResponseHeader('eTag'); //allows us to grab eTag from xhr object
        if (!localStorage.eTag || eTag !== localStorage.eTag){
          localStorage.eTag = eTag;
          $.getJSON('data/hackerIpsum.json', function(data) {
            var stringData = JSON.stringify(data)
            localStorage.setItem('articles', stringData);
            Article.loadAll(JSON.parse(localStorage.articles));
            articleView.initIndexPage();
          });
        } else {
          Article.loadAll(JSON.parse(localStorage.articles));
          articleView.initIndexPage();
          // method that will render our index page components (articleView)
          //run Article.loadAll() in console
        }
      }


    });

    // When rawData is already in localStorage,
    // we can load it with the .loadAll function above,
    // and then render the index page (using the proper method on the articleView object).

    //DONE: What do we pass in here to the .loadAll function?

     //DONE: What method do we call to render the index page?
  } else {

    $.getJSON('data/hackerIpsum.json', function(data) {
      //to do after response
        var stringData = JSON.stringify(data)
        localStorage.setItem('articles', stringData);
        Article.loadAll(JSON.parse(localStorage.articles));
        articleView.initIndexPage();

    });



    // DONE: When we don't already have the rawData,
    // we need to retrieve the JSON file from the server with AJAX (which jQuery method is best for this?),
    // cache it in localStorage so we can skip the server call next time,
    // then load all the data into Article.all with the .loadAll function above,
    // and then render the index page.

    //HINT - getJSON call, UPDATE DOM
  }
}
