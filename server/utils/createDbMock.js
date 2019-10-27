module.exports = function createDbMock(returnValue) {
  return jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    first: jest.fn().mockReturnValue(returnValue),
    returning: jest.fn().mockReturnValue(returnValue),
    then: jest.fn().mockReturnValue(returnValue),
  }));
};
