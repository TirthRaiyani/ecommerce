require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
const authRouters = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api', productRoutes);
app.use('/api', authRouters);

app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
