// netlify/functions/save-subscription.js

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const subscription = JSON.parse(event.body);

    // TODO: Save subscription to a database (e.g., Fauna, DynamoDB, Supabase, or even a JSON file in dev)
    console.log("Received subscription:", subscription);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid request" }),
    };
  }
};

