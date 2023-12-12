import React from 'react';

const Documentation = () => {
  const features = [
    { name: "GPT-4 Turbo", description: "Chat with the cutting-edge GPT-4 Turbo model." },
    { name: "GPT-4 Vision", description: "Interact with powerful vision models, to use Vision model, simply paste the image to the input box." },
    { name: "Roles/assistants", description: "Let ChatGPT assume various roles or act as an assistant to provide more satisfactory answers. You can customize your own roles/assistant instructions with a prompt and interact with them." },
    { name: "Personal Database (in progress)", description: "Utilize an advanced vector database engine for powerful data searches." },
    { name: "Midjourney (in progress)", description: "Image generative AI Midjourney support." },
  ];

  const sub_features = [
    { name: "Full-screen mode and split-screen mode", description: "For easy use requiring extensive input and output, such as programmers, essay writer." },
    { name: "De-hallucination(`self_eval_score`)", description: "Detect hallucinations in chat to provide more trustworthiness, use command \`:stats on\`." },
    { name: "TTS voice", description: "Reading with an option to select from the system's local TTS voice library." },
    { name: "Themes", description: "Supports 3 themes: Light mode, Dark mode, and Matrix-style Terminal mode." },
    { name: "Function calls", description: "Such as weather and time queries, etc." },
    { name: "Location-based query", description: "Questioning based on user's geographic location information. e.g., answering \"How's the weather today?\" by automatically obtaining the location." },
    { name: "Page redirection", description: "Jump to a specified page, for example: Open the official website of X University." },
    { name: "Shortcuts", description: "Supports convenient shortcut operations." },
  ];

  const shortcuts = [
    { name: "Stop generating", description: "`Control + C`." },
    { name: "Clear output", description: "`Control + R`." },
    { name: "Reset session", description: "`Control + Shift + R`, will reset with a new session." },
    { name: "Clear the input", description: "`ESC` key." },
    { name: "Unfocus from the input box", description: "`ESC` key." },
    { name: "Focus on input", description: "`Tab` or `/` key." },
    { name: "Repeat last input", description: "`Tab` key" },
    { name: "Navigate session history(logs)", description: "Arrow keys \"←\", and \"→\". Note: before navigating unfocus from the input area." },
  ];

  const content = (
    <>
      <div>Introduction</div>
      <div className="mt-2">
        Simple AI (`simple-ai.io`) is a command-based AI chat application that focus on the cutting-edge AI technology. It provides a simple and easy-to-use interface for everyone to interact with the AI models. Simple AI is open-source; you can visit our GitHub repository (<a href="https://github.com/gcc3/simple-ai-chat"><u>link</u></a>) to report any issues you encounter, share your ideas or contribute to the project.
      </div>
      <div className="mt-5">Main Features</div>
      <div>
        {features.map((item, index) => (
          <div key={index} className="mt-2">
            <div>- {item.name}</div>
            <div>{item.description}</div>
          </div>
        ))}
      </div>
      <div className="mt-5">Other Features</div>
      <div>
        {sub_features.map((item, index) => (
          <div key={index} className="mt-2">
            <div>- {item.name}</div>
            <div>{item.description}</div>
          </div>
        ))}
      </div>
      <div className="mt-5">Shurtcuts</div>
      <div className="mt-2">
        {shortcuts.map((item, index) => (
          <div key={index}>
            <div>{item.name} - {item.description}</div>
          </div>
        ))}
      </div>
    </>
  )

  return (
    <div className="Documentation">
      <div className="text-center mb-4">
        <div>Welcome to the simple-ai.io</div>
      </div>
      <div>{content}</div>
    </div>
  );
};

export default Documentation;