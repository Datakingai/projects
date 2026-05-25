const button = document.getElementById("actionButton");

button.addEventListener("click", () => {
  const message = "Your new website is ready! Customize this section with your own content.";
  alert(message);
});

// Agentic AI prompt logic
const aiPromptButton = document.getElementById("aiPromptButton");
const aiPromptInput = document.getElementById("aiPromptInput");
const aiResult = document.getElementById("aiResult");

if (aiPromptButton && aiPromptInput && aiResult) {
  aiPromptButton.addEventListener("click", () => {
    const prompt = aiPromptInput.value.trim();
    if (!prompt) {
      aiResult.innerHTML = '<p>Please enter a prompt for a video or song.</p>';
      return;
    }
    // Mock AI response logic
    if (/video/i.test(prompt)) {
      aiResult.innerHTML = `
        <h3>AI Suggested Video</h3>
        <iframe width="360" height="215" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="AI Video" frameborder="0" allowfullscreen></iframe>
      `;
    } else if (/song|music/i.test(prompt)) {
      aiResult.innerHTML = `
        <h3>AI Suggested Song</h3>
        <audio controls>
          <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg">
          Your browser does not support the audio element.
        </audio>
      `;
    } else {
      aiResult.innerHTML = `<p>Sorry, I can only suggest videos or songs for now.</p>`;
    }
  });
}
