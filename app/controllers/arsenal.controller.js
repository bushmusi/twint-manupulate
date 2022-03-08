const db = require('../models');

const Arsenal = db.arsenal;

exports.create = (req, res) => {
  if (!req.body.tweet) {
    res.status(400).send({ message: 'tweet can not be empty!' });
    return;
  }

  const arsenal = new Arsenal({
    id: req.body.id,
    conversation_id: req.body.conversation_id,
    created_at: req.body.created_at,
    date: req.body.date,
    time: req.body.time,
    timezone: req.body.timezone,
    user_id: req.body.user_id,
    username: req.body.username,
    name: req.body.name,
    place: req.body.place,
    tweet: req.body.tweet,
    language: req.body.language,
    mentions: req.body.mentions,
    urls: req.body.urls,
    photos: req.body.photos,
    replies_count: req.body.replies_count,
    retweets_count: req.body.retweets_count,
    likes_count: req.body.likes_count,
    hashtags: req.body.hashtags,
    cashtags: req.body.cashtags,
    link: req.body.link,
    retweet: req.body.retweet,
    quote_url: req.body.quote_url,
    video: req.body.video,
  });

  arsenal
    .save(arsenal)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
            err.message || 'Some error occurred while creating the Record.',
      });
    });
};

exports.findAll = (req, res) => {
  const { tweet } = req.query;
  const condition = tweet ? { tweet: { $regex: new RegExp(tweet), $options: 'i' } } : {};
  console.log(condition);
  Arsenal.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
            err.message || 'Some error occurred while retrieving tweet.',
      });
    });
};

exports.findOne = (req, res) => {
  const { id } = req.params;

  Arsenal.findById(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: `Not found tweet with id ${id}` });
      } else {
        console.log(data.user_id);
        res.send(data);
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: `Error retrieving tweet with id=${id}` });
    });
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Data to update can not be empty!',
    });
  }

  const { id } = req.params;

  Arsenal.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Tweet with id=${id}. Maybe Tweet was not found!`,
        });
      } else res.send({ message: 'Tweet was updated successfully.' });
    })
    .catch((err) => {
      res.status(500).send({
        message: `Error updating tweet with id=${id}`,
      });
    });

  return res.status(201).send({
    message: 'Updated successfully',
  });
};

exports.delete = (req, res) => {
  const { id } = req.params;

  Arsenal.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Tweet with id=${id}. Maybe Tweet was not found!`,
        });
      } else {
        res.send({
          message: 'Tweet was deleted successfully!',
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Could not delete Tweet with id=${id}`,
      });
    });
};

exports.deleteAll = (req, res) => {
  Arsenal.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Tweets were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
            err.message || 'Some error occurred while removing all Tweets.',
      });
    });
};

exports.findAllPublished = (req, res) => {
  Arsenal.find({ published: true })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
            err.message || 'Some error occurred while retrieving tweets.',
      });
    });
};