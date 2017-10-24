const mergeRecords = require('./mergeRecords');

describe('Merge Records', () => {

  it('should skip duplicates', () => {
    const existingRecords = [
      { a: 1 }, { a: 2 }
    ];
    const incomingRecords = [
      { a: 2 }, { a: 3 }
    ];
    expect(mergeRecords(existingRecords, incomingRecords)).toEqual([
      { a: 1 }, { a: 2 }, { a: 3 }
    ]);
  });

  it('should append records when the target is empty', () => {
    const existingRecords = [];
    const incomingRecords = [
      { a: 1 }, { a: 2 }
    ];
    expect(mergeRecords(existingRecords, incomingRecords)).toEqual([
      { a: 1 }, { a: 2 }
    ]);
  });

  it('should handle null for existing data safely', () => {
    const existingRecords = null;
    const incomingRecords = [
      { a: 1 }, { a: 2 }
    ];
    expect(mergeRecords(existingRecords, incomingRecords)).toEqual([
      { a: 1 }, { a: 2 }
    ]);
  });

  it('should handle null for incoming data safely', () => {
    const existingRecords = [
      { a: 1 }
    ];
    const incomingRecords = null;
    expect(mergeRecords(existingRecords, incomingRecords)).toEqual([
      { a: 1 }
    ]);
  });

});
