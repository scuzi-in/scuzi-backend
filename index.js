const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: SUPABASE_URL or SUPABASE_ANON_KEY missing in .env!');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test Route to check live server status
app.get('/', (req, res) => {
  res.status(200).send('🚀 Scuzi Backend is Live and Running!');
});

app.post('/api/contact', async (req, res) => {
  try {
    const { firstName, lastName, workEmail, serviceInterest, message } =
      req.body;

    // Validation
    if (!firstName || !lastName || !workEmail || !serviceInterest || !message) {
      return res
        .status(400)
        .json({ success: false, error: 'All fields are required!' });
    }

    // Supabase insert operation with explicit .select()
    const { data, error } = await supabase
      .from('contacts')
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          work_email: workEmail,
          service_interest: serviceInterest,
          message: message,
        },
      ])
      .select(); // ID auto-generation successfully capture karne ke liye zaroori hai

    if (error) {
      throw error;
    }

    return res
      .status(201)
      .json({ success: true, message: 'Data saved successfully!', data });
  } catch (err) {
    // Render logs mein details dekhne ke liye
    console.error('❌ Supabase Error Details:', err);
    return res.status(500).json({
      success: false,
      error: 'Server Error',
      details: err.message || err,
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
