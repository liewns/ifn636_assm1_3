const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const Expense = require('../models/Expense');
const Trip = require('../models/Trip');
const {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} = require('../controllers/expenseController');

const { expect } = chai;

afterEach(() => {
  sinon.restore();
});

describe('CreateExpense Function Test', () => {
  it('should create a new expense successfully', async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const tripId = new mongoose.Types.ObjectId().toString();
    const expenseId = new mongoose.Types.ObjectId();

    const req = {
      user: { id: userId },
      body: {
        title: 'Hotel Booking',
        amount: 500,
        category: 'Accommodation',
        date: '2026-06-02',
        trip: tripId,
        notes: 'Tokyo hotel',
      },
    };

    const selectedTrip = {
      _id: tripId,
      user: { toString: () => userId },
    };

    const createdExpense = {
      _id: expenseId,
      user: userId,
      ...req.body,
    };

    const populatedExpense = {
      ...createdExpense,
      trip: { _id: tripId, tripName: 'Japan Trip' },
    };

    sinon.stub(Trip, 'findById').onFirstCall().resolves(selectedTrip);
    sinon.stub(Expense, 'create').resolves(createdExpense);
    sinon
      .stub(Expense, 'findById')
      .withArgs(expenseId)
      .returns({
        populate: sinon.stub().resolves(populatedExpense),
      });

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await createExpense(req, res);

    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(populatedExpense)).to.be.true;
  });

  it('should return 400 if required fields are missing', async () => {
    const req = {
      user: { id: new mongoose.Types.ObjectId().toString() },
      body: {
        title: '',
        amount: 500,
        category: 'Accommodation',
        date: '2026-06-02',
        trip: new mongoose.Types.ObjectId().toString(),
      },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await createExpense(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(
      res.json.calledWithMatch({ message: 'Please fill in all required fields' })
    ).to.be.true;
  });

  it('should return 500 if an error occurs', async () => {
    const req = {
      user: { id: new mongoose.Types.ObjectId().toString() },
      body: {
        title: 'Hotel Booking',
        amount: 500,
        category: 'Accommodation',
        date: '2026-06-02',
        trip: new mongoose.Types.ObjectId().toString(),
        notes: 'Tokyo hotel',
      },
    };

    sinon.stub(Trip, 'findById').throws(new Error('DB Error'));
    sinon.stub(console, 'error');

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await createExpense(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });
});

describe('GetExpenses Function Test', () => {
  it('should return expenses for the given user', async () => {
    const userId = new mongoose.Types.ObjectId().toString();

    const expenses = [
      {
        _id: new mongoose.Types.ObjectId(),
        user: userId,
        title: 'Hotel Booking',
        amount: 500,
      },
    ];

    const sortStub = sinon.stub().resolves(expenses);
    const populateStub = sinon.stub().returns({ sort: sortStub });
    const findStub = sinon.stub(Expense, 'find').returns({ populate: populateStub });

    const req = {
      user: { id: userId },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await getExpenses(req, res);

    expect(findStub.calledOnceWith({ user: userId })).to.be.true;
    expect(populateStub.calledOnceWith('trip', 'tripName')).to.be.true;
    expect(sortStub.calledOnceWith({ date: -1, createdAt: -1 })).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(expenses)).to.be.true;
  });

  it('should return 500 on error', async () => {
    const req = {
      user: { id: new mongoose.Types.ObjectId().toString() },
    };

    sinon.stub(Expense, 'find').throws(new Error('DB Error'));
    sinon.stub(console, 'error');

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await getExpenses(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });
});

describe('UpdateExpense Function Test', () => {
  it('should update expense successfully', async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const expenseId = new mongoose.Types.ObjectId();
    const tripId = new mongoose.Types.ObjectId().toString();

    const expense = {
      _id: expenseId,
      user: { toString: () => userId },
      trip: tripId,
      title: 'Old Expense',
      amount: 100,
      category: 'Food',
      date: '2026-06-01',
      notes: 'Old notes',
      save: sinon.stub().resolvesThis(),
    };

    const selectedTrip = {
      _id: tripId,
      user: { toString: () => userId },
    };

    const populatedExpense = {
      ...expense,
      trip: { _id: tripId, tripName: 'Japan Trip' },
    };

    sinon.stub(Expense, 'findById')
      .onFirstCall().resolves(expense)
      .onSecondCall().returns({
        populate: sinon.stub().resolves(populatedExpense),
      });

    sinon.stub(Trip, 'findById').resolves(selectedTrip);

    const req = {
      user: { id: userId },
      params: { id: expenseId.toString() },
      body: {
        title: 'Updated Expense',
        amount: 200,
        category: 'Transport',
        date: '2026-06-03',
        trip: tripId,
        notes: 'Updated notes',
      },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await updateExpense(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(populatedExpense)).to.be.true;
  });

  it('should return 404 if expense is not found', async () => {
    sinon.stub(Expense, 'findById').resolves(null);

    const req = {
      user: { id: new mongoose.Types.ObjectId().toString() },
      params: { id: new mongoose.Types.ObjectId().toString() },
      body: {},
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await updateExpense(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Expense not found' })).to.be.true;
  });

  it('should return 500 on error', async () => {
    sinon.stub(Expense, 'findById').throws(new Error('DB Error'));
    sinon.stub(console, 'error');

    const req = {
      user: { id: new mongoose.Types.ObjectId().toString() },
      params: { id: new mongoose.Types.ObjectId().toString() },
      body: {},
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await updateExpense(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });
});

describe('DeleteExpense Function Test', () => {
  it('should delete an expense successfully', async () => {
    const userId = new mongoose.Types.ObjectId().toString();

    const expense = {
      _id: new mongoose.Types.ObjectId(),
      user: { toString: () => userId },
      deleteOne: sinon.stub().resolves(),
    };

    sinon.stub(Expense, 'findById').resolves(expense);

    const req = {
      user: { id: userId },
      params: { id: expense._id.toString() },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await deleteExpense(req, res);

    expect(expense.deleteOne.calledOnce).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;
    expect(
      res.json.calledWithMatch({ message: 'Expense deleted successfully' })
    ).to.be.true;
  });

  it('should return 404 if expense is not found', async () => {
    sinon.stub(Expense, 'findById').resolves(null);

    const req = {
      user: { id: new mongoose.Types.ObjectId().toString() },
      params: { id: new mongoose.Types.ObjectId().toString() },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await deleteExpense(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Expense not found' })).to.be.true;
  });

  it('should return 500 if an error occurs', async () => {
    sinon.stub(Expense, 'findById').throws(new Error('DB Error'));
    sinon.stub(console, 'error');

    const req = {
      user: { id: new mongoose.Types.ObjectId().toString() },
      params: { id: new mongoose.Types.ObjectId().toString() },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await deleteExpense(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });
});