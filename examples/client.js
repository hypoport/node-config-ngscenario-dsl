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

  it('should register a new timeout url, get a timeout code and clears the config ', function () {
    input("requestUrl").enter("dummyRequestForTimeout");

    element("#send-button").click();
    expect(input("responseCode").val()).toEqual("404");

    server().onRequest({method: 'GET', url: "/dummyRequestForTimeout"}).neverRespond();

    element("#send-button").click();
    expect(input("responseCode").val()).toEqual("0");

    server().clear();

    element("#send-button").click();
    expect(input("responseCode").val()).toEqual("404");
  });

  it('should expect a request and verify request received once', function () {
    input("requestUrl").enter("dummyVerifyRequest");

    server().expectRequest({method: 'GET', url: "/dummyVerifyRequest"});

    element("#send-button").click();
    expect(input("responseCode").val()).toEqual("404");

    server().hasReceived({method: 'GET', url: "/dummyVerifyRequest"}).once();
    server().clear();
  });

  it('should expect a request and verify request never made', function () {

    server().expectRequest({method: 'GET', url: "/dummyVerifyRequest"});

    server().hasReceived({method: 'GET', url: "/dummyVerifyRequest"}).never();
    server().clear();
  });

  it('should expect a request and verify request is made 3 times', function () {
    input("requestUrl").enter("dummyVerifyRequest");

    server().expectRequest({method: 'GET', url: "/dummyVerifyRequest"});

    element("#send-button").click();
    element("#send-button").click();
    element("#send-button").click();

    server().hasReceived({method: 'GET', url: "/dummyVerifyRequest"}).times(3);
    server().clear();
  });

});