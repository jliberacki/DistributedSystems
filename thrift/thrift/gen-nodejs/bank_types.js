//
// Autogenerated by Thrift Compiler (0.12.0)
//
// DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
//
"use strict";

var thrift = require('thrift');
var Thrift = thrift.Thrift;
var Q = thrift.Q;


var ttypes = module.exports = {};
var Account = module.exports.Account = function(args) {
  this.pesel = null;
  this.firstname = null;
  this.lastname = null;
  this.incomeThreshold = null;
  this.currency = null;
  if (args) {
    if (args.pesel !== undefined && args.pesel !== null) {
      this.pesel = args.pesel;
    }
    if (args.firstname !== undefined && args.firstname !== null) {
      this.firstname = args.firstname;
    }
    if (args.lastname !== undefined && args.lastname !== null) {
      this.lastname = args.lastname;
    }
    if (args.incomeThreshold !== undefined && args.incomeThreshold !== null) {
      this.incomeThreshold = args.incomeThreshold;
    }
    if (args.currency !== undefined && args.currency !== null) {
      this.currency = args.currency;
    }
  }
};
Account.prototype = {};
Account.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.STRING) {
        this.pesel = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.STRING) {
        this.firstname = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.STRING) {
        this.lastname = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 4:
      if (ftype == Thrift.Type.DOUBLE) {
        this.incomeThreshold = input.readDouble();
      } else {
        input.skip(ftype);
      }
      break;
      case 5:
      if (ftype == Thrift.Type.STRING) {
        this.currency = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

Account.prototype.write = function(output) {
  output.writeStructBegin('Account');
  if (this.pesel !== null && this.pesel !== undefined) {
    output.writeFieldBegin('pesel', Thrift.Type.STRING, 1);
    output.writeString(this.pesel);
    output.writeFieldEnd();
  }
  if (this.firstname !== null && this.firstname !== undefined) {
    output.writeFieldBegin('firstname', Thrift.Type.STRING, 2);
    output.writeString(this.firstname);
    output.writeFieldEnd();
  }
  if (this.lastname !== null && this.lastname !== undefined) {
    output.writeFieldBegin('lastname', Thrift.Type.STRING, 3);
    output.writeString(this.lastname);
    output.writeFieldEnd();
  }
  if (this.incomeThreshold !== null && this.incomeThreshold !== undefined) {
    output.writeFieldBegin('incomeThreshold', Thrift.Type.DOUBLE, 4);
    output.writeDouble(this.incomeThreshold);
    output.writeFieldEnd();
  }
  if (this.currency !== null && this.currency !== undefined) {
    output.writeFieldBegin('currency', Thrift.Type.STRING, 5);
    output.writeString(this.currency);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var AccountDetails = module.exports.AccountDetails = function(args) {
  this.balance = null;
  this.currency = null;
  this.isPremium = null;
  if (args) {
    if (args.balance !== undefined && args.balance !== null) {
      this.balance = args.balance;
    }
    if (args.currency !== undefined && args.currency !== null) {
      this.currency = args.currency;
    }
    if (args.isPremium !== undefined && args.isPremium !== null) {
      this.isPremium = args.isPremium;
    }
  }
};
AccountDetails.prototype = {};
AccountDetails.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.DOUBLE) {
        this.balance = input.readDouble();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.STRING) {
        this.currency = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.BOOL) {
        this.isPremium = input.readBool();
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

AccountDetails.prototype.write = function(output) {
  output.writeStructBegin('AccountDetails');
  if (this.balance !== null && this.balance !== undefined) {
    output.writeFieldBegin('balance', Thrift.Type.DOUBLE, 1);
    output.writeDouble(this.balance);
    output.writeFieldEnd();
  }
  if (this.currency !== null && this.currency !== undefined) {
    output.writeFieldBegin('currency', Thrift.Type.STRING, 2);
    output.writeString(this.currency);
    output.writeFieldEnd();
  }
  if (this.isPremium !== null && this.isPremium !== undefined) {
    output.writeFieldBegin('isPremium', Thrift.Type.BOOL, 3);
    output.writeBool(this.isPremium);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var LoanCosts = module.exports.LoanCosts = function(args) {
  this.nativeCurrencyCost = null;
  this.requestedCurrencyCost = null;
  if (args) {
    if (args.nativeCurrencyCost !== undefined && args.nativeCurrencyCost !== null) {
      this.nativeCurrencyCost = args.nativeCurrencyCost;
    }
    if (args.requestedCurrencyCost !== undefined && args.requestedCurrencyCost !== null) {
      this.requestedCurrencyCost = args.requestedCurrencyCost;
    }
  }
};
LoanCosts.prototype = {};
LoanCosts.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.DOUBLE) {
        this.nativeCurrencyCost = input.readDouble();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.DOUBLE) {
        this.requestedCurrencyCost = input.readDouble();
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

LoanCosts.prototype.write = function(output) {
  output.writeStructBegin('LoanCosts');
  if (this.nativeCurrencyCost !== null && this.nativeCurrencyCost !== undefined) {
    output.writeFieldBegin('nativeCurrencyCost', Thrift.Type.DOUBLE, 1);
    output.writeDouble(this.nativeCurrencyCost);
    output.writeFieldEnd();
  }
  if (this.requestedCurrencyCost !== null && this.requestedCurrencyCost !== undefined) {
    output.writeFieldBegin('requestedCurrencyCost', Thrift.Type.DOUBLE, 2);
    output.writeDouble(this.requestedCurrencyCost);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var LoanParameters = module.exports.LoanParameters = function(args) {
  this.currency = null;
  this.moneyAmount = null;
  this.years = null;
  if (args) {
    if (args.currency !== undefined && args.currency !== null) {
      this.currency = args.currency;
    }
    if (args.moneyAmount !== undefined && args.moneyAmount !== null) {
      this.moneyAmount = args.moneyAmount;
    }
    if (args.years !== undefined && args.years !== null) {
      this.years = args.years;
    }
  }
};
LoanParameters.prototype = {};
LoanParameters.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.STRING) {
        this.currency = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.DOUBLE) {
        this.moneyAmount = input.readDouble();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.DOUBLE) {
        this.years = input.readDouble();
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

LoanParameters.prototype.write = function(output) {
  output.writeStructBegin('LoanParameters');
  if (this.currency !== null && this.currency !== undefined) {
    output.writeFieldBegin('currency', Thrift.Type.STRING, 1);
    output.writeString(this.currency);
    output.writeFieldEnd();
  }
  if (this.moneyAmount !== null && this.moneyAmount !== undefined) {
    output.writeFieldBegin('moneyAmount', Thrift.Type.DOUBLE, 2);
    output.writeDouble(this.moneyAmount);
    output.writeFieldEnd();
  }
  if (this.years !== null && this.years !== undefined) {
    output.writeFieldBegin('years', Thrift.Type.DOUBLE, 3);
    output.writeDouble(this.years);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var AuthorizationException = module.exports.AuthorizationException = function(args) {
  Thrift.TException.call(this, "AuthorizationException");
  this.name = "AuthorizationException";
  this.reason = null;
  if (args) {
    if (args.reason !== undefined && args.reason !== null) {
      this.reason = args.reason;
    }
  }
};
Thrift.inherits(AuthorizationException, Thrift.TException);
AuthorizationException.prototype.name = 'AuthorizationException';
AuthorizationException.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.STRING) {
        this.reason = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

AuthorizationException.prototype.write = function(output) {
  output.writeStructBegin('AuthorizationException');
  if (this.reason !== null && this.reason !== undefined) {
    output.writeFieldBegin('reason', Thrift.Type.STRING, 1);
    output.writeString(this.reason);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var InvalidArgumentException = module.exports.InvalidArgumentException = function(args) {
  Thrift.TException.call(this, "InvalidArgumentException");
  this.name = "InvalidArgumentException";
  this.reason = null;
  if (args) {
    if (args.reason !== undefined && args.reason !== null) {
      this.reason = args.reason;
    }
  }
};
Thrift.inherits(InvalidArgumentException, Thrift.TException);
InvalidArgumentException.prototype.name = 'InvalidArgumentException';
InvalidArgumentException.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.STRING) {
        this.reason = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

InvalidArgumentException.prototype.write = function(output) {
  output.writeStructBegin('InvalidArgumentException');
  if (this.reason !== null && this.reason !== undefined) {
    output.writeFieldBegin('reason', Thrift.Type.STRING, 1);
    output.writeString(this.reason);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var MissingArgumentException = module.exports.MissingArgumentException = function(args) {
  Thrift.TException.call(this, "MissingArgumentException");
  this.name = "MissingArgumentException";
  this.reason = null;
  if (args) {
    if (args.reason !== undefined && args.reason !== null) {
      this.reason = args.reason;
    }
  }
};
Thrift.inherits(MissingArgumentException, Thrift.TException);
MissingArgumentException.prototype.name = 'MissingArgumentException';
MissingArgumentException.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.STRING) {
        this.reason = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

MissingArgumentException.prototype.write = function(output) {
  output.writeStructBegin('MissingArgumentException');
  if (this.reason !== null && this.reason !== undefined) {
    output.writeFieldBegin('reason', Thrift.Type.STRING, 1);
    output.writeString(this.reason);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

