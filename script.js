const button = document.getElementById("actionButton");

button.addEventListener("click", () => {
  const message = "Your new website is ready! Customize this section with your own content.";
  alert(message);
});

// Agentic AI prompt logic
const aiPromptButton = document.getElementById("aiPromptButton");
const aiPromptInput = document.getElementById("aiPromptInput");
const aiResult = document.getElementById("aiResult");
const aiModelSelect = document.getElementById("aiModelSelect");

async function callAIModel(model, prompt) {
  let url = '';
  if (model === 'gemini') url = '/api/gemini';
  else if (model === 'openai') url = '/api/openai';
  else return { error: 'Unknown model' };
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    return await res.json();
  } catch (err) {
    return { error: err.message };
  }
}

if (aiPromptButton && aiPromptInput && aiResult && aiModelSelect) {
  aiPromptButton.addEventListener("click", async () => {
    const prompt = aiPromptInput.value.trim();
    const model = aiModelSelect.value;
    if (!prompt) {
      aiResult.innerHTML = '<p>Please enter a prompt for research, video, or song.</p>';
      return;
    }
    aiResult.innerHTML = '<p><em>Researching with ' + model + '...</em></p>';
    const data = await callAIModel(model, prompt);
    if (data.error) {
      aiResult.innerHTML = `<p>Error: ${data.error}</p>`;
      return;
    }
    // Gemini response
    if (model === 'gemini' && data.candidates && data.candidates[0]?.content?.parts) {
      aiResult.innerHTML = `<h3>Gemini Result</h3><p>${data.candidates[0].content.parts.map(p => p.text).join('<br>')}</p>`;
    }
    // OpenAI response
    else if (model === 'openai' && data.choices && data.choices[0]?.message?.content) {
      aiResult.innerHTML = `<h3>OpenAI Result</h3><p>${data.choices[0].message.content.replace(/\n/g, '<br>')}</p>`;
    }
    else {
      aiResult.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    }
  });
}
