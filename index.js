const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Supabase Client Initialize kiya
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    '❌ Error: SUPABASE_URL aur SUPABASE_ANON_KEY .env file mein missing hain!',
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Connection check karne ke liye ek chota sa test log
console.log('📡 Supabase Client Initialized Successfully!');

// API Route: Contact Form Data Save karne ke liye
app.post('/api/contact', async (req, res) => {
  try {
    const { firstName, lastName, workEmail, serviceInterest, message } =
      req.body;

    // Validation
    if (!firstName || !lastName || !workEmail || !serviceInterest || !message) {
      return res
        .status(400)
        .json({ success: false, error: 'Sabh fields bharna zaroori hai!' });
    }

    // Supabase ke 'contacts' table mein data insert karna
    const { data, error } = await supabase
      .from('contacts') // Aapki Supabase table ka naam
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          work_email: workEmail,
          service_interest: serviceInterest,
          message: message,
        },
      ])
      .select();

    if (error) {
      throw error;
    }

    return res
      .status(201)
      .json({ success: true, message: 'Form data saved to Supabase!' });
  } catch (error) {
    console.error('❌ Supabase Insertion Error:', error.message);
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running smoothly on port ${PORT}`);
});
