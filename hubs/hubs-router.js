const express = require('express');

const Hubs = require('./hubs-model.js');
const Messages = require('../messages/messages-model.js');

const router = express.Router();

router.use((req, res, next) => {
  console.log('We are in the hubs router!');
  next();
});

// this only runs if the url has /api/hubs in it
router.get('/', (req, res) => {
  Hubs.find(req.query)
  .then(hubs => {
    res.status(200).json(hubs);
  })
  .catch(error => {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: 'Error retrieving the hubs',
    });
  });
});

// /api/hubs/:id

router.get('/:id', (req, res) => {
  Hubs.findById(req.params.id)
  .then(hub => {
    if (hub) {
      res.status(200).json(hub);
    } else {
      res.status(404).json({ message: 'Hub not found' });
    }
  })
  .catch(error => {
    // log error to server
    console.log(error);
    next({ code: 500, message: 'Error retrieving the hub' });
    // res.status(500).json({
    //   message: 'Error retrieving the hub',
    // });
  });
});

router.post('/', requiredBody, (req, res) => {
  Hubs.add(req.body)
  .then(hub => {
    res.status(201).json(hub);
  })
  .catch(error => {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: 'Error adding the hub',
    });
  });
});

router.delete('/:id', (req, res) => {
  Hubs.remove(req.params.id)
  .then(count => {
    if (count > 0) {
      res.status(200).json({ message: 'The hub has been nuked' });
    } else {
      res.status(404).json({ message: 'The hub could not be found' });
    }
  })
  .catch(error => {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: 'Error removing the hub',
    });
  });
});

router.put('/:id', requiredBody, (req, res) => {
  Hubs.update(req.params.id, req.body)
  .then(hub => {
    if (hub) {
      res.status(200).json(hub);
    } else {
      res.status(404).json({ message: 'The hub could not be found' });
    }
  })
  .catch(error => {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: 'Error updating the hub',
    });
  });
});

// add an endpoint that returns all the messages for a hub
// this is a sub-route or sub-resource
router.get('/:id/messages', (req, res) => {
  Hubs.findHubMessages(req.params.id)
  .then(messages => {
    res.status(200).json(messages);
  })
  .catch (error => {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: 'Error getting the messages for the hub',
    });
  });
});

// add an endpoint for adding new message to a hub
router.post('/:id/messages', (req, res) => {
  const messageInfo = { ...req.body, hub_id: req.params.id };

  Messages.add(messageInfo)
  .then(message => {
    res.status(210).json(message);
  })
  .catch(error => {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: 'Error getting the messages for the hub',
    });
  });
});

function validateId(req, res, next) {
  const { id } = req.params;

  Hubs.findById(id)
    .then(hub => {
      if (hub) {
        req.hub = hub;
        next();
      } else {
        res.status(404).json({ message: 'No hub with given id' });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Error processing request'
      });
    });
}

function requiredBody(req, res, next) {
  if(req.body && Object.keys(req.body).length > 0) {
    next();
  } else {
    // res.status(500).json({ message: 'Nothing included in the request body' });

    next({ code: 400, message: 'Nothing included in the request body' });
  }
}

module.exports = router;
