
    export async function sendToMakeWebhook(webhookUrl, data) {
      if (!webhookUrl) {
        console.warn('Webhook URL is not provided. Skipping webhook send.');
        return { success: true, message: 'Webhook URL not configured, skipped.' }; // Considered success as it's a config issue
      }
      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          let errorBody = 'No details available';
          try {
            errorBody = await response.text();
          } catch (parseError) {
             console.error('Error parsing webhook error response:', parseError);
          }
          console.error(`Webhook request failed with status ${response.status}: ${errorBody}`);
          throw new Error(`Webhook request failed: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        let responseData;
        if (contentType && contentType.includes("application/json")) {
            responseData = await response.json();
        } else {
            responseData = await response.text(); // Make might return simple text like "Accepted"
        }
        console.log('Webhook response:', responseData);
        return { success: true, data: responseData };

      } catch (error) {
        console.error('Error sending data to Make webhook:', error);
        return { success: false, error: error.message || 'An unknown error occurred during webhook send.' };
      }
    }
  