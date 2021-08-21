const express = require('express');

function createRouter(db) {
  const router = express.Router();

  // the routes are defined here
  router.get('/term/:id', function (req, res, next) {
    const owner = req.user.email;
    const idall =  999999999;
    sqlterm = 'SELECT title, year, season, weekcount, date_start, date_end, halfterm_start, halfterm_end, idterm FROM term ' + (req.params.id == idall ? '' : 'WHERE idterm=? ') + 'ORDER BY date_start ASC LIMIT 10';
    db.query(
      sqlterm,
      [(req.params.id || 0)],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json(results);
        }
      }
    );
  });
  // WHERE owner=? , [owner, 10*(req.params.page || 0)]
  // 'SELECT title, year, season, weekcount, date_start, date_end, halfterm_start, halfterm_end, idterm FROM term  WHERE idterm=? ORDER BY date_start ASC LIMIT 10'

  router.get('/poolslot/:id', function (req, res, next) {
    const owner = req.user.email;
    db.query(
      'SELECT idterm, idpoolslot, title, location, daytime, capacity, lifeguard, pay_lifeguard FROM vwpool_slot WHERE idterm=? ORDER BY idterm, idpoolslot ASC LIMIT 100',
      [(req.params.id || 0)],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json(results);
        }
      }
    );
  });

  router.get('/classslot/:id', function (req, res, next) {
      const owner = req.user.email;
      db.query(
        'SELECT idterm, idpoolslot, idclass, idcoach, title, location, daytime, coach, grade, descript, lifeguard, pay_lifeguard FROM vwclass_slot WHERE idpoolslot=? ORDER BY idterm, idpoolslot, idclass, idcoach ASC LIMIT 100',
        [(req.params.id || 0)],
        (error, results) => {
          if (error) {
            console.log(error);
            res.status(500).json({status: 'error'});
          } else {
            res.status(200).json(results);
          }
        }
      );
  });

  router.get('/swimmer/:id', function (req, res, next) {
    const owner = req.user.email;
    db.query(
      'SELECT idterm, idpoolslot, idclass, idswimmer, idfamily, title, location, daytime, coach, grade, descript, firstname, surname, adultchild, inclbadge FROM vwclassswimmer WHERE idclass=? ORDER BY idterm, idpoolslot, idclass, idfamily, idswimmer ASC LIMIT 100',
      [(req.params.id || 0)],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json(results);
        }
      }
    );
  });

  router.post('/swimmer', (req, res, next) => {
    const owner = req.user.email;
    db.query(
      'INSERT INTO swimmer (idswimmer, firstname, surname, adultchild) VALUES (?,?,?,?)',
      [req.body.idswimmer, req.body.firstname, req.body.surname, req.body.adultchild],
      (error) => {
        if (error) {
          console.error(error);
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json({status: 'ok'});
        }
      }
    );
  });

  router.put('/swimmer/:id', function (req, res, next) {
    const owner = req.user.email;
    db.query(
      'UPDATE swimmer SET firstname=?, surname=?, adultchild=? WHERE idswimmer=?',
      [req.body.firstname, req.body.surname, req.body.adultchild, req.params.id],
      (error) => {
        if (error) {
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json({status: 'ok'});
        }
      }
    );
  }); 

  router.delete('/swimmer/:id', function (req, res, next) {
    const owner = req.user.email;
    db.query(
      'DELETE FROM swimmer WHERE idswimmer=?',
      [req.params.id],
      (error) => {
        if (error) {
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json({status: 'ok'});
        }
      }
    );
  });

  return router;
}

module.exports = createRouter;