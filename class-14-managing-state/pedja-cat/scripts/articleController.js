(function(module) {
  var articlesController = {};

  Article.createTable();  // Ensure the database table is properly initialized

  articlesController.index = function(ctx, next) {
    articleView.index(ctx.articles);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  // loadById is a method attached to the articlesController object.
  // It takes 2 params, context -ctx and next.
  // It contains function articleData with one param "article".
  // Function is assinging a new property to the ctx object and givin it a value of article.
  // Then next() is called, which is articlesController.index()
  // After this is done, findWhere(), which is a method on a Article obj is being called
  // and it takes 3 parameters( field, value, callback). in this instance field is 'id',
  // value is ctx object's params object's value of key id.
  // callback is articleData which is described above.
  articlesController.loadById = function(ctx, next) {
    var articleData = function(article) {
      ctx.articles = article;
      next();
    };

    Article.findWhere('id', ctx.params.id, articleData);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  // loadByAuthor is a method attached to the articlesController object.
  // It takes 2 params, context -ctx and next.
  // It contains function authorData with one param "articlesByAuthor".
  // Function is assinging a new property to the ctx object and givin it a value of articlesByAuthor.
  // Then next() is called, which is articlesController.index()
  // After this is done, findWhere(), which is a method on a Article obj is being called
  // and it takes 3 parameters( field, value, callback). in this instance field is 'author',
  // value is ctx object's params object's value key of authorName and uses .replace with REGEX
  // that replaces '+' between authors first and last name in the URL
  // callback is authorData which is described above.
  articlesController.loadByAuthor = function(ctx, next) {
    var authorData = function(articlesByAuthor) {
      ctx.articles = articlesByAuthor;
      next();
    };

    Article.findWhere('author', ctx.params.authorName.replace('+', ' '), authorData);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  // loadByCategory is a method attached to the articlesController object.
  // It takes 2 params, context -ctx and next.
  // It contains function categoryData with one param "articlesInCategory".
  // Function is assinging a new property to the ctx object and givin it a value of articlesInCategory.
  // Then next() is called, which is articlesController.index()
  // After this is done, findWhere(), which is a method on a Article obj is being called
  // and it takes 3 parameters( field, value, callback). in this instance field is 'category',
  // value is ctx object's params object's value key of categoryName
  // callback is categoryData which is described above.
  articlesController.loadByCategory = function(ctx, next) {
    var categoryData = function(articlesInCategory) {
      ctx.articles = articlesInCategory;
      next();
    };

    Article.findWhere('category', ctx.params.categoryName, categoryData);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  // loadByAll is a method attached to the articlesController object.
  // It takes 2 params, context -ctx and next.
  // It contains function articleData with one param "allArticles".
  // Function is assinging a new property to the ctx object and givin it a value as all array that is attached to the Article obj constructor,
  // but its not being called unless there's NO content in Article.all array.
  // Then next() is called, which is articlesController.index()
  // if there IS any content in Article.all array then identical functionallity as articleData() is run.
  // if there NO content in Article.all array then Article.fetchAll() is being call with articleData callback.
  // fetchAll() selects all the articles order by pubdate and if there are any rows in the table, content is
  // loading(Article.loadAll) into Article.all array and return new Article element.
  // else ajax call is being run to fetch data from the local json file.
  // instantiate an article based on the item from JSON. --> put the article it in the table
  // Article.loadAll() is run as well as callback() = articleData.

  articlesController.loadAll = function(ctx, next) {
    var articleData = function(allArticles) { //NOTE that this parameter is not necesary as it is never used!
      ctx.articles = Article.all;
      next();
    };

    if (Article.all.length) {
      ctx.articles = Article.all;
      next();
    } else {
      Article.fetchAll(articleData);
    }
  };


  module.articlesController = articlesController;
})(window);
