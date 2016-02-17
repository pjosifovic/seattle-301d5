(function(module) {
  var repos = {};

  repos.all = [];

  // DONE: Refactor this ajax call into a get request to the proxy end point provided by server.js.
  repos.requestRepos = function(callback) {
    $.get('/github/users/pjosifovic/repos' +
            '?per_page=5' +
            '&sort=updated', function(data, message, xhr) {
        repos.all = data;
      }).done(callback);
  };

  repos.with = function(attr) {
    return repos.all.filter(function(repo) {
      return repo[attr];
    });
  };

  module.repos = repos;
})(window);
