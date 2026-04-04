const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const Trip = require('../models/Trip');
const {
  getTrips,
  createTrip,
  updateTrip,
  deleteTrip,
} = require('../controllers/tripController');

const { expect } = chai;

afterEach(() => {
  sinon.restore();
});

describe('CreateTrip Function Test', () => {
  it('should create a new trip successfully', async () => {
    const req = {
      user: { id: new mongoose.Types.ObjectId().toString() },
      body: {
        tripName: 'Japan Trip',
        budget: 3000,
        startDate: '2026-06-01',
        endDate: '2026-06-10',
        notes: 'Holiday trip',
      },
    };

    const createdTrip = {
      _id: new mongoose.Types.ObjectId(),
      user: req.user.id,
      ...req.body,
    };

    const createStub = sinon.stub(Trip, 'create').resolves(createdTrip);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await createTrip(req, res);

    expect(
      createStub.calledOnceWith({
        user: req.user.id,
        tripName: req.body.tripName,
        budget: req.body.budget,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        notes: req.body.notes,
      })
    ).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdTrip)).to.be.true;
  });

  it('should return 400 if required fields are missing', async () => {
    const req = {
      user: { id: new mongoose.Types.ObjectId().toString() },
      body: {
        tripName: '',
        budget: 3000,
        startDate: '2026-06-01',
        endDate: '2026-06-10',
      },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await createTrip(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(
      res.json.calledWithMatch({ message: 'Please fill in all required fields' })
    ).to.be.true;
  });

  it('should return 500 if an error occurs', async () => {
    const req = {
      user: { id: new mongoose.Types.ObjectId().toString() },
      body: {
        tripName: 'Japan Trip',
        budget: 3000,
        startDate: '2026-06-01',
        endDate: '2026-06-10',
        notes: 'Holiday trip',
      },
    };

    sinon.stub(Trip, 'create').throws(new Error('DB Error'));
    sinon.stub(console, 'error');

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await createTrip(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });
});

describe('GetTrips Function Test', () => {
  it('should return trips for the given user', async () => {
    const req = {
      user: { id: new mongoose.Types.ObjectId().toString() },
    };

    const trips = [
      {
        _id: new mongoose.Types.ObjectId(),
        user: req.user.id,
        tripName: 'Japan Trip',
        budget: 3000,
      },
    ];

    const sortStub = sinon.stub().resolves(trips);
    const findStub = sinon.stub(Trip, 'find').returns({ sort: sortStub });

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await getTrips(req, res);

    expect(findStub.calledOnceWith({ user: req.user.id })).to.be.true;
    expect(sortStub.calledOnceWith({ createdAt: -1 })).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(trips)).to.be.true;
  });

  it('should return 500 on error', async () => {
    const req = {
      user: { id: new mongoose.Types.ObjectId().toString() },
    };

    sinon.stub(Trip, 'find').throws(new Error('DB Error'));
    sinon.stub(console, 'error');

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await getTrips(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });
});

describe('UpdateTrip Function Test', () => {
  it('should update trip successfully', async () => {
    const userId = new mongoose.Types.ObjectId().toString();

    const trip = {
      _id: new mongoose.Types.ObjectId(),
      user: { toString: () => userId },
      tripName: 'Old Trip',
      budget: 2000,
      startDate: '2026-06-01',
      endDate: '2026-06-05',
      notes: 'Old notes',
      save: sinon.stub().resolvesThis(),
    };

    const findByIdStub = sinon.stub(Trip, 'findById').resolves(trip);

    const req = {
      user: { id: userId },
      params: { id: trip._id.toString() },
      body: {
        tripName: 'Updated Trip',
        budget: 2500,
        startDate: '2026-06-02',
        endDate: '2026-06-06',
        notes: 'Updated notes',
      },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await updateTrip(req, res);

    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(trip.save.calledOnce).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(trip)).to.be.true;
  });

  it('should return 404 if trip is not found', async () => {
    sinon.stub(Trip, 'findById').resolves(null);

    const req = {
      user: { id: new mongoose.Types.ObjectId().toString() },
      params: { id: new mongoose.Types.ObjectId().toString() },
      body: {},
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await updateTrip(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Trip not found' })).to.be.true;
  });

  it('should return 500 on error', async () => {
    sinon.stub(Trip, 'findById').throws(new Error('DB Error'));
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

    await updateTrip(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });
});

describe('DeleteTrip Function Test', () => {
  it('should delete a trip successfully', async () => {
    const userId = new mongoose.Types.ObjectId().toString();

    const trip = {
      _id: new mongoose.Types.ObjectId(),
      user: { toString: () => userId },
      deleteOne: sinon.stub().resolves(),
    };

    const findByIdStub = sinon.stub(Trip, 'findById').resolves(trip);

    const req = {
      user: { id: userId },
      params: { id: trip._id.toString() },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await deleteTrip(req, res);

    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(trip.deleteOne.calledOnce).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;
    expect(
      res.json.calledWithMatch({ message: 'Trip deleted successfully' })
    ).to.be.true;
  });

  it('should return 404 if trip is not found', async () => {
    sinon.stub(Trip, 'findById').resolves(null);

    const req = {
      user: { id: new mongoose.Types.ObjectId().toString() },
      params: { id: new mongoose.Types.ObjectId().toString() },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await deleteTrip(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Trip not found' })).to.be.true;
  });

  it('should return 500 if an error occurs', async () => {
    sinon.stub(Trip, 'findById').throws(new Error('DB Error'));
    sinon.stub(console, 'error');

    const req = {
      user: { id: new mongoose.Types.ObjectId().toString() },
      params: { id: new mongoose.Types.ObjectId().toString() },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await deleteTrip(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });
});