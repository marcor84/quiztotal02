const assert = require('assert');
core = require("../js/core.js")

describe('Models default values', function() {
  describe('Answer model', function() {
    var answer = new core.Answer(2, 'car');

    it('ID should be the same with the parameter', function() {
      assert.equal(2, answer.ID);
    });
    
    it('Answer should be the same with the parameter', function() {
      assert.equal('car', answer.Answer);
    });
    
    it('IsChecked should be FALSE', function() {
      assert.equal(false,  answer.IsChecked);
    });
    
    it('IsGood should be FALSE', function() {
      assert.equal(false,  answer.IsGood);
    });
    
    it('IsWrong should be FALSE', function() {
      assert.equal(false,  answer.IsWrong);
    });
  });
  
  describe('Question model', function() {
    var question = new core.Question('How are You today?', [ 'bad', 'fine', 'good', ], [ 2 ]);

    it('Question should be the same with the parameter', function() {
      assert.equal('How are You today?', question.Question);
    });

    it('AllAnswers should be an array', function() {
      assert.equal(true, Array.isArray(question.AllAnswers));
    });

    it('AllAnswers should be an Answer type array', function() {
      assert.equal(true, question.AllAnswers[0] instanceof core.Answer, 'The first item is not!');
      assert.equal(true, question.AllAnswers[1] instanceof core.Answer, 'The second item is not!');
      assert.equal(true, question.AllAnswers[2] instanceof core.Answer, 'The third item is not!');
    });

    it('AllAnswers should contains 3 item like in the parameter', function() {
      assert.equal(3, question.AllAnswers.length);
    });

    it('StayedAnswers should be an array', function() {
      assert.equal(true, Array.isArray(question.StayedAnswers));
    });

    it('StayedAnswers should be an Answer type array', function() {
      assert.equal(true, question.StayedAnswers[0] instanceof core.Answer, 'The first item is not!');
      assert.equal(true, question.StayedAnswers[1] instanceof core.Answer, 'The second item is not!');
      assert.equal(true, question.StayedAnswers[2] instanceof core.Answer, 'The third item is not!');
    });

    it('StayedAnswers should contains 3 item like in the parameter', function() {
      assert.equal(3, question.StayedAnswers.length);
    });

    it('Correct should be an array', function() {
      assert.equal(true, Array.isArray(question.Correct));
    });

    it('Correct should be an Int type array', function() {
      assert.equal(true,  Number.isInteger(question.Correct[0]));
    });

    it('Correct should contains 1 item like in the parameter', function() {
      assert.equal(1, question.Correct.length);
    });
  });
});

describe('Question class', function() {
  describe('getRandomAnswer()', function() {
    var question = new core.Question('How are You today?', [ 'bad', 'fine', 'good', ], [ 2 ]);
    var answer = question.getRandomAnswer();
  
    it('should return an Answer object', function() {
      assert.equal(true, answer instanceof core.Answer);
    });
  
    it('should decrease StayedAnswers count by 1', function() {
      assert.equal(2, question.StayedAnswers.length);
    });
  });

  describe('removeIndex()', function() {
    var question = new core.Question('How are You today?', [ 'bad', 'fine', 'good', ], [ 2 ]);

    it('should remove the correct index from StayedAnswers', function() {
      question.removeIndex(0);
      assert.equal(question.StayedAnswers[0].ID, 1);
    });
  
    it('should decrease StayedAnswers count by 1', function() {
      assert.equal(question.StayedAnswers.length, 2);
    });
  });
});
