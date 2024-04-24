const express = require('express');
const path = require('path');
const da = require('./data-access');

const app = express();
const port = 4000;
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/customers", async (req, res) => {
  const [cust, err] = await da.getCustomers();
  if(cust){
      res.send(cust);
  }else{
      res.status(500);
      res.send(err);
  }   
});

app.get("/reset", async (req, res) => {
  const [result, err] = await da.resetCustomers();
  if(result){
      res.send(result);
  }else{
      res.status(500);
      res.send(err);
  }   
});

app.post('/customers', async (req, res) => {
  const newCustomer = req.body;
  if (newCustomer === null || Object.keys(req.body).length === 0) {
      res.status(400);
      res.send("missing request body");
  } else {
      // return array format [status, id, errMessage]
      const [status, id, errMessage] = await da.addCustomer(newCustomer);
      if (status === "success") {
          res.status(201);
          let response = { ...newCustomer };
          response["_id"] = id;
          res.send(response);
      } else {
          res.status(400);
          res.send(errMessage);
      }
  }
});

app.get("/customers/:id", async (req, res) => {
  const id = req.params.id;
  // return array [customer, errMessage]
  const [cust, err] = await da.getCustomerById(id);
  if(cust){
      res.send(cust);
  }else{
      res.status(404);
      res.send(err);
  }   
});