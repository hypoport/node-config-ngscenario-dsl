describe('ngscenario nodejs dsl test', function () {

  beforeEach(function () {
    browser().navigateTo('/index.html');
  });

  it('should register a new url', function () {
    server().onRequest({method: 'GET', url: "/dummyRequest"}).respondWith(500);
  });

});