// Generated by CoffeeScript 1.7.1
var TicTacToeAI, draw, owins, progress, xwins,
  __slice = [].slice,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Array.prototype.count = function(e) {
  var a, c, _i, _len;
  c = 0;
  for (_i = 0, _len = this.length; _i < _len; _i++) {
    a = this[_i];
    if (a === e) {
      c++;
    }
  }
  return c;
};

Array.prototype.max = function() {
  return this.reduce(function(p, v) {
    if (p > v) {
      return p;
    } else {
      return v;
    }
  });
};

Array.prototype.random = function() {
  return this[Math.floor(Math.random() * this.length)];
};

xwins = [["X", "O", ""], ["O", "X", ""], ["O", "O", "X"]];

owins = [["O", "O", "O"], ["X", "", "X"], ["X", "", ""]];

draw = [["X", "O", "X"], ["O", "O", "X"], ["X", "X", "O"]];

progress = [["X", "O", ""], ["X", "O", ""], ["", "", ""]];

TicTacToeAI = {
  sets: [["00", "01", "02"], ["10", "11", "12"], ["20", "21", "22"], ["00", "10", "20"], ["01", "11", "21"], ["02", "12", "22"], ["00", "11", "22"], ["02", "11", "20"]],
  handleXY: function(coordinates) {
    if (coordinates.constructor === String) {
      return coordinates;
    } else if (coordinates.constructor === Array) {
      return coordinates.slice(0, 2).join("");
    }
  },
  getBox: function(board, coordinate) {
    return board[coordinate[1]][coordinate[0]];
  },
  getBoxes: function() {
    var board, coordinates, m, _i, _len, _results;
    board = arguments[0], coordinates = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (coordinates.length === 1) {
      return this.getBox(board, coordinates[0]);
    } else {
      _results = [];
      for (_i = 0, _len = coordinates.length; _i < _len; _i++) {
        m = coordinates[_i];
        _results.push(this.getBox(board, m));
      }
      return _results;
    }
  },
  getSetMembership: function(coordinates) {
    var j, k, _i, _len, _ref, _results;
    j = this.handleXY(coordinates);
    _ref = this.sets;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      k = _ref[_i];
      if (__indexOf.call(k, j) >= 0) {
        _results.push(k);
      } else {

      }
    }
    return _results;
  },
  rankBox: function(board, coordinates, protagonist, antagonist) {

    /*
    		if @getBox(board, coordinates) in [protagonist, antagonist]
    			for set in @getSetMembership(coordinates)
    				-1
    		else
    			a = for set in @getSetMembership(coordinates)
    				k = @getBoxes(board, set[0], set[1], set[2])
    				if antagonist in k
    					0
    				else
    					c=k.count(protagonist)
    					12.5 * c ** 2 + 12.5 * c + 25
     */
    var k, set, _i, _len, _ref, _results;
    _ref = this.getSetMembership(coordinates);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      set = _ref[_i];
      k = this.getBoxes(board, set[0], set[1], set[2]);
      _results.push(100 * (Math.pow(2, 1 - k.count(""))) * (__indexOf.call(k, antagonist) < 0) * (this.getBox(board, coordinates) === "") - (this.getBox(board, coordinates) !== ""));
    }
    return _results;
  },
  getEmptyCoordinates: function(board) {
    var x, _i, _len, _ref, _results;
    _ref = ["00", "01", "02", "10", "11", "12", "20", "21", "22"];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      x = _ref[_i];
      if (this.getBox(board, x) === "") {
        _results.push(x);
      } else {

      }
    }
    return _results;
  },
  getOptimumPlacement: function(board, protagonist, antagonist) {
    var best, c, j, n, r, results, theverybest;
    j = this.getEmptyCoordinates(board);
    results = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = j.length; _i < _len; _i++) {
        c = j[_i];
        r = this.rankBox(board, c, protagonist, antagonist);
        _results.push({
          c: c,
          max: r.max(),
          count: r.count(r.max()),
          r: r
        });
      }
      return _results;
    }).call(this);
    results.sort(function(a, b) {
      if (a.max > b.max) {
        return -1;
      }
      if (a.max < b.max) {
        return 1;
      }
      if (a.max = b.max) {
        return 0;
      }
    });
    best = (function() {
      var _i, _ref, _results;
      _results = [];
      for (n = _i = 0, _ref = results.length; 0 <= _ref ? _i < _ref : _i > _ref; n = 0 <= _ref ? ++_i : --_i) {
        if (results[0].max === results[n].max) {
          _results.push(results[n]);
        } else {

        }
      }
      return _results;
    })();
    best.sort(function(a, b) {
      if (a.count > b.count) {
        return -1;
      }
      if (a.count < b.count) {
        return 1;
      }
      if (a.count = b.count) {
        return 0;
      }
    });
    theverybest = (function() {
      var _i, _ref, _results;
      _results = [];
      for (n = _i = 0, _ref = best.length; 0 <= _ref ? _i < _ref : _i > _ref; n = 0 <= _ref ? ++_i : --_i) {
        if (best[0].count === best[n].count) {
          _results.push(best[n]);
        } else {

        }
      }
      return _results;
    })();
    return theverybest;
  },
  getOptimum: function(board, protagonist, antagonist) {
    var bestA, bestP;
    bestP = this.getOptimumPlacement(board, protagonist, antagonist).random();
    bestA = this.getOptimumPlacement(board, antagonist, protagonist).random();
    if (bestP.max === 100 || (bestA.max !== 100 && bestP.max !== -1)) {
      return bestP.c;
    } else if (bestA.max === 100) {
      return bestA.c;
    } else if (bestP.max === -1) {
      return false;
    }
  },
  isFutile: function(board, protagonist, antagonist) {
    return this.getOptimumPlacement(board, protagonist, antagonist).random().max === 0 && this.getOptimumPlacement(board, antagonist, protagonist).random().max === 0;
  },
  checkGame: function(board) {
    var set, status, why, _i, _len, _ref;
    status = false;
    why = false;
    _ref = this.sets;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      set = _ref[_i];
      if ("XXX" === this.getBoxes(board, set[0], set[1], set[2]).join("")) {
        status = "X";
        why = set;
      } else if ("OOO" === this.getBoxes(board, set[0], set[1], set[2]).join("")) {
        status = "O";
        why = set;
      }
    }
    if (status === false) {
      if (this.getEmptyCoordinates(board).length === 0 || this.isFutile(board, "X", "O") === true) {
        status = "D";
      } else {
        status = "P";
      }
    }
    return {
      status: status,
      why: why
    };
  }
};
