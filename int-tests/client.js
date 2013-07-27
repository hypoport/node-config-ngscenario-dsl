describe('ngscenario nodejs dsl test', function () {

  beforeEach(function () {
    browser().navigateTo('/index.html');
  });

  it('should register a new url, return configured response code and clears the config ', function () {
    input("requestUrl").enter("dummyRequest");

    element("#send-button").click();
    expect(input("responseCode").val()).toEqual("404");

    server().onRequest({method: 'GET', url: "/dummyRequest"}).respondWith(500, {data: "Some error message"});

    element("#send-button").click();
    expect(input("responseCode").val()).toEqual("500");
    expect(input("responseBody").val()).toEqual("Some error message");

    server().clear();

    element("#send-button").click();
    expect(input("responseCode").val()).toEqual("404");

  });

});