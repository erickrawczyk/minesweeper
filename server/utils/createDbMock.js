module.exports = function createDbMock(returnValue) {
  return jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    first: jest.fn().mockReturnThis(),
    then: jest.fn().mockReturnValue(returnValue),
  }));
};
