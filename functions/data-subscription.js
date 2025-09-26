// netlify/functions/data-subscription.js

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  // process.env.SUPABASE_URL,
  // process.env.SUPABASE_ANON_KEY
	"https://iskblpvuuwrdlnzkevmq.supabase.co",
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlza2JscHZ1dXdyZGxuemtldm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4OTUxNjAsImV4cCI6MjA3NDQ3MTE2MH0.JEyCHZYGLNnQat1VK-PZc3u9FOxCKaCF5mr6WfGmXcI"
);

export async function handler(event) {
	try {
		console.log(JSON.stringify(subscriptions));
		if (event.httpMethod === "GET") {
			// Return all subscriptions
			return {
				statusCode: 200,
				body: JSON.stringify(subscriptions),
			};
		} else if (event.httpMethod === "POST") {


		const subscription = JSON.parse(event.body);
		// TODO: Save subscription to a database (e.g., Fauna, DynamoDB, Supabase, or even a JSON file in dev)
		console.log("Received subscription:", subscription);

		const { error } = await supabase.from("ecosubscriptions").upsert({
		      endpoint: subscription.endpoint,
		      p256dh: subscription.keys.p256dh,
		      auth: subscription.keys.auth,
		    });

		    if (error) throw error;
			
		return {
			statusCode: 200,
			body: JSON.stringify({
				success: true
			}),
		};
	} else {
		return {
			statusCode: 405,
			body: JSON.stringify({
				error: "Method not allowed"
			}),
		};
	}

} catch (error) {
	console.log(JSON.stringify(error));
	return {
		statusCode: 400,
		body: JSON.stringify({
			error: "Invalid request"
		}),
	};
}
};
