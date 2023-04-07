const express = require('express');
const router = express.Router();
const employeesController = require('../../controllers/employeesController');


/**
 * @swagger
 * /employees:
 *  get:
 *      summary: To get all employees from mySQL.
 *      description: This API is used to fetch data from mySQL
 *      responses:
 *          200:
 *              description: This API is used to fetch data from mySQL
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schema/employees'
 */
router.route('/').get(employeesController.findAll)


router.route('/').post(employeesController.create)
    .put(employeesController.update)

router.route('/:id')
    .get(employeesController.findOne)
    .delete(employeesController.delete)

module.exports = router;
