// netlify/functions/send-push.js
import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";

const supabase = createClient(
	"https://iskblpvuuwrdlnzkevmq.supabase.co",
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlza2JscHZ1dXdyZGxuemtldm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4OTUxNjAsImV4cCI6MjA3NDQ3MTE2MH0.JEyCHZYGLNnQat1VK-PZc3u9FOxCKaCF5mr6WfGmXcI"
);

// Set VAPID keys (generate with npx web-push generate-vapid-keys)
webpush.setVapidDetails(
  "mailto:you@example.com",
  "BMPstOfOA-L8A6NEM3-MSXHk3sBYj2hm8RSaCI_pUCkb7iFg3FuhDJRIUmPh9k2o__yqbLQAFonjNHp1k0PIjec",
  "ruaNl5H32tosZ6IpUcdZfdT4xv6-drE3hOFTESe1n34"
);

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const { target, message } = JSON.parse(event.body);

    // Fetch subscriptions
    let { data: subs, error } = await supabase.from("ecosubscriptions").select("*");
    if (error) throw error;

    if (target !== "all") {
      subs = subs.filter((s) => s.endpoint === target);
    }

    const results = await Promise.all(
      subs.map((s) =>
        webpush.sendNotification(
          {
            endpoint: s.endpoint,
            keys: { p256dh: s.p256dh, auth: s.auth },
          },
          JSON.stringify({ title: "PWA Notification", body: message })
        ).catch((err) => ({ error: err.message, endpoint: s.endpoint }))
      )
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ sent: results.length, results }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
