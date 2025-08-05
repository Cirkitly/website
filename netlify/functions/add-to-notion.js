const { Client } = require("@notionhq/client");

// Get your secrets from environment variables
const NOTION_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

// Initialise Notion client
const notion = new Client({ auth: NOTION_KEY });

exports.handler = async function (event, context) {
  // We only care about POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { email } = JSON.parse(event.body);

    if (!email) {
        return { statusCode: 400, body: JSON.stringify({ message: "Email is required." }) };
    }

    // Add the new email to the Notion database
    await notion.pages.create({
      parent: {
        database_id: NOTION_DATABASE_ID,
      },
      properties: {
        // NOTE: The object key "Email" must exactly match the
        // "NAME" of the column in your Notion database.
        "Email": {
          title: [
            {
              text: {
                content: email,
              },
            },
          ],
        },
      },
    });

    // Return a success response
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Success! You've been added to the list." }),
    };

  } catch (error) {
    console.error(error);
    // Return an error response
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Something went wrong." }),
    };
  }
};