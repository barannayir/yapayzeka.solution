export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Only handle /contact-form POST requests
    if (url.pathname === '/contact-form' && request.method === 'POST') {
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      };

      if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
      }

      try {
        const formData = await request.formData();
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone') || 'Not provided';
        const company = formData.get('company') || 'Not provided';
        const message = formData.get('message');

        if (!name || !email || !message) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Missing required fields' 
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const TELEGRAM_BOT_TOKEN = '8654463682:AAH1i9ZZtvctgE1W_8hLIaBy0KSGyqmatOE';
        const TELEGRAM_CHAT_ID = '929009215';

        const telegramMessage = `
🚀 <b>Yeni İletişim Formu</b>

👤 <b>Ad:</b> ${name}
📧 <b>E-posta:</b> ${email}
📱 <b>Telefon:</b> ${phone}
🏢 <b>Şirket:</b> ${company}

💬 <b>Mesaj:</b>
${message}

━━━━━━━━━━━━━━━━━━━━━━━
🌐 <b>Kaynak:</b> yapayzeka.solution/iletisim
🕒 <b>Tarih:</b> ${new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })}
      `.trim();

        const telegramResponse = await fetch(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: TELEGRAM_CHAT_ID,
              text: telegramMessage,
              parse_mode: 'HTML'
            })
          }
        );

        if (!telegramResponse.ok) {
          throw new Error('Failed to send Telegram notification');
        }

        return new Response(JSON.stringify({ 
          success: true,
          message: 'Mesajınız alındı! En kısa sürede size dönüş yapacağız.' 
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Mesaj gönderilemedi. Lütfen WhatsApp üzerinden iletişime geçin.' 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // For all other requests, just pass through
    return fetch(request);
  }
};
