let expect  = require('chai').expect;

function addTwoNumbers(x, y) {
    return x + x; // deliberate bug!
}

it('Main page content', function(done) {
    let expectedResult = 4;
    let result = addTwoNumbers(2, 2);
    expect(expectedResult).to.equal(result);
    done();
});
